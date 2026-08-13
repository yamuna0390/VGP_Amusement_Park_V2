const db = require("../../config/database");

/**
 * Creates a new booking payment record.
 * 
 * @param {object} paymentData - The payment details
 * @param {object} connection - Optional transaction connection
 */
async function createBookingPayment(paymentData, connection = db) {
    const query = `
        INSERT INTO booking_payments (
            booking_id, payment_gateway, payment_method, transaction_id,
            gateway_order_id, gateway_payment_id, amount, currency,
            payment_status, gateway_response
        ) VALUES (
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?
        )
    `;

    const values = [
        paymentData.booking_id,
        paymentData.payment_gateway || 'RAZORPAY',
        paymentData.payment_method || null,
        paymentData.transaction_id || null,
        paymentData.gateway_order_id || null,
        paymentData.gateway_payment_id || null,
        paymentData.amount,
        paymentData.currency || 'INR',
        paymentData.payment_status || 'PENDING',
        paymentData.gateway_response ? JSON.stringify(paymentData.gateway_response) : null
    ];

    const [result] = await connection.execute(query, values);
    return result.insertId;
}

/**
 * Finds an existing pending payment for a given booking.
 * 
 * @param {number} bookingId 
 * @param {object} connection 
 */
async function getPendingPaymentByBookingId(bookingId, connection = db) {
    const query = `
        SELECT * FROM booking_payments 
        WHERE booking_id = ? AND payment_status = 'PENDING'
        ORDER BY created_at DESC LIMIT 1
    `;
    const [rows] = await connection.execute(query, [bookingId]);
    return rows[0] || null;
}

/**
 * Finds a payment record by gateway order ID.
 * 
 * @param {string} gatewayOrderId 
 * @param {object} connection 
 */
async function getPaymentByGatewayOrderId(gatewayOrderId, connection = db) {
    const query = `
        SELECT * FROM booking_payments 
        WHERE gateway_order_id = ?
        ORDER BY created_at DESC LIMIT 1
    `;
    const [rows] = await connection.execute(query, [gatewayOrderId]);
    return rows[0] || null;
}

/**
 * Updates a payment as SUCCESS.
 * 
 * @param {number} paymentId 
 * @param {string} gatewayPaymentId 
 * @param {object} gatewayResponse 
 * @param {object} connection 
 */
async function updatePaymentSuccess(paymentId, gatewayPaymentId, gatewayResponse, connection = db) {
    const query = `
        UPDATE booking_payments 
        SET 
            payment_status = 'SUCCESS',
            gateway_payment_id = ?,
            gateway_response = ?,
            paid_at = NOW()
        WHERE id = ?
    `;
    const responseStr = gatewayResponse ? JSON.stringify(gatewayResponse) : null;
    const [result] = await connection.execute(query, [gatewayPaymentId, responseStr, paymentId]);
    return result.affectedRows > 0;
}

module.exports = {
    createBookingPayment,
    getPendingPaymentByBookingId,
    getPaymentByGatewayOrderId,
    updatePaymentSuccess
};
