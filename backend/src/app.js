const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// ----------------------------
// CORS
// ----------------------------
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// ----------------------------
// Body Parsers
// ----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------
// Health Check
// ----------------------------
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "VGP Backend API is running",
    });
});

// ----------------------------
// API Routes
// ----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// ----------------------------
// 404 Handler
// ----------------------------
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
    });
});

// ----------------------------
// Global Error Handler
// ----------------------------
app.use(errorMiddleware);

module.exports = app;