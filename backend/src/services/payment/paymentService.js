const db = require("../../config/database");
const { hashToken } = require("../../utils/bookingSessionToken");
const bookingSessionRepository = require("../../repositories/booking/bookingSessionRepository");
const bookingSessionCustomerRepository = require("../../repositories/booking/bookingSessionCustomerRepository");
const bookingSessionQuoteRepository = require("../../repositories/booking/bookingSessionQuoteRepository");
const bookingRepository = require("../../repositories/booking/bookingRepository");
const bookingPaymentRepository = require("../../repositories/booking/bookingPaymentRepository");
const razorpayService = require("./razorpayService");

/**
 * Creates a payment order for the current booking session.
 *
 * @param {string} rawToken
 */
async function createPaymentOrder(rawToken) {
    const sessionTokenHash = hashToken(rawToken);

    // 1. Validate Session
    const session = await bookingSessionRepository.getSessionByHash(sessionTokenHash);
    if (!session) {
        throw { statusCode: 404, message: "Booking session not found." };
    }
    if (session.status !== 'ACTIVE') {
        throw { statusCode: 400, message: "Booking session is not active." };
    }
    if (new Date() > new Date(session.expires_at)) {
        throw { statusCode: 401, code: "SESSION_EXPIRED", message: "Booking session has expired." };
    }

    // 2. Validate Customer
    const customer = await bookingSessionCustomerRepository.getCustomerBySessionId(session.id);
    if (!customer) {
        throw { statusCode: 400, message: "Customer information is missing." };
    }

    // 3. Validate Quote
    const quote = await bookingSessionQuoteRepository.getLatestQuote(session.id);
    if (!quote) {
        throw { statusCode: 400, message: "No valid quote found for this session." };
    }
    if (new Date() > new Date(quote.expires_at)) {
        throw { statusCode: 400, message: "Quote has expired. Please refresh your session." };
    }
    const grandTotal = Number(quote.grand_total);
    if (isNaN(grandTotal) || grandTotal <= 0) {
        throw { statusCode: 400, message: "Invalid quote amount." };
    }

    const currency = quote.currency || 'INR';

    // 4. Idempotency Check
    // Check if we already created a PAYMENT_PENDING booking for this exact session
    // We can use the `remarks` field in `bookings` to store the session_id
    const [existingBookings] = await db.execute(
        'SELECT * FROM bookings WHERE booking_status = "PAYMENT_PENDING" AND remarks LIKE ? ORDER BY created_at DESC LIMIT 1',
        [`%{"sessionId":${session.id}}%`]
    );

    let bookingId;
    let bookingNumber;

    if (existingBookings.length > 0) {
        const existingBooking = existingBookings[0];
        bookingId = existingBooking.id;
        bookingNumber = existingBooking.booking_number;

        // Check if there is already a PENDING payment for this booking with the exact same amount
        const existingPayment = await bookingPaymentRepository.getPendingPaymentByBookingId(bookingId);
        if (existingPayment && existingPayment.amount == grandTotal && existingPayment.currency == currency) {
            // Safe to reuse this Razorpay order
            return {
                keyId: process.env.RAZORPAY_KEY_ID,
                orderId: existingPayment.gateway_order_id,
                amount: Math.round(grandTotal * 100),
                currency: currency,
                bookingId: bookingId
            };
        }
        // If amount changed or no pending payment, we just proceed to create a new payment record for the same booking.
    } else {
        // Create the `bookings` record
        const visitDateStr = new Date(session.visit_date).toISOString().split('T')[0];
        bookingNumber = await bookingRepository.generateBookingNumber(visitDateStr);

        const items = await db.execute('SELECT * FROM booking_session_items WHERE session_id = ?', [session.id]).then(res => res[0]);
        let paid_visitors = 0, free_visitors = 0;
        for (const item of items) {
            if (item.item_type === 'TICKET') {
                paid_visitors += item.paid_quantity || item.quantity;
                free_visitors += item.free_quantity || 0;
            }
        }
        const total_visitors = paid_visitors + free_visitors;

        const bookingData = {
            booking_number: bookingNumber,
            user_id: session.user_id,
            guest_name: customer.leadTravellerName,
            guest_email: customer.email,
            guest_mobile: customer.mobile,
            visit_date: session.visit_date,
            ticket_subtotal: quote.ticket_subtotal,
            meal_subtotal: quote.addon_subtotal,
            subtotal: quote.subtotal,
            offer_discount: quote.offer_discount,
            coupon_discount: quote.coupon_discount,
            total_discount: quote.total_discount,
            ticket_tax: quote.ticket_tax,
            food_tax: quote.addon_tax,
            total_tax: quote.total_tax,
            convenience_fee: quote.convenience_fee,
            grand_total: quote.grand_total,
            paid_visitors,
            free_visitors,
            total_visitors,
            offer_id: session.offer_id,
            booking_status: 'PAYMENT_PENDING',
            payment_status: 'PENDING',
            remarks: JSON.stringify({ sessionId: session.id }),
            whatsapp_delivery: customer.whatsappDelivery === true ? 1 : 0
        };

        bookingId = await bookingRepository.createBooking(bookingData);
        if (items && items.length > 0) {
            await bookingRepository.createBookingItems(bookingId, items);
        }
    }

    // 5. Create Razorpay Order
    // Amount must be in subunits
    const amountInSubunits = Math.round(grandTotal * 100);
    const rzpOrder = await razorpayService.createOrder(amountInSubunits, currency, bookingNumber);

    // 6. Create `booking_payments` record
    const paymentData = {
        booking_id: bookingId,
        payment_gateway: 'RAZORPAY',
        payment_method: null,
        amount: grandTotal,
        currency: currency,
        payment_status: 'PENDING',
        gateway_order_id: rzpOrder.id,
        gateway_response: rzpOrder
    };

    await bookingPaymentRepository.createBookingPayment(paymentData);

    // 7. Session remains ACTIVE until payment is actually verified.

    return {
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: rzpOrder.id,
        amount: amountInSubunits,
        currency: currency,
        bookingId: bookingId,
        bookingNumber: bookingNumber
    };
}

