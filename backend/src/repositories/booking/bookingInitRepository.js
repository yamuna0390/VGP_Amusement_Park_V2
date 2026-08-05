const db = require("../../config/database");
const mealRepository = require("../catalog/mealRepository");
const parkSettingsRepository = require("../catalog/parkSettingsRepository");

const DEFAULT_SETTING_KEYS = [
    "ticket_gst_percentage",
    "food_gst_percentage",
    "convenience_fee",
    "currency",
    "booking_prefix",
    "max_booking_days",
    "discount_policy",
    "timezone",
    "booking_cancel_hours"
];

/**
 * Aggregates catalog and settings data required for booking initialization.
 * Reuses existing catalog repositories without duplicating SQL queries.
 *
 * @param {Object} [connection=db] - Database connection or pool
 * @param {string[]} [settingKeys=DEFAULT_SETTING_KEYS] - Park setting keys to retrieve
 * @returns {Promise<{ meals: Array, parkSettings: Object }>}
 */
async function getInitData(connection = db, settingKeys = DEFAULT_SETTING_KEYS) {
    const [meals, parkSettings] = await Promise.all([
        mealRepository.getActiveMeals(connection),
        parkSettingsRepository.getSettings(connection, settingKeys)
    ]);

    return {
        meals,
        parkSettings
    };
}

module.exports = {
    getInitData,
    DEFAULT_SETTING_KEYS
};
