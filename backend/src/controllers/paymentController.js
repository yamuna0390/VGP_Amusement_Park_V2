const paymentService = require("../services/payment/paymentService");
const { success } = require("../utils/response");

/**
 * POST /api/payments/initiate
 * Body: { bookingId, amount }
 * Returns a simulated payment order.
 */
const initiatePayment = async (req, res, next) => {
  try {
    const { bookingId, amount } = req.body;
    if (!bookingId) {
      return res.status(400).json({ success: false, message: "bookingId is required." });
    }
    const order = await paymentService.initiatePayment(Number(bookingId), Number(amount));
    return success(res, "Payment initiated", order);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/confirm
 * Body: { bookingId, transactionId }
 * Marks payment as Completed and booking as Confirmed.
 */
const confirmPayment = async (req, res, next) => {
  try {
    const { bookingId, transactionId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ success: false, message: "bookingId is required." });
    }
    const result = await paymentService.confirmPayment(Number(bookingId), transactionId);
    return success(res, "Payment confirmed. Booking is now active.", result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/fail
 * Body: { bookingId }
 * Marks payment as Failed.
 */
const failPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ success: false, message: "bookingId is required." });
    }
    const result = await paymentService.failPayment(Number(bookingId));
    return success(res, "Payment failed.", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initiatePayment,
  confirmPayment,
  failPayment,
};
