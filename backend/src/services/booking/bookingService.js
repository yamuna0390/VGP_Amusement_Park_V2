const db = require("../../config/database");

// Repositories
const bookingRepository = require("../../repositories/booking/bookingRepository");
const bookingItemRepository = require("../../repositories/booking/bookingItemRepository");
const bookingPaymentRepository = require("../../repositories/booking/bookingPaymentRepository");
const bookingSequenceRepository = require("../../repositories/booking/bookingSequenceRepository");
const couponRepository = require("../../repositories/catalog/couponRepository");
const ticketRepository = require("../../repositories/catalog/ticketRepository");
const mealRepository = require("../../repositories/catalog/mealRepository");

// Business Services & Engines
const pricingEngine = require("./pricingEngine");
const offerEngine = require("./offerEngine");
const couponEngine = require("./couponEngine");
const parkSettingsService = require("./parkSettingsService");
const ticketService = require("./ticketService");

// Utilities & Constants
const { generateBookingNumber } = require("./bookingNumberGenerator");
const {
    DEFAULT_BOOKING,
    RESPONSE_MESSAGE
} = require("../../constants/bookingConstants");
// DTOs
const BookingResponseDTO = require("../../dto/BookingResponseDTO");

/**
 * Booking Service - Orchestration Layer
 *
 * Responsibilities:
 * - Orchestrate booking transaction workflow across business engines and repositories
 * - Manage atomic MySQL database transactions (BEGIN, COMMIT, ROLLBACK)
 * - Delegate pricing calculation and discount evaluation to dedicated business engines
 * - Persist booking records, itemized invoice lines, and pending payment records via repositories
 * - Enforce strict zero-trust security by relying exclusively on PricingResultDTO for financial totals
 */

/**
 * Obtains a connection from the database pool and initiates an atomic transaction.
 *
 * @param {Object} connectionPool - Database pool with getConnection interface
 * @returns {Promise<Object>} Active transaction connection
 */
async function beginTransaction(connectionPool) {
    const connection = await connectionPool.getConnection();
    await connection.beginTransaction();
    return connection;
}

/**
 * Allocates a daily booking sequence and formats the customer-facing booking reference number.
 *
 * @param {Object} connection - MySQL transaction connection
 * @param {string} visitDate - Target visit date string
 * @returns {Promise<string>} Formatted booking number (e.g. VGP290726000001)
 */
async function generateBookingNumberForDate(connection, visitDate) {
    const sequence = await bookingSequenceRepository.allocateSequence(connection, visitDate);
    return generateBookingNumber(visitDate, sequence);
}

/**
 * Orchestrates pricing calculations and promotional discounts.
 * Enforces the frozen discount policy: only ONE promotional rule per booking, prioritizing Offer over Coupon.
 *
 * @param {Object} connection - MySQL transaction connection
 * @param {Object} bookingRequest - Validated incoming booking request DTO
 * @returns {Promise<{ pricingResult: Object, appliedOffer: Object|null, appliedCoupon: Object|null }>}
 */
async function calculateBookingPrice(connection, bookingRequest) {
    const pricingResult = await pricingEngine.calculatePricing(connection, bookingRequest);

    let appliedOffer = null;
    let appliedCoupon = null;

    if (bookingRequest.offerCode) {
        const offer = await offerRepository.getOfferByCode(connection, bookingRequest.offerCode);
        if (offer) {
            await offerEngine.applyOffer(pricingResult, bookingRequest, offer, connection);
            if (pricingResult.offerDiscount > 0) {
                appliedOffer = offer;
            }
        }
    }

    // Enforce promotional priority policy (Offer > Coupon): evaluate coupon only if no offer was successfully applied
    if (!appliedOffer && bookingRequest.couponCode) {
        const coupon = await couponRepository.getCouponByCode(connection, bookingRequest.couponCode);
        if (coupon) {
            await couponEngine.applyCoupon(pricingResult, bookingRequest, coupon, connection);
            if (pricingResult.couponDiscount > 0) {
                appliedCoupon = coupon;
            }
        }
    }

    // Execute financial integrity validation immediately before returning PricingResultDTO to BookingService
    pricingEngine.validateFinancialIntegrity(pricingResult);

    return {
        pricingResult,
        appliedOffer,
        appliedCoupon
    };
}

