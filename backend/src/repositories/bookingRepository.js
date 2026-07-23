const pool = require("../config/database");

/**
 * Create Booking
 */
async function createBooking(booking) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert Booking
    const [result] = await connection.execute(
      `INSERT INTO bookings
      (
        booking_number,
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
        coupon_code
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking.bookingNumber,
        booking.customerId,
        booking.customerName,
        booking.customerEmail,
        booking.customerMobile,
        booking.visitDate,
        booking.offerId,
        booking.offerName,
        booking.subtotal,
        booking.discount,
        booking.tax,
        booking.grandTotal,
        booking.couponCode,
      ]
    );

    await connection.commit();

    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Save Ticket Items
 */
async function saveTicketItems(bookingId, ticketQty) {
  const connection = await pool.getConnection();

  try {
    for (const [ticketType, quantity] of Object.entries(ticketQty)) {
      if (quantity <= 0) continue;

      await connection.execute(
        `INSERT INTO booking_items
        (
          booking_id,
          ticket_type,
          quantity,
          unit_price,
          total_price
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
          bookingId,
          ticketType,
          quantity,
          0,
          0,
        ]
      );
    }
  } finally {
    connection.release();
  }
}

/**
 * Save Meal Items
 */
async function saveMealItems(bookingId, mealQty) {
  const connection = await pool.getConnection();

  try {
    for (const [mealType, quantity] of Object.entries(mealQty)) {
      if (quantity <= 0) continue;

      await connection.execute(
        `INSERT INTO booking_meals
        (
          booking_id,
          meal_type,
          quantity,
          unit_price,
          total_price
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
          bookingId,
          mealType,
          quantity,
          0,
          0,
        ]
      );
    }
  } finally {
    connection.release();
  }
}

module.exports = {
  createBooking,
  saveTicketItems,
  saveMealItems,
};