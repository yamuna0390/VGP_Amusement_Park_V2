const db = require("../../config/database");

/**
 * Create a booking.
 *
 * @param {Object} connection MySQL connection/transaction
 * @param {Object} booking Booking object
 * @returns {Promise<number>} Newly created booking ID
 */
async function createBooking(connection = db, booking) {

    const [result] = await connection.execute(
        `
        INSERT INTO bookings (
            booking_number,
            user_id,
            guest_name,
            guest_email,
            guest_mobile,
            visit_date,

            ticket_subtotal,
            meal_subtotal,
            subtotal,

            offer_discount,
            coupon_discount,
            total_discount,

            ticket_tax,
            food_tax,
            total_tax,

            convenience_fee,
            grand_total,

            paid_visitors,
            free_visitors,
            total_visitors,

            offer_id,
            offer_code,
            offer_name,

            coupon_id,
            coupon_code,

            booking_status,
            payment_status,
            remarks
        )
        VALUES (
            ?,?,?,?,?,?,
            ?,?,?,
            ?,?,?,
            ?,?,?,
            ?,?,
            ?,?,?,
            ?,?,?,
            ?,?,
            ?,?,?
        )
        `,
        [
            booking.bookingNumber,
            booking.userId,

            booking.guestName,
            booking.guestEmail,
            booking.guestMobile,

            booking.visitDate,

            booking.ticketSubtotal,
            booking.mealSubtotal,
            booking.subtotal,

            booking.offerDiscount,
            booking.couponDiscount,
            booking.totalDiscount,

            booking.ticketTax,
            booking.foodTax,
            booking.totalTax,

            booking.convenienceFee,
            booking.grandTotal,

            booking.paidVisitors,
            booking.freeVisitors,
            booking.totalVisitors,

            booking.offerId,
            booking.offerCode,
            booking.offerName,

            booking.couponId,
            booking.couponCode,

            booking.bookingStatus,
            booking.paymentStatus,

            booking.remarks || null
        ]
    );

    return result.insertId;
}

/**
 * Find booking by ID.
 */
async function findById(connection = db, bookingId) {

    const [rows] = await connection.execute(
        `
        SELECT *
        FROM bookings
        WHERE id = ?
        LIMIT 1
        `,
        [bookingId]
    );

    return rows.length ? rows[0] : null;
}

/**
 * Find booking by booking number.
 */
async function findByBookingNumber(connection = db, bookingNumber) {

    const [rows] = await connection.execute(
        `
        SELECT *
        FROM bookings
        WHERE booking_number = ?
        LIMIT 1
        `,
        [bookingNumber]
    );

    return rows.length ? rows[0] : null;
}

/**
 * Update booking status.
 */
async function updateBookingStatus(
    connection = db,
    bookingId,
    bookingStatus
) {

    await connection.execute(
        `
        UPDATE bookings
        SET
            booking_status = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [
            bookingStatus,
            bookingId
        ]
    );

}

/**
 * Update payment status.
 */
async function updatePaymentStatus(
    connection = db,
    bookingId,
    paymentStatus
) {

    await connection.execute(
        `
        UPDATE bookings
        SET
            payment_status = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [
            paymentStatus,
            bookingId
        ]
    );

}

/**
 * Find booking by payment status.
 */
async function findByPaymentStatus(
    connection = db,
    paymentStatus
) {

    const [rows] = await connection.execute(
        `
        SELECT *
        FROM bookings
        WHERE payment_status = ?
        ORDER BY created_at DESC
        `,
        [paymentStatus]
    );

    return rows;

}
/**
 * Get all bookings for a user.
 *
 * @param {Object} connection
 * @param {number} userId
 * @returns {Promise<Array>}
 */
async function findByUserId(
    connection = db,
    userId
) {

    const [rows] = await connection.execute(
        `
        SELECT *
        FROM bookings
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return rows;

}

module.exports = {

    createBooking,
    findByUserId,

    findById,
    getBookingById: (connection, bookingId) => bookingId === undefined ? findById(undefined, connection) : findById(connection, bookingId),

    findByBookingNumber,

    updateBookingStatus,

    updatePaymentStatus,

    findByPaymentStatus

};