const express = require("express");

const router = express.Router();

const bookingInitController = require("../controllers/bookingInitController");

/**
 * ==========================================
 * Booking Initialization APIs
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

module.exports = router;
