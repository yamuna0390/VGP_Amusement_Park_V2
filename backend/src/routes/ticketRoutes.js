const express = require("express");

const router = express.Router();

const ticketController = require("../controllers/ticketController");

/**
 * ==========================================
 * Customer Ticket APIs
 * ==========================================
 */

/**
 * GET /api/tickets
 */
router.get(
    "/",
    ticketController.getTickets
);

module.exports = router;