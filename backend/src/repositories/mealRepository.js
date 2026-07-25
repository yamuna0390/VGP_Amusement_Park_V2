const db = require("../config/database");

const getAllActiveMeals = async () => {
    const [rows] = await db.query(
        `SELECT *
         FROM meal_types
         WHERE status = 'Active'
         ORDER BY display_order`
    );

    return rows;
};

const getMealsByCodes = async (codes) => {
    if (!codes.length) return [];

    const placeholders = codes.map(() => "?").join(",");

    const [rows] = await db.query(
        `
        SELECT *
        FROM meal_types
        WHERE status = 'Active'
        AND code IN (${placeholders})
        `,
        codes
    );

    return rows;
};

module.exports = {
    getAllActiveMeals,
    getMealsByCodes,
};