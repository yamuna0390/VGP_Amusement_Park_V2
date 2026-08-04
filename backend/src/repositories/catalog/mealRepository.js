const db = require("../../config/database");

/**
 * Get all active meal types.
 *
 * Used by:
 * - Food Selection UI
 * - Admin
 */
async function getActiveMeals(connection = db) {
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            code,
            name,
            description,
            price,
            image_url,
            display_order
        FROM meal_types
        WHERE status = 'Active'
        ORDER BY display_order ASC
        `
    );

    return rows;
}

/**
 * Get one active meal by ID.
 *
 * Used by:
 * - Pricing Engine
 */
async function getMealById(connection = db, mealTypeId) {
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            code,
            name,
            description,
            price,
            image_url
        FROM meal_types
        WHERE id = ?
          AND status = 'Active'
        LIMIT 1
        `,
        [mealTypeId]
    );

    return rows.length ? rows[0] : null;
}

/**
 * Get multiple active meals by IDs.
 *
 * Used by:
 * - Pricing Engine
 */
async function getMealsByIds(connection = db, mealTypeIds = []) {

    if (!mealTypeIds.length) {
        return [];
    }

    const placeholders = mealTypeIds.map(() => "?").join(",");

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            code,
            name,
            description,
            price,
            image_url
        FROM meal_types
        WHERE status = 'Active'
          AND id IN (${placeholders})
        ORDER BY display_order ASC
        `,
        mealTypeIds
    );

    return rows;
}

module.exports = {
    getActiveMeals,
    getMealById,
    getMealsByIds
};