const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/coupons/validate  — public, used by frontend CouponForm
router.post("/validate", couponController.validateCoupon);

// Coupons CRUD (admin)
router.get("/", couponController.getCoupons);
router.post("/", authMiddleware, couponController.createCoupon);
router.put("/:id", authMiddleware, couponController.updateCoupon);
router.delete("/:id", authMiddleware, couponController.deleteCoupon);

module.exports = router;
