const bookingService = require("../services/booking/bookingService");
const pricingService = require("../services/booking/pricingService");
const bookingRepository = require("../repositories/bookingRepository");
const { success } = require("../utils/response");

const createBooking = async (req, res, next) => {
  try {

//     console.log("===== req.body =====");
// console.log(JSON.stringify(req.body, null, 2));
//   console.log("===== req.body END =====");


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

const calculateBooking = async (req, res, next) => {
  try {
    const { tickets, meals, visitDate, couponCode, offerCode } = req.body;
    const pricing = await pricingService.calculateBookingPrice({
      tickets,
      meals,
      visitDate,
      couponCode,
      offerCode,
    });
    return success(res, "Booking calculation successful", pricing);
  } catch (error) {
    next(error);
  }
};

const getBookingDetails = async (req, res, next) => {
  try {
    const { bookingNumber } = req.params;
    const { email, mobile } = req.query;

    const dbBooking = await bookingRepository.getBookingByNumber(bookingNumber);
    if (!dbBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Auth check: Admin always allowed, owner always allowed
    const isOwner = req.user && dbBooking.customer_id === req.user.id;
    const isAdmin = req.user && req.user.role === "admin";

    // Guest check: allow if booking has no customer_id and email/mobile matches
    const isGuestMatch = !dbBooking.customer_id && (
      (email && dbBooking.customer_email.toLowerCase() === email.toLowerCase()) ||
      (mobile && dbBooking.customer_mobile === mobile)
    );

    // If booking doesn't have an owner (guest), we can also allow if they access with the correct token (booking number acts as secure key)
    const isSecureToken = !dbBooking.customer_id;

    if (!isOwner && !isAdmin && !isGuestMatch && !isSecureToken) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You do not have permission to view this booking."
      });
    }

    const tickets = await bookingRepository.getBookingItems(dbBooking.id);
    const meals = await bookingRepository.getBookingMeals(dbBooking.id);

    let visitorCount = 0;
    tickets.forEach(item => {
      if (item.ticket_type.toLowerCase().includes("ticket")) {
        visitorCount += item.quantity;
      }
    });

    return success(res, "Booking details retrieved successfully", {
      ...dbBooking,
      tickets,
      meals,
      visitor_count: visitorCount || 1
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  findBooking,
  calculateBooking,
  getBookingDetails,
};