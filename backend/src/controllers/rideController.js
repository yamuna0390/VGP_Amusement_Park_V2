const rideRepository = require("../repositories/catalog/rideRepository");
const { success } = require("../utils/response");

/**
 * GET /api/rides
 * Retrieves all active rides.
 */
const getRides = async (req, res, next) => {
    try {
        const rides = await rideRepository.getActiveRides();
        
        return success(
            res,
            "Rides retrieved successfully.",
            rides
        );
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/rides/:slug
 * Retrieves a single active ride by slug.
 */
const getRideBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        
        if (!slug || typeof slug !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Invalid slug parameter."
            });
        }

        const ride = await rideRepository.getActiveRideBySlug(slug);

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found."
            });
        }

        return success(
            res,
            "Ride retrieved successfully.",
            ride
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRides,
    getRideBySlug
};
