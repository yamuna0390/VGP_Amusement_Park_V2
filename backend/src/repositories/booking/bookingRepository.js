const db = require("../../config/database");

/**
 * Generates a unique booking number for a specific visit date.
 * Format: VGP{YYMMDD}{6-digit-sequence}
 * Example: VGP240815000005
 * 
 * @param {string} visitDate - Date string in YYYY-MM-DD format
 * @param {object} connection - Optional transaction connection
 */
async function generateBookingNumber(visitDate, connection = db) {
    const dateObj = new Date(visitDate);
    const yy = String(dateObj.getFullYear()).slice(-2);
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    
    const datePrefix = `${yy}${mm}${dd}`;

    // Atomically increment and get the sequence
    const query = `
        INSERT INTO booking_sequences (visit_date, last_sequence)
        VALUES (?, 1)
        ON DUPLICATE KEY UPDATE last_sequence = LAST_INSERT_ID(last_sequence + 1)
    `;
    
    await connection.execute(query, [visitDate]);
    
    // Retrieve the value that LAST_INSERT_ID() just computed
    const [rows] = await connection.execute('SELECT LAST_INSERT_ID() as seq');
    
    let seq = rows[0].seq;
    // Note: If the INSERT was a new row (not DUPLICATE KEY), LAST_INSERT_ID() returns 1 but we still want 1.
    // However, if LAST_INSERT_ID() returns 0 (which shouldn't happen with the above UPDATE), default to 1.
    if (seq === 0) {
        const [fallback] = await connection.execute('SELECT last_sequence FROM booking_sequences WHERE visit_date = ?', [visitDate]);
        seq = fallback[0].last_sequence;
    }

    const sequenceString = String(seq).padStart(6, '0');
    
    return `VGP${datePrefix}${sequenceString}`;
}

/**
 * Creates a new booking record in the database.
 * 
 * @param {object} bookingData - The booking details
 * @param {object} connection - Optional transaction connection
 */
async function createBooking(bookingData, connection = db) {
    const query = `
        INSERT INTO bookings (
            booking_number, user_id, guest_name, guest_email, guest_mobile, 
            visit_date, ticket_subtotal, meal_subtotal, subtotal, 
            offer_discount, coupon_discount, total_discount, 
            ticket_tax, food_tax, total_tax, convenience_fee, grand_total, 
            paid_visitors, free_visitors, total_visitors, 
            offer_id, offer_code, offer_name, coupon_id, coupon_code, 
            booking_status, payment_status, remarks
        ) VALUES (
            ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, 
            ?, ?, ?, 
            ?, ?, ?, ?, ?, 
            ?, ?, ?, 
            ?, ?, ?, ?, ?, 
            ?, ?, ?
        )
    `;

    const values = [
        bookingData.booking_number,
        bookingData.user_id || null,
        bookingData.guest_name,
        bookingData.guest_email,
        bookingData.guest_mobile,
        bookingData.visit_date,
        bookingData.ticket_subtotal || 0,
        bookingData.meal_subtotal || 0,
        bookingData.subtotal || 0,
        bookingData.offer_discount || 0,
        bookingData.coupon_discount || 0,
        bookingData.total_discount || 0,
        bookingData.ticket_tax || 0,
        bookingData.food_tax || 0,
        bookingData.total_tax || 0,
        bookingData.convenience_fee || 0,
        bookingData.grand_total || 0,
        bookingData.paid_visitors || 0,
        bookingData.free_visitors || 0,
        bookingData.total_visitors || 0,
        bookingData.offer_id || null,
        bookingData.offer_code || null,
        bookingData.offer_name || null,
        bookingData.coupon_id || null,
        bookingData.coupon_code || null,
        bookingData.booking_status || 'PAYMENT_PENDING',
        bookingData.payment_status || 'PENDING',
        bookingData.remarks || null
    ];

    const [result] = await connection.execute(query, values);
    return result.insertId;
}

/**
 * Retrieves a booking by its ID.
 */
