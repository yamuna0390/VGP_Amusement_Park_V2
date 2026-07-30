const db = require("../../config/database");

const getAllActiveTickets = async () => {
    const [rows] = await db.query(
        `SELECT *
         FROM ticket_types
         WHERE status = 'Active'
         ORDER BY display_order`
    );

    return rows;
};

const getTicketsByCodes = async (codes) => {
    if (!codes.length) return [];

    const placeholders = codes.map(() => "?").join(",");

    const [rows] = await db.query(
        `
        SELECT *
        FROM ticket_types
        WHERE status = 'Active'
        AND code IN (${placeholders})
        `,
        codes
    );

    return rows;
};

module.exports = {
    getAllActiveTickets,
    getTicketsByCodes,
};