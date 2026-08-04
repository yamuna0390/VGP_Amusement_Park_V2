const bookingInitService = require("../services/booking/bookingInitService");

/**
 * Get Booking Initialization Data
 *
 * GET /api/booking/init
 */
async function getInitData(req, res, next) {
    try {
        const data = await bookingInitService.getBookingInitData();

        return res.status(200).json({
            success: true,
            message: "Booking initialization data loaded successfully.",
            data
        });

    } catch (err) {
        next(err);
    }
}

module.exports = {
    getInitData
};
