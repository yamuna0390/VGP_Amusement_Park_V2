const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Routes
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const bookingInitRoutes = require("./routes/bookingInitRoutes");
const offerRoutes = require("./routes/offerRoutes");
const couponRoutes = require("./routes/couponRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const mealRoutes = require("./routes/mealRoutes");

// Middleware
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

/**
 * ==========================================
 * Security Middleware
 * ==========================================
 */
app.use(helmet());

/**
 * ==========================================
 * HTTP Request Logger
 * ==========================================
 */
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/**
 * ==========================================
 * CORS
 * ==========================================
 */
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);

/**
 * ==========================================
 * Body Parsers
 * ==========================================
 */
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

/**
 * ==========================================
 * Root Endpoint
 * ==========================================
 */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        application: "VGP Amusement Park Booking API",
        version: "1.0.0",
    });
});

/**
 * ==========================================
 * Health Check
 * ==========================================
 */
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running.",
        timestamp: new Date().toISOString(),
    });
});

/**
 * ==========================================
 * API Routes
 * ==========================================
 */
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingInitRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/meals", mealRoutes);
/**
 * ==========================================
 * 404 Handler
 * ==========================================
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found.",
    });
});

/**
 * ==========================================
 * Global Error Handler
 * ==========================================
 */
app.use(errorMiddleware);

module.exports = app;