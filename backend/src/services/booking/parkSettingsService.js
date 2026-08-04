const parkSettingsRepository = require("../../repositories/catalog/parkSettingsRepository");

/**
 * Park Settings Configuration Service
 *
 * Responsibilities:
 * - Load configurable business values from the park_settings repository
 * - Maintain an in-memory configuration cache to eliminate repeated database queries during pricing calculations
 * - Provide a refresh function for administrators to reload cached settings when park settings are updated in the database
 * - Act as the single source of truth for all configurable business values:
 *   ticket_gst_percentage, food_gst_percentage, convenience_fee, currency, booking_prefix, discount_policy
 */

// In-memory configuration cache
let settingsCache = null;
let isInitialized = false;

/**
 * Loads and caches park settings from the database.
 * On subsequent calls, returns cached values directly without executing database queries.
 *
 * @param {Object} connection - MySQL connection or pool
 * @param {boolean} [forceRefresh=false] - When true, forces a database reload from repository
 * @returns {Promise<Object>} Cached park settings object
 */
async function getParkSettings(connection, forceRefresh = false) {
    if (isInitialized && settingsCache && !forceRefresh) {
        return settingsCache;
    }

    const keys = [
        "ticket_gst_percentage",
        "food_gst_percentage",
        "convenience_fee",
        "currency",
        "booking_prefix",
        "discount_policy",
        "max_booking_days"
    ];

    const dbSettings = await parkSettingsRepository.getSettings(connection, keys);

    settingsCache = {
        ticket_gst_percentage: dbSettings.ticket_gst_percentage !== undefined ? Number(dbSettings.ticket_gst_percentage) : 0,
        food_gst_percentage: dbSettings.food_gst_percentage !== undefined ? Number(dbSettings.food_gst_percentage) : 0,
        convenience_fee: dbSettings.convenience_fee !== undefined ? Number(dbSettings.convenience_fee) : 0,
        currency: dbSettings.currency || "INR",
        booking_prefix: dbSettings.booking_prefix || "VGP",
        discount_policy: dbSettings.discount_policy || "SINGLE_DISCOUNT_ONLY",
        max_booking_days: dbSettings.max_booking_days !== undefined ? Number(dbSettings.max_booking_days) : 90
    };

    isInitialized = true;
    return settingsCache;
}

/**
 * Refreshes the in-memory configuration cache from the database.
 * Designed to be invoked whenever an administrator updates park settings.
 *
 * @param {Object} connection - MySQL connection or pool
 * @returns {Promise<Object>} Updated park settings cache
 */
async function refreshSettings(connection) {
    return await getParkSettings(connection, true);
}

/**
 * Retrieves current in-memory cached settings synchronously without database access.
 * Returns null if cache has not been initialized yet.
 *
 * @returns {Object|null} Cached settings object
 */
function getCachedSettings() {
    return settingsCache;
}

/**
 * Directly overwrites or resets the in-memory settings cache.
 * Useful for unit testing or resetting initialization state.
 *
 * @param {Object|null} newSettings - Replacement configuration map or null to reset cache
 */
function setCache(newSettings) {
    if (newSettings === null || newSettings === undefined) {
        settingsCache = null;
        isInitialized = false;
    } else {
        settingsCache = { ...newSettings };
        isInitialized = true;
    }
}

module.exports = {
    getParkSettings,
    refreshSettings,
    getCachedSettings,
    setCache
};
