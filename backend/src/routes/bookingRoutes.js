const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/booking/internal-render/:id
// Internal endpoint for headless PDF generation
router.get("/internal-render/:id", bookingController.getInternalRenderData);

// POST /api/booking/session
// authMiddleware is optional here because the user may be a guest
// Let's use authMiddleware but it already sets req.user = null if no token is provided,
// so we can safely use it.
router.post("/session", authMiddleware, bookingController.createSession);

// PATCH /api/booking/session
// Updates the visit date and/or selected offer.
// Cookie is required, no authMiddleware needed as session handles it.
router.patch("/session", bookingController.updateSession);

// PUT /api/booking/session/items
// Replaces session items.
router.put("/session/items", bookingController.updateSessionItems);

// PUT /api/booking/session/customer
// Updates customer information.
router.put("/session/customer", bookingController.updateCustomer);

const paymentController = require("../controllers/paymentController");

// POST /api/booking/session/quote
// Generates quote.
router.post("/session/quote", bookingController.generateQuote);

// POST /api/booking/payment/order
// Generates a Razorpay payment order for the current session.
router.post("/payment/order", paymentController.createPaymentOrder);

const validate = require("../middleware/validationMiddleware");
const { verifyPaymentSchema } = require("../validations/bookingValidation");

// POST /api/booking/payment/verify
// Verifies the Razorpay payment signature.
router.post("/payment/verify", validate(verifyPaymentSchema), paymentController.verifyPayment);

// POST /api/booking/payment/webhook
// Razorpay webhook receiver
router.post("/payment/webhook", paymentController.handleWebhook);

// GET /api/booking/my-bookings
// Gets bookings for logged in customer
router.get("/my-bookings", authMiddleware, bookingController.getMyBookings);

// GET /api/booking/my-bookings/:id/pdf
// Downloads PDF for a specific authenticated booking
router.get("/my-bookings/:id/pdf", authMiddleware, bookingController.downloadMyBookingPdf);

module.exports = router;
