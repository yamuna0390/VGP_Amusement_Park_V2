const db = require("../../config/database");

async function getNextQuoteVersion(sessionId, connection = db) {
    const [rows] = await connection.execute(
        "SELECT MAX(quote_version) as maxVersion FROM booking_session_quotes WHERE session_id = ?",
        [sessionId]
    );
    return (rows[0].maxVersion || 0) + 1;
}

async function insertQuote(quoteData, connection = db) {
    const query = `
        INSERT INTO booking_session_quotes (
            session_id, quote_version, ticket_subtotal, addon_subtotal, 
            subtotal, offer_discount, coupon_discount, total_discount, 
            ticket_tax, addon_tax, total_tax, convenience_fee, grand_total, 
            currency, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        quoteData.sessionId,
        quoteData.quoteVersion,
        quoteData.ticketSubtotal,
        quoteData.addonSubtotal,
        quoteData.subtotal,
        quoteData.offerDiscount,
        quoteData.couponDiscount,
        quoteData.totalDiscount,
        quoteData.ticketTax,
        quoteData.addonTax,
        quoteData.totalTax,
        quoteData.convenienceFee,
        quoteData.grandTotal,
        quoteData.currency || 'INR',
        quoteData.expiresAt
    ];
    const [result] = await connection.execute(query, params);
    return result.insertId;
}

async function getLatestQuote(sessionId, connection = db) {
    const query = `
        SELECT * FROM booking_session_quotes 
        WHERE session_id = ? 
        ORDER BY quote_version DESC 
        LIMIT 1
    `;
    const [rows] = await connection.execute(query, [sessionId]);
    return rows[0] || null;
}

module.exports = {
    getNextQuoteVersion,
    insertQuote,
    getLatestQuote
};
