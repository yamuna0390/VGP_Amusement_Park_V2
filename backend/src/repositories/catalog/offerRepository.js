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
            promotion_type,
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
            promotion_type,
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

/**
 * Get active offer ticket mappings.
 *
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Array>}
 */
async function getOfferTicketMappings(connection = db) {
    const [rows] = await connection.execute(
        `
        SELECT
            ot.offer_id AS offerId,
            ot.ticket_id AS ticketTypeId,
            t.code AS ticketCode,
            t.name AS ticketName,
            ot.min_qty AS minQty,
            ot.free_qty AS freeQty
        FROM offer_tickets ot
        JOIN ticket_types t ON ot.ticket_id = t.id
        WHERE ot.is_active = 1
        ORDER BY ot.display_order ASC
        `
    );
    return rows;
}

/**
 * Get active offer schedule rules.
 *
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Array>}
 */
async function getOfferScheduleRules(connection = db) {
    const [rows] = await connection.execute(
        `
        SELECT
            offer_id AS offerId,
            day_of_week AS dayOfWeek,
            valid_from AS validFrom,
            valid_until AS validUntil
        FROM offer_schedule_rules
        `
    );
    return rows;
}

/**
 * Get all active offers unconditionally.
 *
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Array>}
 */
async function getAllActiveOffers(connection = db) {
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            offer_name,
            offer_code,
            promotion_type,
            instruction,
            offer_type,
            discount_value,
            valid_from,
            valid_to,
            min_advance_days,
            status,
            priority
        FROM offers
        WHERE status = 'Active'
        ORDER BY priority ASC
        `
    );
    return rows;
}

module.exports = {
    getOfferByCode,
    getActiveOffers,
    getOfferTicketMappings,
    getOfferScheduleRules,
    getAllActiveOffers
};