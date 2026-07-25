const createBooking = async (connection, bookingData) => {
    const [result] = await connection.query(
        `
        INSERT INTO bookings
        (
            booking_number,
            invoice_number,
            customer_id,
            customer_name,
            customer_email,
            customer_mobile,
            visit_date,
            offer_id,
            offer_name,
            subtotal,
            discount,
            tax,
            grand_total,
            coupon_code,
            payment_status,
            booking_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            bookingData.bookingNumber,
            bookingData.invoiceNumber,
            bookingData.customerId,
            bookingData.customerName,
            bookingData.customerEmail,
            bookingData.customerMobile,
            bookingData.visitDate,
            bookingData.offerId,
            bookingData.offerName,
            bookingData.subtotal,
            bookingData.discount,
            bookingData.tax,
            bookingData.grandTotal,
            bookingData.couponCode,
            bookingData.paymentStatus,
            bookingData.bookingStatus,
        ]
    );

    return result.insertId;
};

const createBookingItems = async (connection, bookingId, items) => {
    for (const item of items) {
        await connection.query(
            `
            INSERT INTO booking_items
            (
                booking_id,
                ticket_type,
                quantity,
                unit_price,
                total_price
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                bookingId,
                item.ticketType,
                item.quantity,
                item.unitPrice,
                item.totalPrice,
            ]
        );
    }
};

const createBookingMeals = async (connection, bookingId, meals) => {
    for (const meal of meals) {
        await connection.query(
            `
            INSERT INTO booking_meals
            (
                booking_id,
                meal_type,
                quantity,
                unit_price,
                total_price
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                bookingId,
                meal.mealType,
                meal.quantity,
                meal.unitPrice,
                meal.totalPrice,
            ]
        );
    }
};

const updateBookingNumber = async (connection, bookingId, bookingNumber, invoiceNumber) => {
    await connection.query(
        `
        UPDATE bookings
        SET booking_number = ?, invoice_number = ?
        WHERE id = ?
        `,
        [bookingNumber, invoiceNumber, bookingId]
    );
};

const pool = require("../config/database");

const getBookingsByCustomerId = async (customerId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM bookings WHERE customer_id = ? ORDER BY id DESC",
        [customerId]
    );
    return rows;
};

const getBookingByNumber = async (bookingNumber) => {
    const [rows] = await pool.execute(
        "SELECT * FROM bookings WHERE booking_number = ?",
        [bookingNumber]
    );
    return rows[0];
};

const getBookingItems = async (bookingId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM booking_items WHERE booking_id = ?",
        [bookingId]
    );
    return rows;
};

const getBookingMeals = async (bookingId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM booking_meals WHERE booking_id = ?",
        [bookingId]
    );
    return rows;
};

module.exports = {
    createBooking,
    createBookingItems,
    createBookingMeals,
    updateBookingNumber,
    getBookingsByCustomerId,
    getBookingByNumber,
    getBookingItems,
    getBookingMeals,
};