const db = require("../../config/database");

/**
 * Insert all booking items.
 *
 * @param {Object} connection MySQL transaction/connection
 * @param {number} bookingId
 * @param {Array} items
 */
async function createBookingItems(connection = db, bookingId, items) {

    if (!Array.isArray(items) || items.length === 0) {
        return;
    }

    const sql = `
        INSERT INTO booking_items (
            booking_id,
            item_type,
            reference_id,
            item_code,
            item_name,
            quantity,
            unit_price,
            subtotal,
            discount_amount,
            tax_amount,
            final_amount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const item of items) {

        const subtotal = Number(item.unitPrice) * Number(item.quantity);

        const discountAmount = Number(item.discountAmount || 0);

        const taxAmount = Number(item.taxAmount || 0);

        const finalAmount =
            subtotal
            - discountAmount
            + taxAmount;

        await connection.execute(sql, [
            bookingId,
            item.itemType,
            item.itemId,
            item.itemCode,
            item.description,
            item.quantity,
            item.unitPrice,
            subtotal,
            discountAmount,
            taxAmount,
            finalAmount
        ]);

    }

}

/**
 * Get booking items.
 *
 * @param {Object} connection
 * @param {number} bookingId
 * @returns {Promise<Array>}
 */
async function findByBookingId(connection = db, bookingId) {

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            booking_id,
            item_type,
            reference_id,
            item_code,
            item_name,
            quantity,
            unit_price,
            subtotal,
            discount_amount,
            tax_amount,
            final_amount,
            created_at
        FROM booking_items
        WHERE booking_id = ?
        ORDER BY id ASC
        `,
        [bookingId]
    );

    return rows;

}

/**
 * Delete booking items.
 *
 * Used only for future booking edit/cancel flows.
 *
 * @param {Object} connection
 * @param {number} bookingId
 */
async function deleteByBookingId(connection = db, bookingId) {

    await connection.execute(
        `
        DELETE
        FROM booking_items
        WHERE booking_id = ?
        `,
        [bookingId]
    );

}

module.exports = {

    createBookingItems,

    findByBookingId,

    deleteByBookingId

};