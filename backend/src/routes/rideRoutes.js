const express = require("express");
const router = express.Router();
const rideController = require("../controllers/rideController");

// PUBLIC CUSTOMER ROUTES (NO AUTH REQUIRED)
router.get("/", rideController.getRides);
router.get("/:slug", rideController.getRideBySlug);

module.exports = router;
