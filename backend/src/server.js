require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

const PORT = process.env.PORT || 5000;

/**
 * Cancels abandoned bookings that have remained in PAYMENT_PENDING / PENDING
 * state for more than 2 hours.
 *
 * Updates both tables consistently:
 *   bookings:          booking_status -> CANCELLED, payment_status -> FAILED
 *   booking_payments:  payment_status -> FAILED
 *
 * The UPDATE uses a JOIN so both tables are updated in a single atomic
 * statement. Only rows where both sides are still pending are touched,
 * so already-confirmed or already-failed bookings are never affected.
 */
async function cleanupAbandonedBookings() {
    try {
        const [result] = await pool.execute(`
            UPDATE bookings b
            JOIN booking_payments bp ON b.id = bp.booking_id
            SET b.booking_status  = 'CANCELLED',
                b.payment_status  = 'FAILED',
                bp.payment_status = 'FAILED'
            WHERE b.booking_status  = 'PAYMENT_PENDING'
              AND b.payment_status  = 'PENDING'
              AND bp.payment_status = 'PENDING'
              AND b.created_at < NOW() - INTERVAL 2 HOUR
        `);
        if (result.affectedRows > 0) {
            console.log(`[CLEANUP] Cancelled ${result.affectedRows} abandoned booking row(s).`);
        }
    } catch (error) {
        console.error("[CLEANUP] Failed to cleanup abandoned bookings:", error);
    }
}

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL Database");
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);

      // Run cleanup once immediately at startup, then every 15 minutes
      cleanupAbandonedBookings();
      setInterval(cleanupAbandonedBookings, 15 * 60 * 1000);
    });
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
