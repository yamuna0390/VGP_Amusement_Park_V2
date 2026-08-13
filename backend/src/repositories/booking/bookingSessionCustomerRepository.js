const db = require("../../config/database");

async function upsertCustomer(connection = db, sessionId, data) {
    const { leadTravellerName, email, mobile, whatsappDelivery } = data;
    const query = `
        INSERT INTO booking_session_customer 
            (session_id, lead_traveller_name, email, mobile, whatsapp_delivery)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            lead_traveller_name = VALUES(lead_traveller_name),
            email = VALUES(email),
            mobile = VALUES(mobile),
            whatsapp_delivery = VALUES(whatsapp_delivery),
            updated_at = CURRENT_TIMESTAMP
    `;
    const [result] = await connection.execute(query, [
        sessionId,
        leadTravellerName,
        email,
        mobile,
        whatsappDelivery ? 1 : 0
    ]);
    return result;
}

async function getCustomerBySessionId(sessionId, connection = db) {
    const query = `
        SELECT 
            id, session_id, lead_traveller_name as leadTravellerName, 
            email, mobile, whatsapp_delivery as whatsappDelivery, 
            created_at, updated_at
        FROM booking_session_customer
        WHERE session_id = ?
    `;
    const [rows] = await connection.execute(query, [sessionId]);
    if (rows.length > 0) {
        // Convert integer boolean to standard boolean
        rows[0].whatsappDelivery = !!rows[0].whatsappDelivery;
        return rows[0];
    }
    return null;
}

module.exports = {
    upsertCustomer,
    getCustomerBySessionId
};
