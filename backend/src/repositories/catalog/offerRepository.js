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
 * Get active offer ticket mappings.
 *
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Array>}
 */
/**
 * Get active offer ticket mappings.
 *
 * Current offer_tickets schema:
 *   offer_id
 *   buy_ticket_id
 *   free_ticket_id
 *   display_name
 *   display_subname
 *   buy_quantity
 *   free_quantity
 *   offer_price
 *   max_qty
 *   display_order
 *   is_active
 *
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Array>}
 */
async function getOfferTicketMappings(connection = db) {
    const [rows] = await connection.execute(
        `
        SELECT
            ot.id,
            ot.offer_id AS offerId,
            ot.buy_ticket_id AS buyTicketId,
            ot.free_ticket_id AS freeTicketId,
            ot.display_name AS displayName,
            ot.display_subname AS displaySubname,
            ot.buy_quantity AS buyQuantity,
            ot.free_quantity AS freeQuantity,
            ot.offer_price AS offerPrice,
            ot.max_qty AS maxQty,
            ot.display_order AS displayOrder,
            ot.is_active AS isActive
        FROM offer_tickets ot
        WHERE ot.is_active = 1
        ORDER BY ot.offer_id ASC, ot.display_order ASC
        `
    );

    return rows;
}

/**
 * Get an offer by its ID.
 *
 * @param {number} offerId
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Object|null>}
 */
async function getOfferById(offerId, connection = db) {
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            offer_name,
            description,
            instruction,
            offer_code,
            valid_from,
            valid_to,
            min_advance_days,
            status,
            display_order,
            created_at,
            updated_at,
            offer_type_id,
            discount_percentage,
            flat_discount,
            minimum_booking_value
        FROM offers
        WHERE id = ?
        `,
        [offerId]
    );

    return rows.length ? rows[0] : null;
}

/**
 * Get offer schedule rules for a specific offer.
 *
 * @param {number} offerId
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Array>}
 */
async function getOfferScheduleRulesByOffer(offerId, connection = db) {
    const [rows] = await connection.execute(
        `
        SELECT
            offer_id AS offerId,
            day_of_week AS dayOfWeek
        FROM offer_schedule_rules
        WHERE offer_id = ?
        `,
        [offerId]
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
            day_of_week AS dayOfWeek
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
            description,
            instruction,
            offer_code,
            valid_from,
            valid_to,
            min_advance_days,
            status,
            display_order,
            created_at,
            updated_at,
            offer_type_id,
            discount_percentage,
            flat_discount,
            minimum_booking_value
        FROM offers
        WHERE status = 'Active'
          AND (valid_from IS NULL OR valid_from <= CURRENT_DATE)
          AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
        ORDER BY display_order ASC
        `
    );
    return rows;
}
/**
 * Get all active offer types.
 *
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Array>}
 */
async function getActiveOfferTypes(connection = db) {
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            code,
            name,
            description,
            display_order
        FROM offer_types
        WHERE is_active = 1
        ORDER BY display_order ASC, id ASC
        `
    );

    return rows;
}
/**
 * Get all active offers valid for a visit date.
 *
 * Uses the frozen offer schema:
 *   offers
 *   offer_types
 *   offer_tickets
 *   ticket_types
 *
 * @param {PoolConnection|Pool} connection
 * @param {string} visitDate
 * @returns {Promise<Array>}
 */
async function getActiveOffers(connection = db, visitDate) {
    const [rows] = await connection.execute(
        `
        SELECT
            o.id,
            o.offer_name,
            o.description,
            o.instruction,
            o.offer_code,
            o.valid_from,
            o.valid_to,
            o.min_advance_days,
            o.status,
            o.display_order,

            o.offer_type_id,

            ot.code AS offer_type_code,
            ot.name AS offer_type_name,

            o.discount_percentage,
            o.flat_discount,
            o.minimum_booking_value

        FROM offers o

        INNER JOIN offer_types ot
            ON ot.id = o.offer_type_id
           AND ot.is_active = 1

        WHERE o.status = 'Active'
          AND ? BETWEEN o.valid_from AND o.valid_to
          AND (
            NOT EXISTS (SELECT 1 FROM offer_schedule_rules sr WHERE sr.offer_id = o.id)
            OR EXISTS (
               SELECT 1 FROM offer_schedule_rules sr 
               WHERE sr.offer_id = o.id 
                 AND sr.day_of_week = WEEKDAY(?) + 1
            )
          )

        ORDER BY
            o.display_order ASC,
            o.id ASC
        `,
        [visitDate, visitDate]
    );

    return rows;
}
module.exports = {
    getOfferByCode,
    getOfferById,
    getOfferScheduleRulesByOffer,
    getOfferTicketMappings,
    getOfferScheduleRules,
    getAllActiveOffers,
     getActiveOffers,
    getActiveOfferTypes
};