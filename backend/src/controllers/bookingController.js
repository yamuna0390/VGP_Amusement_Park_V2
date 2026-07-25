const bookingService = require("../services/booking/bookingService");
const { success } = require("../utils/response");

const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user);

    return success(
      res,
      "Booking created successfully",
      booking,
      201
    );
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in."
      });
    }

    const bookings = await bookingService.getCustomerBookings(req.user.id);

    return success(
      res,
      "Bookings retrieved successfully",
      bookings
    );
  } catch (error) {
    next(error);
  }
};

const findBooking = async (req, res, next) => {
  try {
    const { bookingNumber, mobileNumber, email } = req.body;

    if (!bookingNumber || (!mobileNumber && !email)) {
      return res.status(400).json({
        success: false,
        message: "Booking number and either mobile number or email address are required."
      });
    }

    const booking = await bookingService.findBooking({ bookingNumber, mobileNumber, email });

    return success(
      res,
      "Booking details retrieved successfully",
      booking
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  findBooking,
};