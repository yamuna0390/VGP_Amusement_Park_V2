const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/payments/initiate — start a payment (optional auth)
router.post("/initiate", authMiddleware, paymentController.initiatePayment);

// POST /api/payments/confirm — confirm payment success (gateway callback / simulated)
router.post("/confirm", authMiddleware, paymentController.confirmPayment);

// POST /api/payments/fail — mark payment as failed
router.post("/fail", authMiddleware, paymentController.failPayment);

module.exports = router;
