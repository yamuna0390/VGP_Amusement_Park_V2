const addonRepository = require("../repositories/catalog/addonRepository");
const { success } = require("../utils/response");

/**
 * Get Active Meal Types
 *
 * GET /api/meals
 */
const getMeals = async (req, res, next) => {

    try {

        const meals = await addonRepository.getActiveAddons();

        return success(
            res,
            "Meals retrieved successfully.",
            meals
        );

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getMeals
};