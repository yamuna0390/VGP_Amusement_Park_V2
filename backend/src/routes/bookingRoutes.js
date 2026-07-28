const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { bookingSchema } = require("../validations/bookingValidation");

// POST /api/bookings/calculate (Calculate pricing/discounts in real-time)
router.post("/calculate", authMiddleware, bookingController.calculateBooking);

// GET /api/bookings/:bookingNumber (Get booking details, invoice items & guest info)
router.get("/:bookingNumber", authMiddleware, bookingController.getBookingDetails);

// POST /api/bookings/find (Guest booking lookup)
router.post("/find", bookingController.findBooking);

// GET /api/bookings/my (Logged-in user bookings)
router.get("/my", authMiddleware, bookingController.getMyBookings);

// POST /api/bookings (Create booking - optional auth)
router.post(
  "/",
  authMiddleware,
  validate(bookingSchema),
  bookingController.createBooking
);

module.exports = router;