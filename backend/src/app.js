const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./routes/authRoutes");
const offerRoutes = require("./routes/offerRoutes");
const couponRoutes = require("./routes/couponRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const mealRoutes = require("./routes/mealRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

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

app.use(cookieParser());

/**
 * ==========================================
 * Root Endpoint
 * ==========================================
 */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        application: "VGP Amusement Park API",
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
app.use("/api/offers", offerRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/booking", bookingRoutes);
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