const crypto = require("crypto");

/**
 * Verifies a Razorpay payment signature and updates the database.
 *
 * @param {string} razorpayOrderId
 * @param {string} razorpayPaymentId
 * @param {string} razorpaySignature
 */
async function processSuccessfulPayment(razorpayOrderId, razorpayPaymentId, gatewayResponse) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Find and lock the local booking payment attempt
        // The repository adds FOR UPDATE when connection !== db to lock this row safely
        const payment = await bookingPaymentRepository.getPaymentByGatewayOrderId(razorpayOrderId, connection);
        if (!payment) {
            throw { statusCode: 404, message: "Payment record not found for the given order ID." };
        }

        if (payment.payment_gateway !== 'RAZORPAY') {
            throw { statusCode: 400, message: "Invalid payment gateway for this order." };
        }

        // 2. Find and lock the parent booking row (MUST happen in this order)
        const booking = await bookingRepository.getBookingById(payment.booking_id, connection);
        if (!booking) {
            throw { statusCode: 404, message: "Parent booking not found." };
        }

        // 3. Evaluate combined states while both rows are protected

        // CASE A - Payment already SUCCESS
        if (payment.payment_status === 'SUCCESS') {
            if (payment.gateway_payment_id === razorpayPaymentId) {
                await connection.commit();
                return {
                    success: true,
                    message: "Payment already verified successfully",
                    data: {
                        bookingId: booking.id,
                        bookingNumber: booking.booking_number,
                        invoiceNumber: booking.invoice_number,
                        qr_token: booking.qr_token,
                        paymentId: payment.gateway_payment_id,
                        status: "SUCCESS"
                    }
                };
            } else {
                throw { statusCode: 400, message: "Payment already marked success with a different payment ID." };
            }
        }

        // CASE C - Booking already CONFIRMED
        if (booking.booking_status === 'CONFIRMED') {
            await bookingPaymentRepository.updatePaymentSuccess(payment.id, razorpayPaymentId, gatewayResponse, connection);
            await bookingPaymentRepository.markPaymentForReconciliation(payment.id, connection);
            await connection.commit();
            return {
                success: true,
                isNewSuccess: false, // Do not trigger notifications
                message: "Booking is already confirmed by another payment attempt."
            };
        }

        // CASE D - Booking CANCELLED and delayed payment arrives
        if (booking.booking_status === 'CANCELLED') {
            await bookingPaymentRepository.updatePaymentSuccess(payment.id, razorpayPaymentId, gatewayResponse, connection);
            await bookingPaymentRepository.markPaymentForReconciliation(payment.id, connection);
            await connection.commit();
            return {
                success: true,
                isNewSuccess: false,
                requiresManualReview: true,
                reason: "BOOKING_ALREADY_CANCELLED"
            };
        }

        // Validate normal path
        if (payment.payment_status !== 'PENDING') {
            throw { statusCode: 400, message: `Payment is in ${payment.payment_status} state.` };
        }

        // CASE B - Normal success path
        // Generate Invoice Number
        const currentDate = new Date().toISOString().split('T')[0];
        const invoiceNumber = await bookingRepository.generateInvoiceNumber(currentDate, connection);

        // Generate QR Token
        const qrToken = crypto.randomBytes(32).toString("hex");

        // Update booking_payments
        await bookingPaymentRepository.updatePaymentSuccess(payment.id, razorpayPaymentId, gatewayResponse, connection);

        // Update bookings
        await bookingRepository.updateBookingPaymentStatus(payment.booking_id, 'CONFIRMED', 'SUCCESS', connection);
        await bookingRepository.updateBookingInvoiceNumber(payment.booking_id, invoiceNumber, connection);
        await bookingRepository.updateBookingQrToken(payment.booking_id, qrToken, connection);

        await connection.commit();

        return {
            success: true,
            message: "Payment verified successfully",
            isNewSuccess: true, // indicates to caller whether to send notification
            data: {
                bookingId: booking.id,
                bookingNumber: booking.booking_number,
                invoiceNumber: invoiceNumber,
                qr_token: qrToken,
                paymentId: razorpayPaymentId,
                status: "SUCCESS"
            }
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Verifies a Razorpay payment signature and updates the database.
 *
 * @param {string} razorpayOrderId
 * @param {string} razorpayPaymentId
 * @param {string} razorpaySignature
 */
async function verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw { statusCode: 400, message: "Missing required payment verification parameters." };
    }

    // Generate expected signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");

    // Secure comparison
    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpaySignature);

    let isAuthentic = false;
    if (expectedBuffer.length === receivedBuffer.length) {
        isAuthentic = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    }

    if (!isAuthentic) {
        throw { statusCode: 400, message: "Invalid payment signature." };
    }

    const gatewayResponse = {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature
    };

    return await processSuccessfulPayment(razorpayOrderId, razorpayPaymentId, gatewayResponse);
}

