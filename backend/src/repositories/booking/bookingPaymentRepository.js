const db = require("../../config/database");

/**
 * Create payment record.
 *
 * @param {Object} connection
 * @param {Object} payment
 * @returns {Promise<number>}
 */
async function createPayment(connection = db, payment) {

    const [result] = await connection.execute(
        `
        INSERT INTO booking_payments (
            booking_id,
            payment_gateway,
            payment_method,
            transaction_id,
            gateway_order_id,
            gateway_payment_id,
            amount,
            currency,
            payment_status,
            gateway_response,
            paid_at
        )
        VALUES (
            ?,?,?,?,?,?,
            ?,?,?,?,
            ?
        )
        `,
        [
            payment.bookingId,
            payment.paymentGateway,
            payment.paymentMethod,

            payment.transactionId || null,
            payment.gatewayOrderId || null,
            payment.gatewayPaymentId || null,

            payment.amount,

            payment.currency || "INR",

            payment.paymentStatus,

            payment.gatewayResponse
                ? JSON.stringify(payment.gatewayResponse)
                : null,

            payment.paidAt || null
        ]
    );

    return result.insertId;

}

/**
 * Find payment by booking.
 */
async function findByBookingId(
    connection = db,
    bookingId
) {

    const [rows] = await connection.execute(
        `
        SELECT *
        FROM booking_payments
        WHERE booking_id = ?
        LIMIT 1
        `,
        [bookingId]
    );

    return rows.length ? rows[0] : null;

}

/**
 * Find payment by gateway payment ID.
 */
async function findByGatewayPaymentId(
    connection = db,
    gatewayPaymentId
) {

    const [rows] = await connection.execute(
        `
        SELECT *
        FROM booking_payments
        WHERE gateway_payment_id = ?
        LIMIT 1
        `,
        [gatewayPaymentId]
    );

    return rows.length ? rows[0] : null;

}

/**
 * Update payment after gateway response.
 */
async function updatePayment(
    connection = db,
    bookingId,
    payment
) {

    await connection.execute(
        `
        UPDATE booking_payments
        SET
            transaction_id = ?,
            gateway_order_id = ?,
            gateway_payment_id = ?,
            payment_status = ?,
            gateway_response = ?,
            paid_at = ?,
            amount = ?,
            currency = ?
        WHERE booking_id = ?
        `,
        [

            payment.transactionId || null,

            payment.gatewayOrderId || null,

            payment.gatewayPaymentId || null,

            payment.paymentStatus,

            payment.gatewayResponse
                ? JSON.stringify(payment.gatewayResponse)
                : null,

            payment.paidAt || null,

            payment.amount,

            payment.currency || "INR",

            bookingId

        ]
    );

}

module.exports = {

    createPayment,

    findByBookingId,

    findByGatewayPaymentId,

    updatePayment

};