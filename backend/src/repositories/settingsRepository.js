const db = require("../config/database");

/**
 * Get all application settings
 * Returns:
 * {
 *   gst_percentage: "18",
 *   booking_prefix: "VGP",
 *   currency: "INR",
 *   max_booking_days: "90",
 *   discount_policy: "COUPON_PRIORITY",
 *   booking_cancel_hours: "24",
 *   timezone: "Asia/Kolkata"
 * }
 */
const getAllSettings = async () => {
    const [rows] = await db.query(`
        SELECT setting_key, setting_value
        FROM park_settings
    `);

    return rows.reduce((settings, row) => {
        settings[row.setting_key] = row.setting_value;
        return settings;
    }, {});
};

/**
 * Get a single setting by key
 */
const getSetting = async (key) => {
    const [rows] = await db.query(
        `
        SELECT setting_value
        FROM park_settings
        WHERE setting_key = ?
        LIMIT 1
        `,
        [key]
    );

    return rows.length ? rows[0].setting_value : null;
};

/**
 * Update a setting value
 */
const updateSetting = async (key, value) => {
    const [result] = await db.query(
        `
        UPDATE park_settings
        SET setting_value = ?
        WHERE setting_key = ?
        `,
        [value, key]
    );

    return result.affectedRows;
};

module.exports = {
    getAllSettings,
    getSetting,
    updateSetting,
};