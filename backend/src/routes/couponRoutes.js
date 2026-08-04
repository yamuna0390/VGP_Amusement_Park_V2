const express = require("express");

const router = express.Router();

const couponController = require("../controllers/couponController");

/**
 * ==========================================
 * Customer Coupon APIs
 * ==========================================
 */

/**
 * GET /api/coupons
 * GET /api/coupons?visitDate=YYYY-MM-DD
 */
router.get("/", couponController.getCoupons);

module.exports = router;