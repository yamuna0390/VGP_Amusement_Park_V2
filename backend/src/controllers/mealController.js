const mealRepository = require("../repositories/catalog/mealRepository");
const { success } = require("../utils/response");

/**
 * Get Active Meal Types
 *
 * GET /api/meals
 */
const getMeals = async (req, res, next) => {

    try {

        const meals = await mealRepository.getActiveMeals();

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