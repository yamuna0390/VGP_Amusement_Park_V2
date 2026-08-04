const db = require("../../config/database");

/**
 * Get all active ticket types.
 *
 * Used by:
 * - Ticket Selection UI
 * - Admin
 */
async function getActiveTickets(connection = db) {
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            code,
            name,
            description,
            price,
            display_order
        FROM ticket_types
        WHERE status = 'Active'
        ORDER BY display_order ASC
        `
    );

    return rows;
}

/**
 * Get one active ticket by ID.
 *
 * Used by:
 * - Pricing Engine
 */
async function getTicketById(connection = db, ticketTypeId) {
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            code,
            name,
            description,
            price
        FROM ticket_types
        WHERE id = ?
          AND status = 'Active'
        LIMIT 1
        `,
        [ticketTypeId]
    );

    return rows.length ? rows[0] : null;
}

/**
 * Get multiple active tickets by IDs.
 *
 * Used by:
 * - Pricing Engine
 */
async function getTicketsByIds(connection = db, ticketTypeIds = []) {

    if (!ticketTypeIds.length) {
        return [];
    }

    const placeholders = ticketTypeIds.map(() => "?").join(",");

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            code,
            name,
            description,
            price
        FROM ticket_types
        WHERE status = 'Active'
          AND id IN (${placeholders})
        ORDER BY display_order ASC
        `,
        ticketTypeIds
    );

    return rows;
}
/**
 * Get all regular tickets for booking UI.
 *
 * Used by:
 * - POST /api/bookings/validate-date
 */
async function getRegularTickets(connection = db) {

    const [rows] = await connection.execute(`
        SELECT
            id,
            code,
            name,
            description,
            price,
            display_order
        FROM ticket_types
        WHERE status = 'Active'
        ORDER BY display_order ASC
    `);

    return rows;
}
/**
 * Get all active offer tickets valid for selected visit date.
 *
 * Used by:
 * - POST /api/bookings/validate-date
 */
async function getOfferTickets(connection = db, visitDate) {

    const [rows] = await connection.execute(
        `
        SELECT

            ot.id                  AS offerTicketId,
            ot.display_name,
            ot.min_qty,
            ot.free_qty,
            ot.max_qty,
            ot.display_order,

            o.id                   AS offerId,
            o.offer_name,
            o.offer_code,
            o.instruction,
            o.offer_type,
            o.discount_type,
            o.discount_value,

            t.id                   AS ticketId,
            t.code                 AS ticketCode,
            t.name                 AS ticketName,
            t.description          AS ticketDescription,
            t.price                AS originalPrice

        FROM offer_tickets ot

        INNER JOIN offers o
            ON o.id = ot.offer_id

        INNER JOIN ticket_types t
            ON t.id = ot.ticket_id

        WHERE

            ot.is_active = 1
            AND o.status = 'Active'
            AND ? BETWEEN o.valid_from AND o.valid_to

        ORDER BY
            o.priority,
            ot.display_order
        `,
        [visitDate]
    );

    return rows;
}
module.exports = {
    getActiveTickets,
    getTicketById,
    getTicketsByIds,
    getRegularTickets,
    getOfferTickets
};