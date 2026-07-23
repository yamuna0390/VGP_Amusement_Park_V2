const express = require("express");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// Create Booking
router.post("/", bookingController.createBooking);

module.exports = router;