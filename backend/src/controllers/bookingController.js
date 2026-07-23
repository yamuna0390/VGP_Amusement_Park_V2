const bookingService = require("../services/booking/bookingService");

/**
 * Create Booking
 */
async function createBooking(req, res) {
  try {
    const result = await bookingService.createBooking(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createBooking,
};