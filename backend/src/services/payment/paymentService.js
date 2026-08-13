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
        throw { statusCode: 400, message: "Booking session has expired." };
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
            remarks: JSON.stringify({ sessionId: session.id })
        };

        bookingId = await bookingRepository.createBooking(bookingData);
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
    const isAuthentic = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpaySignature)
    );

    if (!isAuthentic) {
        throw { statusCode: 400, message: "Invalid payment signature." };
    }

    // Get connection for transaction
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Find the local booking payment
        const payment = await bookingPaymentRepository.getPaymentByGatewayOrderId(razorpayOrderId, connection);
        if (!payment) {
            throw { statusCode: 404, message: "Payment record not found for the given order ID." };
        }

        if (payment.payment_gateway !== 'RAZORPAY') {
            throw { statusCode: 400, message: "Invalid payment gateway for this order." };
        }

        // Idempotency check
        if (payment.payment_status === 'SUCCESS') {
            if (payment.gateway_payment_id === razorpayPaymentId) {
                const booking = await bookingRepository.getBookingById(payment.booking_id, connection);
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

        if (payment.payment_status !== 'PENDING') {
            throw { statusCode: 400, message: `Payment is in ${payment.payment_status} state.` };
        }

        // Generate Invoice Number
        const currentDate = new Date().toISOString().split('T')[0];
        const invoiceNumber = await bookingRepository.generateInvoiceNumber(currentDate, connection);

        // Generate QR Token
        const qrToken = crypto.randomBytes(32).toString("hex");

        // Update booking_payments
        const gatewayResponse = {
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature
        };
        await bookingPaymentRepository.updatePaymentSuccess(payment.id, razorpayPaymentId, gatewayResponse, connection);

        // Update bookings
        await bookingRepository.updateBookingPaymentStatus(payment.booking_id, 'CONFIRMED', 'SUCCESS', connection);
        await bookingRepository.updateBookingInvoiceNumber(payment.booking_id, invoiceNumber, connection);
        await bookingRepository.updateBookingQrToken(payment.booking_id, qrToken, connection);

        // Fetch booking to get booking_number for the response
        const booking = await bookingRepository.getBookingById(payment.booking_id, connection);

        await connection.commit();

        return { 
            success: true, 
            message: "Payment verified successfully",
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

module.exports = {
    createPaymentOrder,
    verifyPayment
};