/**
 * Maps engine-derived pricing totals and request guest details to the booking entity and saves to repository.
 * Enforces security by ignoring any client-submitted monetary totals or discounts.
 *
 * @param {Object} connection - MySQL transaction connection
 * @param {string} bookingNumber - Generated unique booking number
 * @param {Object} pricingResult - Calculated PricingResultDTO
 * @param {Object} bookingRequest - Validated BookingRequestDTO
 * @param {Object|null} appliedOffer - Successfully applied offer row
 * @param {Object|null} appliedCoupon - Successfully applied coupon row
 * @returns {Promise<number>} Newly inserted database booking ID
 */
async function createBookingRecord(connection, bookingNumber, pricingResult, bookingRequest, appliedOffer, appliedCoupon) {
    const bookingData = {
        bookingNumber: bookingNumber,
        userId: bookingRequest.userId !== undefined && bookingRequest.userId !== null ? Number(bookingRequest.userId) : null,
        guestName: bookingRequest.customer?.name || "",
        guestEmail: bookingRequest.customer?.email || "",
        guestMobile: bookingRequest.customer?.mobile || "",
        visitDate: bookingRequest.visitDate,

        ticketSubtotal: pricingResult.ticketSubtotal,
        mealSubtotal: pricingResult.mealSubtotal,
        subtotal: pricingResult.subtotal,

        offerDiscount: pricingResult.offerDiscount,
        couponDiscount: pricingResult.couponDiscount,
        totalDiscount: pricingResult.totalDiscount,

        ticketTax: pricingResult.ticketTax,
        foodTax: pricingResult.foodTax,
        totalTax: pricingResult.totalTax,

        convenienceFee: pricingResult.convenienceFee,
        grandTotal: pricingResult.grandTotal,

        paidVisitors: pricingResult.paidVisitors,
        freeVisitors: pricingResult.freeVisitors,
        totalVisitors: pricingResult.totalVisitors,

        offerId: appliedOffer ? (appliedOffer.id || null) : null,
        offerCode: appliedOffer ? (appliedOffer.offer_code || null) : null,
        offerName: appliedOffer ? (appliedOffer.offer_name || null) : null,

        couponId: appliedCoupon ? (appliedCoupon.id || null) : null,
        couponCode: appliedCoupon ? (appliedCoupon.coupon_code || null) : null,

    bookingStatus: DEFAULT_BOOKING.STATUS,

paymentStatus: DEFAULT_BOOKING.PAYMENT_STATUS,
        remarks: bookingRequest.remarks || null
    };

   return bookingRepository.createBooking(connection, bookingData);
}

/**
 * Persists all itemized invoice line entries directly into the booking items repository.
 *
 * @param {Object} connection - MySQL transaction connection
 * @param {number} bookingId - Target parent booking ID
 * @param {Array<Object>} invoiceItems - Standardized line items from PricingResultDTO
 * @returns {Promise<void>}
 */
async function createBookingItems(connection, bookingId, invoiceItems) {
    await bookingItemRepository.createBookingItems(connection, bookingId, invoiceItems);
}

/**
 * Creates an initial payment record in PENDING status using the configured payment defaults and engine grandTotal.
 *
 * @param {Object} connection - MySQL transaction connection
 * @param {number} bookingId - Target parent booking ID
 * @param {number} grandTotal - Engine calculated payment payable amount
 * @returns {Promise<number>} Newly inserted payment ID
 */
async function createPaymentRecord(connection, bookingId, grandTotal) {
const paymentData = {

    bookingId,

    paymentGateway: DEFAULT_BOOKING.PAYMENT_GATEWAY,

    paymentMethod: DEFAULT_BOOKING.PAYMENT_METHOD,

    transactionId: null,

    gatewayOrderId: null,

    gatewayPaymentId: null,

    amount: grandTotal,

    currency: DEFAULT_BOOKING.CURRENCY,

    paymentStatus: DEFAULT_BOOKING.PAYMENT_STATUS

};

    return  bookingPaymentRepository.createPayment(connection, paymentData);
}

/**
 * Constructs the frozen business response contract containing only core booking status and totals.
 * Strips non-business HTTP download links and unrequired metadata.
 *
 * @param {string} bookingNumber - Generated customer booking reference
 * @param {Object} bookingRequest - Validated request containing visit Date
 * @param {Object} pricingResult - Calculated pricing result
 * @returns {BookingResponseDTO}
 */
function buildBookingResponse(bookingNumber, bookingRequest, pricingResult) {
    const response = new BookingResponseDTO();
    response.success = true;
    response.message = RESPONSE_MESSAGE.BOOKING_CREATED;

    if (response.booking) {
        response.booking.bookingNumber = bookingNumber;
        response.booking.visitDate = bookingRequest.visitDate;
      response.booking.bookingStatus = DEFAULT_BOOKING.STATUS;

response.booking.paymentStatus = DEFAULT_BOOKING.PAYMENT_STATUS;
        response.booking.grandTotal = pricingResult.grandTotal;
    }

    // Remove HTTP URLs and non-business data to freeze the response contract to pure business fields
    delete response.download;
    delete response.payment;

    return response;
}

