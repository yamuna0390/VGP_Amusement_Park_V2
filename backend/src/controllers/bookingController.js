const bookingService = require("../services/booking/bookingService");

/**
 * Create Booking
 */
async function createBooking(req, res, next) {
    try {
        // Request body has already been validated
        // by validationMiddleware.js
    const response = await bookingService.createBooking(req.body);

        return res.status(201).json(response);

    } catch (err) {
        next(err);
    }
}

/**
 * Get Customer Bookings
 */
async function getCustomerBookings(req, res, next) {
    try {
        const customerId = Number(req.params.customerId);

        const bookings = await bookingService.getCustomerBookings(customerId);

        return res.json({
            success: true,
            data: bookings
        });

    } catch (err) {
        next(err);
    }
}

/**
 * Get Booking by Booking Number + Customer Details
 */
async function getBooking(req, res, next) {
    try {
        const booking = await bookingService.getBookingForCustomer({
            bookingNumber: req.body.bookingNumber,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email
        });

        return res.json({
            success: true,
            data: booking
        });

    } catch (err) {
        next(err);
    }
}

/**
 * Validate Visit Date & Get Valid Offers
 * POST /api/bookings/validate-date
 */
async function validateVisitDate(req, res, next) {
    try {
        const data = await bookingService.validateVisitDate(req.body.visitDate);

        return res.status(200).json({
            success: true,
            message: "Visit date is available.",
            data
        });

    } catch (err) {
        next(err);
    }
}

/**
 * Validate Coupon Code
 * POST /api/booking/validate-coupon
 */
async function validateCoupon(req, res, next) {
    try {
        const result = await bookingService.validateCouponRequest(req.body);
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

/**
 * Final Review Before Checkout
 * POST /api/booking/finalreview
 */
async function finalReview(req, res, next) {
    try {
        const result = await bookingService.getFinalReview(req.body);
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createBooking,
    getCustomerBookings,
    getBooking,
    validateVisitDate,
    validateCoupon,
    finalReview
};