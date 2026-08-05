const express = require("express");

const router = express.Router();

const bookingInitController = require("../controllers/bookingInitController");
const bookingController = require("../controllers/bookingController");

/**
 * ==========================================
 * Booking Initialization & Coupon APIs
 * ==========================================
 */

/**
 * Get Booking Initialization Data
 *
 * GET /api/booking/init
 */
router.get(
    "/init",
    bookingInitController.getInitData
);

/**
 * Validate Coupon Code
 *
 * POST /api/booking/validate-coupon
 */
router.post(
    "/validate-coupon",
    bookingController.validateCoupon
);

/**
 * Final Booking Review
 *
 * POST /api/booking/finalreview
 */
router.post(
    "/finalreview",
    bookingController.finalReview
);

module.exports = router;