/**
 * Safely executes transaction rollback upon encountering any failure during orchestration.
 *
 * @param {Object} connection - MySQL transaction connection
 * @returns {Promise<void>}
 */
async function rollbackTransaction(connection) {
    if (connection && typeof connection.rollback === "function") {
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Error occurred during transaction rollback:", rollbackError);
        }
    }
}

/**
 * Public API: Orchestrates the atomic amusement park booking workflow.
 * Assumes receipt of an already validated BookingRequestDTO from the controller layer.
 *
 * Transaction Flow:
 * BEGIN -> Generate Booking Number -> Calculate Booking Price -> Create Booking
 * -> Create Booking Items -> Create Payment -> COMMIT -> Return Response
 * (Any step failure triggers ROLLBACK; connection is guaranteed to release)
 *
 * @param {Object} connectionPool - Database connection pool providing getConnection()
 * @param {Object} bookingRequest - Validated BookingRequestDTO instance
 * @returns {Promise<BookingResponseDTO>} Standardized business response contract
 */
async function createBooking(bookingRequest) {
    // 1. BEGIN
    const connection = await beginTransaction(db);

    try {
        // 2. Generate Booking Number
        const bookingNumber = await generateBookingNumberForDate(connection, bookingRequest.visitDate);

        // 3. Calculate Booking Price
        const { pricingResult, appliedOffer, appliedCoupon } = await calculateBookingPrice(connection, bookingRequest);

        // 4. Create Booking
        const bookingId = await createBookingRecord(connection, bookingNumber, pricingResult, bookingRequest, appliedOffer, appliedCoupon);

        // 5. Create Booking Items
        await createBookingItems(connection, bookingId, pricingResult.invoiceItems);

        // 6. Create Payment
        await createPaymentRecord(connection, bookingId, pricingResult.grandTotal);

        // 7. COMMIT
        await connection.commit();

        // 8. Return Response
        return buildBookingResponse(bookingNumber, bookingRequest, pricingResult);

    } catch (error) {
        // If any step fails: ROLLBACK
        await rollbackTransaction(connection);
        throw error;
    } finally {
        // Always release connection
        if (connection && typeof connection.release === "function") {
            connection.release();
        }
    }
}

/**
 * Retrieve customer bookings by user ID using existing read repository contract.
 *
 * @param {number|string} customerId
 * @returns {Promise<Array>}
 */
/**
 * Get all bookings for a customer.
 *
 * @param {number} customerId
 * @returns {Promise<Array>}
 */
async function getCustomerBookings(customerId) {

    return await bookingRepository.findByUserId(
        db,
        customerId
    );

}

/**
 * Retrieve and authenticate booking details by number and guest contact verification.
 *
 * @param {Object} query - Object with bookingNumber, mobileNumber, and/or email
 * @returns {Promise<Object>}
 */
async function getBookingForCustomer({ bookingNumber, mobileNumber, email }) {
    const booking = await bookingRepository.findByBookingNumber(db, bookingNumber);
    if (!booking) {
       throw new Error(RESPONSE_MESSAGE.BOOKING_NOT_FOUND);
    }

    const matchMobile = mobileNumber && booking.guest_mobile === mobileNumber;
    const matchEmail = email && booking.guest_email && booking.guest_email.toLowerCase() === (email || "").toLowerCase();

    if (!matchMobile && !matchEmail) {
       throw new Error(RESPONSE_MESSAGE.INVALID_BOOKING_DETAILS);
    }

    const items = await bookingItemRepository.findByBookingId(db, booking.id);
    const payment = await bookingPaymentRepository.findByBookingId(db, booking.id);

    return {
        ...booking,
        items,
        payment
    };
}

/**
 * Formats offer database row for frontend visit date validation response.
 * Excludes internal/filtering fields and converts monetary/numeric strings into JavaScript numbers.
 * Delegates to OfferResponseDTO for unified presentation mapping.
 *
 * @param {Object} offer - Raw offer database row
 * @returns {OfferResponseDTO} Frontend-friendly offer object
 */

/**
 * Validates the proposed visit date against date validity rules and park advance booking limits,
 * then retrieves and formats all active offers valid for that date without applying discounts or calculation logic.
 *
 * @param {string} visitDate - Target visit date (YYYY-MM-DD)
 * @param {Object} [connection=db] - Database connection or pool
 * @returns {Promise<{ visitDate: string, offers: Array }>}
 */