/**
 * Handles Razorpay webhook securely.
 */
async function handleWebhook(rawBody, signature, payload) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
        throw { statusCode: 500, message: "RAZORPAY_WEBHOOK_SECRET is not configured." };
    }

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(signature);

    let isAuthentic = false;
    if (expectedBuffer.length === receivedBuffer.length) {
        isAuthentic = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    }

    if (!isAuthentic) {
        throw { statusCode: 400, message: "Invalid webhook signature." };
    }

    const event = payload.event;

    if (event === 'payment.captured') {
        const orderId = payload.payload.payment.entity.order_id;
        const paymentId = payload.payload.payment.entity.id;

        // Use full payload as gatewayResponse to store exactly what webhook sent
        const result = await processSuccessfulPayment(orderId, paymentId, payload);

        if (result.isNewSuccess) {
            // Send notifications via background task
            const bookingNotificationService = require("../booking/bookingNotificationService");
            bookingNotificationService.sendBookingConfirmation(result.data.bookingId)
                .catch(error => {
                    console.error("[BOOKING NOTIFICATION] Webhook background task failed:", error);
                });
        }
        return result;
    }

    return { success: true, message: "Event ignored" };
}

module.exports = {
    createPaymentOrder,
    verifyPayment,
    handleWebhook
};