async function getBookingById(bookingId, connection = db) {
    const [rows] = await connection.execute('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    return rows[0] || null;
}

/**
 * Updates the booking and payment status for a booking.
 * 
 * @param {number} bookingId 
 * @param {string} bookingStatus 
 * @param {string} paymentStatus 
 * @param {object} connection 
 */
async function updateBookingPaymentStatus(bookingId, bookingStatus, paymentStatus, connection = db) {
    const query = `
        UPDATE bookings 
        SET 
            booking_status = ?,
            payment_status = ?
        WHERE id = ?
    `;
    const [result] = await connection.execute(query, [bookingStatus, paymentStatus, bookingId]);
    return result.affectedRows > 0;
}

/**
 * Generates a unique invoice number.
 * Format: INV{YYMMDD}{6-digit-sequence}
 * Example: INV260811000001
 * 
 * @param {string} visitDate - Can use current date or visit date, but typically current date for invoice
 * @param {object} connection - Optional transaction connection
 */
async function generateInvoiceNumber(invoiceDate, connection = db) {
    const dateObj = new Date(invoiceDate);
    const yy = String(dateObj.getFullYear()).slice(-2);
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    
    const datePrefix = `${yy}${mm}${dd}`;
    const dateStr = `${dateObj.getFullYear()}-${mm}-${dd}`;

    const query = `
        INSERT INTO invoice_sequences (invoice_date, last_sequence)
        VALUES (?, 1)
        ON DUPLICATE KEY UPDATE last_sequence = LAST_INSERT_ID(last_sequence + 1)
    `;
    
    const [result] = await connection.execute(query, [dateStr]);
    
    let seq;
    if (result.affectedRows === 1) {
        // It was a brand new insert, so the sequence is exactly 1.
        seq = 1;
    } else {
        // It was an update, so LAST_INSERT_ID() was populated by the UPDATE clause.
        const [rows] = await connection.execute('SELECT LAST_INSERT_ID() as seq');
        seq = rows[0].seq;
    }

    const sequenceString = String(seq).padStart(6, '0');
    return `INV${datePrefix}${sequenceString}`;
}

/**
 * Updates the invoice number for a booking.
 */
async function updateBookingInvoiceNumber(bookingId, invoiceNumber, connection = db) {
    const query = `UPDATE bookings SET invoice_number = ? WHERE id = ?`;
    const [result] = await connection.execute(query, [invoiceNumber, bookingId]);
    return result.affectedRows > 0;
}

/**
 * Gets the invoice number for a booking.
 */
async function getInvoiceNumberByBookingId(bookingId, connection = db) {
    const [rows] = await connection.execute('SELECT invoice_number FROM bookings WHERE id = ?', [bookingId]);
    return rows.length > 0 ? rows[0].invoice_number : null;
}

/**
 * Updates the QR token for a booking.
 * 
 * @param {number} bookingId 
 * @param {string} qrToken 
 * @param {object} connection 
 */
async function updateBookingQrToken(bookingId, qrToken, connection) {
    const query = `UPDATE bookings SET qr_token = ? WHERE id = ?`;
    const [result] = await connection.execute(query, [qrToken, bookingId]);
    return result.affectedRows > 0;
}

/**
 * Retrieves a booking by QR token with an exclusive row lock.
 * 
 * @param {string} qrToken 
 * @param {object} connection 
 */
async function getBookingByQrTokenLock(qrToken, connection) {
    const query = `SELECT * FROM bookings WHERE qr_token = ? FOR UPDATE`;
    const [rows] = await connection.execute(query, [qrToken]);
    return rows[0] || null;
}

/**
 * Retrieves a booking by QR token without locking.
 * 
 * @param {string} qrToken 
 * @param {object} connection 
 */
async function getBookingByQrToken(qrToken, connection = db) {
    const query = `SELECT * FROM bookings WHERE qr_token = ?`;
    const [rows] = await connection.execute(query, [qrToken]);
    return rows[0] || null;
}

/**
 * Marks a booking as redeemed by setting redeemed_at.
 * 
 * @param {number} bookingId 
 * @param {object} connection 
 */
async function markBookingRedeemed(bookingId, connection) {
    const query = `UPDATE bookings SET redeemed_at = NOW() WHERE id = ?`;
    const [result] = await connection.execute(query, [bookingId]);
    return result.affectedRows > 0;
}

module.exports = {
    generateBookingNumber,
    generateInvoiceNumber,
    createBooking,
    getBookingById,
    updateBookingPaymentStatus,
    updateBookingInvoiceNumber,
    getInvoiceNumberByBookingId,
    updateBookingQrToken,
    getBookingByQrToken,
    getBookingByQrTokenLock,
    markBookingRedeemed
};