async function validateVisitDate(visitDate, connection = db) {
    if (!visitDate || typeof visitDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) {
        const error = new Error("Visit date must be in YYYY-MM-DD format.");
        error.statusCode = 400;
        throw error;
    }

    // Validate booking date against past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(visitDate + "T00:00:00");

    if (isNaN(targetDate.getTime()) || targetDate < today) {
        const error = new Error("Visit date cannot be in the past.");
        error.statusCode = 400;
        throw error;
    }

    // Validate maximum advance booking days using single source of truth park settings
    const settings = await parkSettingsService.getParkSettings(connection);
    const maxDays = settings.max_booking_days !== undefined ? Number(settings.max_booking_days) : 90;
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    if (targetDate > maxDate) {
        const error = new Error(`Visit date exceeds maximum advance booking limit of ${maxDays} days.`);
        error.statusCode = 400;
        throw error;
    }
// Load regular tickets
const regularTickets =
    await ticketService.getRegularTickets(connection);

// Offer booking is allowed only for bookings made at least 1 day in advance
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const allowOffers = targetDate >= tomorrow;

let offerTickets = [];

if (allowOffers) {
    offerTickets =
        await ticketService.getOfferTickets(
            connection,
            visitDate
        );
}

return {
    visitDate,
    allowOffers,
    regularTickets,
    offerTickets
};
}

/**
 * Validate a coupon code and verify eligibility (Phase 1)
 * POST /api/booking/validate-coupon
 */
async function validateCouponRequest(payload = {}) {
    const { visitDate, couponCode } = payload;
    
    if (!couponCode || typeof couponCode !== "string" || !couponCode.trim()) {
        return { success: false, message: "Invalid or expired coupon." };
    }
    
    const cleanCode = couponCode.trim().toUpperCase();
    const connection = db;
    
    const coupon = await couponRepository.getCouponByCode(connection, cleanCode);
    if (!coupon || coupon.status !== 'Active') {
        return { success: false, message: "Invalid or expired coupon." };
    }
    
    if (coupon.usage_limit !== null && coupon.usage_limit !== undefined && Number(coupon.used_count) >= Number(coupon.usage_limit)) {
        return { success: false, message: "Invalid or expired coupon." };
    }
    
    if (coupon.valid_from && coupon.valid_to) {
        const checkDateStr = visitDate || new Date().toISOString().split("T")[0];
        const checkDate = new Date(checkDateStr).setHours(12, 0, 0, 0);
        const fromDate = new Date(coupon.valid_from).setHours(0, 0, 0, 0);
        const toDate = new Date(coupon.valid_to).setHours(23, 59, 59, 999);
        if (!isNaN(checkDate) && (!isNaN(fromDate) && checkDate < fromDate || !isNaN(toDate) && checkDate > toDate)) {
            return { success: false, message: "Invalid or expired coupon." };
        }
    }
    
    return {
        success: true,
        message: "Coupon is valid.",
        data: {
            couponId: coupon.id,
            couponCode: coupon.coupon_code,
            couponName: coupon.coupon_name,
            discountType: (coupon.discount_type || "").toUpperCase(),
            discountValue: Number(coupon.discount_value || 0)
        }
    };
}

/**
 * Calculate final review totals and discounts before checkout
 * POST /api/booking/finalreview
 */
