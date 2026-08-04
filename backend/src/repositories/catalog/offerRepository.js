const db = require("../../config/database");

/**
 * Get a single active offer by offer code.
 *
 * @param {PoolConnection|Pool} connection
 * @param {string} offerCode
 * @returns {Promise<Object|null>}
 */
async function getOfferByCode(connection = db, offerCode) {

    if (!offerCode) {
        return null;
    }

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            offer_name,
            offer_code,
            description,
            offer_rule,
            discount_value,
            minimum_amount,
            valid_from,
            valid_to,
            applicable_tickets,
            min_qty,
            free_qty,
            priority
        FROM offers
        WHERE offer_code = ?
          AND status = 'Active'
        LIMIT 1
        `,
        [offerCode]
    );

    return rows.length ? rows[0] : null;
}

/**
 * Get all active offers valid for a visit date.
 *
 * @param {PoolConnection|Pool} connection
 * @param {string} visitDate
 * @returns {Promise<Array>}
 */
async function getActiveOffers(connection = db, visitDate) {

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            offer_name,
            offer_code,
            description,
            offer_rule,
            discount_value,
            minimum_amount,
            valid_from,
            valid_to,
            applicable_tickets,
            min_qty,
            free_qty,
            priority
        FROM offers
        WHERE status = 'Active'
          AND ? BETWEEN valid_from AND valid_to
        ORDER BY priority ASC
        `,
        [visitDate]
    );

    return rows;
}

module.exports = {
    getOfferByCode,
    getActiveOffers
};