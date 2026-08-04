const express = require("express");

const router = express.Router();

const mealController = require("../controllers/mealController");

/**
 * ==========================================
 * Customer Meal APIs
 * ==========================================
 */

/**
 * GET /api/meals
 */
router.get(
    "/",
    mealController.getMeals
);

module.exports = router;