async function getFinalReview(payload = {}) {
    const { visitDate, regularTickets = [], offerTickets = [], foods = [], couponCode } = payload;
    const connection = db;
    
    const dbTickets = await ticketRepository.getRegularTickets(connection);
    let ticketSubtotal = 0;
    
    for (const item of (regularTickets || [])) {
        const qty = Number(item.quantity || 0);
        if (qty <= 0) continue;
        const matched = dbTickets.find(t => t.id === item.ticketId || t.id === item.ticketTypeId || t.code === item.ticketId || t.code === item.code || t.id === item.id);
        if (matched) {
            ticketSubtotal += Number(matched.price || 0) * qty;
        }
    }
    
    let offerSubtotal = 0;
    if (offerTickets && offerTickets.length > 0) {
        const targetDate = visitDate || new Date().toISOString().split("T")[0];
        const dbOffers = await ticketRepository.getOfferTickets(connection, targetDate);
        for (const item of offerTickets) {
            const qty = Number(item.quantity || 0);
            if (qty <= 0) continue;
            const matched = dbOffers.find(o => o.offerTicketId === item.offerTicketId || o.offerTicketId === item.id || o.offerId === item.offerId);
            if (matched) {
                const price = Number(matched.unitPrice !== undefined ? matched.unitPrice : (matched.originalPrice || 0));
                offerSubtotal += price * qty;
            }
        }
    }
    
    const combinedTicketTotal = Number((ticketSubtotal + offerSubtotal).toFixed(2));

    const dbMeals = await mealRepository.getActiveMeals(connection);
    let foodTotal = 0;
    
    for (const item of (foods || [])) {
        const qty = Number(item.quantity || 0);
        if (qty <= 0) continue;
        const matched = dbMeals.find(m => m.id === item.mealTypeId || m.id === item.foodId || m.code === item.foodId || m.code === item.code || m.id === item.id);
        if (matched) {
            foodTotal += Number(matched.price || 0) * qty;
        }
    }
    foodTotal = Number(foodTotal.toFixed(2));
    
    let discountAmount = 0;
    let appliedCouponObj = null;
    
    if (couponCode && typeof couponCode === "string" && couponCode.trim() && (!offerTickets || offerTickets.length === 0 || !offerTickets.some(o => Number(o.quantity) > 0))) {
        const cleanCode = couponCode.trim().toUpperCase();
        const coupon = await couponRepository.getCouponByCode(connection, cleanCode);
        
        if (coupon && coupon.status === 'Active') {
            let valid = true;
            if (coupon.usage_limit !== null && coupon.usage_limit !== undefined && Number(coupon.used_count) >= Number(coupon.usage_limit)) {
                valid = false;
            }
            if (valid && coupon.minimum_amount && combinedTicketTotal < Number(coupon.minimum_amount)) {
                valid = false;
            }
            if (valid && coupon.valid_from && coupon.valid_to) {
                const checkDateStr = visitDate || new Date().toISOString().split("T")[0];
                const checkDate = new Date(checkDateStr).setHours(12, 0, 0, 0);
                const fromDate = new Date(coupon.valid_from).setHours(0, 0, 0, 0);
                const toDate = new Date(coupon.valid_to).setHours(23, 59, 59, 999);
                if (!isNaN(checkDate) && (!isNaN(fromDate) && checkDate < fromDate || !isNaN(toDate) && checkDate > toDate)) {
                    valid = false;
                }
            }
            if (valid) {
                appliedCouponObj = coupon;
                const discountType = (coupon.discount_type || "").toUpperCase();
                const discountValue = Number(coupon.discount_value || 0);
                if (discountType === "PERCENTAGE") {
                    discountAmount = (combinedTicketTotal * discountValue) / 100;
                } else if (discountType === "FLAT") {
                    discountAmount = discountValue;
                }
                discountAmount = Math.max(0, Math.min(discountAmount, combinedTicketTotal));
                discountAmount = Number(discountAmount.toFixed(2));
            }
        }
    }
    
    const ticketAfterDiscount = Math.max(0, Number((combinedTicketTotal - discountAmount).toFixed(2)));
    const grandTotalBeforeTaxes = Number((ticketAfterDiscount + foodTotal).toFixed(2));
    
    const parkSettings = await parkSettingsService.getParkSettings(connection);
    const ticketGstPct = Number(parkSettings?.ticketGstPercentage ?? 18);
    const foodGstPct = Number(parkSettings?.foodGstPercentage ?? 5);
    const convenienceFee = (combinedTicketTotal > 0 || foodTotal > 0) ? Number(parkSettings?.convenienceFee ?? 40) : 0;
    
    const ticketGST = Number((ticketAfterDiscount * (ticketGstPct / 100)).toFixed(2));
    const foodGST = Number((foodTotal * (foodGstPct / 100)).toFixed(2));
    const finalPayableAmount = Number((grandTotalBeforeTaxes + ticketGST + foodGST + convenienceFee).toFixed(2));
    
    return {
        success: true,
        data: {
            ticketTotal: ticketAfterDiscount,
            originalTicketTotal: combinedTicketTotal,
            foodTotal,
            grandTotal: grandTotalBeforeTaxes,
            discountAmount,
            couponName: appliedCouponObj ? appliedCouponObj.coupon_name : null,
            couponCode: appliedCouponObj ? appliedCouponObj.coupon_code : null,
            ticketGST,
            foodGST,
            convenienceFee,
            finalPayableAmount,
            payableAmount: finalPayableAmount
        }
    };
}

module.exports = {
    createBooking,
    getCustomerBookings,
    getBookingForCustomer,
    validateVisitDate,
    validateCouponRequest,
    getFinalReview
};