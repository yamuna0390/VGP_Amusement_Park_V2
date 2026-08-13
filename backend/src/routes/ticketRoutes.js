const express = require("express");

const router = express.Router();

const ticketController = require("../controllers/ticketController");
const ticketPdfController = require("../controllers/ticketPdfController");

/**
 * ==========================================
 * Customer Ticket APIs
 * ==========================================
 */

/**
 * GET /api/tickets/pdf/:qrToken
 */
router.get(
    "/pdf/:qrToken",
    ticketPdfController.downloadPdf
);

/**
 * GET /api/tickets
 */
router.get(
    "/",
    ticketController.getTickets
);

module.exports = router;