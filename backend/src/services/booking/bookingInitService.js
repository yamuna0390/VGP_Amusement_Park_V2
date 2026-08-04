const bookingInitRepository = require("../../repositories/booking/bookingInitRepository");

/**
 * Helper to convert snake_case strings to camelCase.
 * Example: ticket_gst_percentage -> ticketGstPercentage
 */
function toCamelCase(str) {
    return str.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Helper to parse setting values into appropriate JavaScript types (number vs string).
 */
function parseSettingValue(key, value) {
    if (value === null || value === undefined) {
        return null;
    }
    // Convert string numeric representations to number type while avoiding empty strings
    if (!isNaN(value) && value.toString().trim() !== "" && !isNaN(Number(value))) {
        return Number(value);
    }
    return value;
}

/**
 * Converts park settings key/value rows into a frontend-friendly object with camelCase properties and properly typed values.
 *
 * @param {Object} rawSettings - Raw key-value map from repository
 * @returns {Object} Frontend-friendly settings object
 */
function formatParkSettings(rawSettings = {}) {
    const defaultSettings = {
        ticket_gst_percentage: 18,
        food_gst_percentage: 5,
        convenience_fee: 40,
        currency: "INR",
        booking_prefix: "VGP",
        max_booking_days: 90,
        discount_policy: "COUPON_PRIORITY",
        timezone: "Asia/Kolkata",
        booking_cancel_hours: 24
    };

    // Merge database settings over default settings
    const mergedSettings = { ...defaultSettings, ...rawSettings };
    const formatted = {};

    for (const [key, value] of Object.entries(mergedSettings)) {
        if (value !== undefined) {
            const camelKey = toCamelCase(key);
            formatted[camelKey] = parseSettingValue(key, value);
        }
    }

    return formatted;
}

/**
 * Formats ticket rows from database for frontend rendering.
 * Removes internal ordering fields (display_order) while preserving order, and converts price strings to numeric values.
 *
 * @param {Array} rawTickets - Raw ticket array from repository
 * @returns {Array} Formatted ticket array
 */
function formatTickets(rawTickets = []) {
    return (rawTickets || []).map(ticket => {
        const { display_order, ...publicFields } = ticket;
        return {
            ...publicFields,
            id: publicFields.id !== undefined && publicFields.id !== null ? Number(publicFields.id) : null,
            price: publicFields.price !== undefined && publicFields.price !== null ? Number(publicFields.price) : 0
        };
    });
}

/**
 * Formats meal rows from database for frontend rendering.
 * Removes internal ordering fields (display_order) while preserving order, and converts price strings to numeric values.
 *
 * @param {Array} rawMeals - Raw meal array from repository
 * @returns {Array} Formatted meal array
 */
function formatMeals(rawMeals = []) {
    return (rawMeals || []).map(meal => {
        const { display_order, ...publicFields } = meal;
        return {
            ...publicFields,
            id: publicFields.id !== undefined && publicFields.id !== null ? Number(publicFields.id) : null,
            price: publicFields.price !== undefined && publicFields.price !== null ? Number(publicFields.price) : 0
        };
    });
}

/**
 * Retrieves booking initialization data including active tickets, active meals, and frontend-friendly park settings.
 *
 * @returns {Promise<{ tickets: Array, meals: Array, parkSettings: Object }>}
 */
async function getBookingInitData() {
    const { tickets, meals, parkSettings } = await bookingInitRepository.getInitData();

    return {
        tickets: formatTickets(tickets),
        meals: formatMeals(meals),
        parkSettings: formatParkSettings(parkSettings)
    };
}

module.exports = {
    getBookingInitData,
    formatParkSettings,
    formatTickets,
    formatMeals
};
