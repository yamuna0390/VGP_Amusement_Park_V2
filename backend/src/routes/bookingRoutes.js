const express = require("express");

const router = express.Router();

const bookingController = require("../controllers/bookingController");
const validate = require("../middleware/validationMiddleware");

const {
    bookingSchema,
    validateDateSchema
} = require("../validations/bookingRequestValidator");

/**
 * ==========================================
 * Public Booking APIs
 * ==========================================
 */

/**
 * Validate Visit Date & Return Valid Offers
 *
 * POST /api/bookings/validate-date
 */
router.post(
    "/validate-date",
    validate(validateDateSchema),
    bookingController.validateVisitDate
);

/**
 * Create Booking
 *
 * POST /api/bookings
 */
router.post(
    "/",
    validate(bookingSchema),
    bookingController.createBooking
);

/**
 * Find Booking
 *
 * POST /api/bookings/find
 *
 * Used by customers to retrieve an existing booking.
 */
router.post(
    "/find",
    bookingController.getBooking
);

/**
 * Customer Booking History
 *
 * GET /api/bookings/customer/:customerId
 */
router.get(
    "/customer/:customerId",
    bookingController.getCustomerBookings
);

/**
 * Validate Coupon Code
 *
 * POST /api/bookings/validate-coupon
 */
router.post(
    "/validate-coupon",
    bookingController.validateCoupon
);

/**
 * Final Booking Review
 *
 * POST /api/bookings/finalreview
 */
router.post(
    "/finalreview",
    bookingController.finalReview
);

module.exports = router;