const db = require("../../config/database");

/**
 * Get a single active coupon by coupon code.
 *
 * @param {Object} connection - Database connection or pool
 * @param {string} couponCode - Unique promotional coupon code
 * @returns {Promise<Object|null>} Coupon database row object or null if not found
 */
async function getCouponByCode(connection = db, couponCode) {
    if (!couponCode) {
        return null;
    }

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            coupon_code,
            coupon_name,
            discount_type,
            discount_value,
            minimum_amount,
            usage_limit,
            used_count,
            valid_from,
            valid_to,
            status
        FROM coupons
        WHERE coupon_code = ?
          AND status = 'Active'
        LIMIT 1
        `,
        [couponCode]
    );

    return rows.length ? rows[0] : null;
}

/**
 * Get all active coupons valid for a specific visit date.
 *
 * @param {Object} connection - Database connection or pool
 * @param {string} visitDate - Target visit date string (YYYY-MM-DD)
 * @returns {Promise<Array<Object>>} List of active coupons valid for the visit date
 */
async function getActiveCoupons(connection = db, visitDate) {
    if (!visitDate) {
        return [];
    }

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            coupon_code,
            coupon_name,
            discount_type,
            discount_value,
            minimum_amount,
            usage_limit,
            used_count,
            valid_from,
            valid_to,
            status
        FROM coupons
        WHERE status = 'Active'
          AND ? BETWEEN valid_from AND valid_to
        ORDER BY coupon_name ASC
        `,
        [visitDate]
    );

    return rows;
}

module.exports = {
    getCouponByCode,
    getActiveCoupons
};