const paymentService = require("../services/payment/paymentService");
const bookingNotificationService = require("../services/booking/bookingNotificationService");
const { success } = require("../utils/response");

/**
 * POST /api/booking/payment/order
 * Creates a Razorpay order for the current booking session.
 */
async function createPaymentOrder(req, res, next) {
    try {
        const rawToken = req.cookies.booking_session;
        if (!rawToken) {
            throw { statusCode: 401, message: "Booking session not found. Please start a new booking." };
        }

        const data = await paymentService.createPaymentOrder(rawToken);

        return success(res, "Payment order created", data, 200);
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/booking/payment/verify
 * Verifies the Razorpay payment signature.
 */
async function verifyPayment(req, res, next) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const result = await paymentService.verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );
        
        if (result.success) {
            // Trigger background notification workflow securely decoupled from HTTP response
            bookingNotificationService.sendBookingConfirmation(result.data.bookingId)
                .catch(error => {
                    console.error("[BOOKING NOTIFICATION] Background task failed:", error);
                });
        }
        
        return success(res, result.message, result.data, 200);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createPaymentOrder,
    verifyPayment
};
