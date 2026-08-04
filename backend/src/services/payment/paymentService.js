const bookingRepository = require("../../repositories/booking/bookingRepository");

/**
 * Payment Service — Simulated payment flow
 * 
 * In production, replace with a real payment gateway (Razorpay / PayU / Stripe).
 * This service simulates:
 *   initiate  → returns a payment order with a simulated order ID
 *   confirm   → marks payment as Completed and booking as Confirmed
 *   fail      → marks payment as Failed, booking stays Pending Payment
 */

/**
 * Initiate a payment for a booking.
 * @param {number} bookingId
 * @param {number} amount  — grand total in rupees
 * @returns {{ orderId, amount, currency, bookingId }}
 */
const initiatePayment = async (bookingId, amount) => {
  const booking = await bookingRepository.getBookingById(bookingId);
  if (!booking) throw new Error("Booking not found.");
  if (booking.payment_status === "Completed") throw new Error("Booking is already paid.");

  // Generate a simulated order ID (replace with gateway call in production)
  const orderId = `VGP-PAY-${Date.now()}-${bookingId}`;

  return {
    orderId,
    bookingId,
    amount: Number(amount || booking.grand_total),
    currency: "INR",
    bookingNumber: booking.booking_number,
  };
};

/**
 * Confirm a payment (called after successful gateway callback or direct confirmation).
 * @param {number} bookingId
 * @param {string} transactionId
 */
const confirmPayment = async (bookingId, transactionId) => {
  const booking = await bookingRepository.getBookingById(bookingId);
  if (!booking) throw new Error("Booking not found.");

  await bookingRepository.updateBookingStatus(
    null,
    bookingId,
    "Confirmed",
    "Completed"
  );

  return {
    bookingId,
    bookingNumber: booking.booking_number,
    transactionId: transactionId || `TXN-${Date.now()}`,
    paymentStatus: "Completed",
    bookingStatus: "Confirmed",
    message: "Payment confirmed. Booking is now active.",
  };
};

/**
 * Fail a payment (called on gateway failure callback).
 * @param {number} bookingId
 */
const failPayment = async (bookingId) => {
  await bookingRepository.updateBookingStatus(null, bookingId, "Pending Payment", "Failed");
  return { bookingId, paymentStatus: "Failed", bookingStatus: "Pending Payment" };
};

module.exports = {
  initiatePayment,
  confirmPayment,
  failPayment,
};
