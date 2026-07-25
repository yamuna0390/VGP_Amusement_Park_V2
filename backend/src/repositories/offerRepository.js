const db = require("../config/database");

const getActiveOffer = async (visitDate) => {
    const [rows] = await db.query(
        `SELECT *
         FROM offers
         WHERE status = 'Active'
           AND ? BETWEEN valid_from AND valid_to
         LIMIT 1`,
        [visitDate]
    );

    return rows[0] || null;
};

module.exports = {
    getActiveOffer,
};