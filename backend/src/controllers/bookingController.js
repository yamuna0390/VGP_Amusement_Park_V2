const bookingSessionService = require("../services/booking/bookingSessionService");
const { success } = require("../utils/response");
const BookingSessionResponseDTO = require("../dto/BookingSessionResponseDTO");

/**
 * POST /api/booking/session
 * Creates a new booking session and loads catalogue data.
 */
async function createSession(req, res, next) {
    try {
        const { rawToken, data } = await bookingSessionService.createSession(req.user);

        // Map to Response DTO
        const responseData = BookingSessionResponseDTO.fromEntities(data);

        // Set HttpOnly Cookie
        res.cookie("booking_session", rawToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 60 * 1000 // 30 minutes
        });

        // Return successful response using the existing helper
        return success(res, "Booking session created", responseData, 201);
    } catch (error) {
        next(error);
    }
}

/**
 * PATCH /api/booking/session
 * Updates the visit date and/or selected offer.
 */
/**
 * PATCH /api/booking/session
 * API 2 - Updates and validates the visit date only.
 */
async function updateSession(req, res, next) {
    try {
        const { updateSessionSchema } = require("../validations/bookingValidation");

        // Validate request body
        const { error, value } = updateSessionSchema.validate(req.body);

        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            err.code = "VALIDATION_ERROR";
            throw err;
        }

        const rawToken = req.cookies.booking_session;

        const data = await bookingSessionService.updateSession(
            rawToken,
            value
        );

        // Map to Response DTO
        const responseData = BookingSessionResponseDTO.fromEntities(data);

        return success(
            res,
            "Visit date updated",
            responseData,
            200
        );
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/booking/session/items
 * Replaces the session items (tickets and addons).
 */
async function updateSessionItems(req, res, next) {
    try {
        const { updateSessionItemsSchema } = require("../validations/bookingValidation");
        
        // Validate request body
        const { error, value } = updateSessionItemsSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            err.code = "VALIDATION_ERROR";
            throw err;
        }

        const rawToken = req.cookies.booking_session;

        const data = await bookingSessionService.updateSessionItems(rawToken, value);

        // Map to Response DTO
        const responseData = BookingSessionResponseDTO.fromSessionItems(data.updatedSession, data.updatedItems, data.offerMappings);

        return success(res, "Booking items updated", responseData, 200);
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/booking/session/customer
 * Updates the customer information for the booking session.
 */
async function updateCustomer(req, res, next) {
    try {
        const { updateCustomerSchema } = require("../validations/bookingValidation");
        
        // Validate request body
        const { error, value } = updateCustomerSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            err.code = "VALIDATION_ERROR";
            throw err;
        }

        const rawToken = req.cookies.booking_session;

        const data = await bookingSessionService.updateCustomer(rawToken, value);

        // Map to Response DTO
        const responseData = BookingSessionResponseDTO.fromCustomerItems(data.updatedSession, data.updatedCustomer);

        return success(res, "Customer information updated", responseData, 200);
    } catch (error) {
        next(error);
    }
}

const bookingSessionQuoteService = require("../services/booking/bookingSessionQuoteService");

/**
 * POST /api/booking/session/quote
 * Generates quote for the booking session.
 */
async function generateQuote(req, res, next) {
    try {
        const rawToken = req.cookies.booking_session;

        const data = await bookingSessionQuoteService.generateQuote(rawToken);

        // We can just return the data directly as it's already formatted by the service per the requirements
        return success(res, "Quote generated", data, 200);
    } catch (error) {
        next(error);
    }
}

const bookingRepository = require("../repositories/booking/bookingRepository");

/**
 * GET /api/booking/my-bookings
 * Retrieves all bookings for the authenticated user.
 */
async function getMyBookings(req, res, next) {
    try {
        if (!req.user || !req.user.id) {
            const err = new Error("Unauthorized");
            err.statusCode = 401;
            throw err;
        }

        const bookings = await bookingRepository.findBookingsByUserId(req.user.id);

        return success(res, "Bookings retrieved", bookings, 200);
    } catch (error) {
        next(error);
    }
}

const path = require("path");
const fs = require("fs");
const { generateBookingPdf } = require("../services/pdf/pdfService");

/**
 * GET /api/booking/my-bookings/:id/pdf
 * Authenticated endpoint for a customer to download their own PDF without exposing qr_token.
 */
async function downloadMyBookingPdf(req, res, next) {
    try {
        if (!req.user || !req.user.id) {
            const err = new Error("Unauthorized");
            err.statusCode = 401;
            throw err;
        }

        const bookingId = req.params.id;
        const booking = await bookingRepository.getBookingById(bookingId);

        if (!booking || booking.user_id !== req.user.id) {
            const err = new Error("Ticket not found or unauthorized");
            err.statusCode = 404;
            throw err;
        }

        if (booking.booking_status !== 'CONFIRMED' || booking.payment_status !== 'SUCCESS') {
            const err = new Error("Ticket not found or unauthorized");
            err.statusCode = 403;
            throw err;
        }

        const tempFilename = `ticket_${booking.id}_${Date.now()}.pdf`;
        const outputPath = path.join(__dirname, '../../tmp', tempFilename);

        const tmpDir = path.dirname(outputPath);
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        await generateBookingPdf(booking.id, outputPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="VGP_Tickets.pdf"`);

        const readStream = fs.createReadStream(outputPath);
        readStream.pipe(res);

        readStream.on('end', () => {
            fs.unlink(outputPath, (err) => {
                // Ignore cleanup errors
            });
        });
        
        readStream.on('error', (err) => {
            next(err);
        });
    } catch (error) {
        next(error);
    }
}

async function getInternalRenderData(req, res, next) {
    try {
        const { id } = req.params;
        const { secret } = req.query;
        if (secret !== 'canonical-render-secret') {
            return res.status(403).json({ error: "Forbidden" });
        }
        
        const booking = await bookingRepository.getAdminBookingDetailsById(id);
        if (!booking) return res.status(404).json({ error: "Not found" });
        
        const rawBooking = await bookingRepository.getBookingById(id);
        booking.unmasked_qr_token = rawBooking ? rawBooking.qr_token : '';
        
        if (booking.remarks) {
            try {
                const remarks = JSON.parse(booking.remarks);
                if (remarks.sessionId) {
                    const db = require("../config/database");
                    const [sessionItems] = await db.execute('SELECT * FROM booking_session_items WHERE session_id = ?', [remarks.sessionId]);
                    if (sessionItems.length > 0) {
                        const [sessionComponents] = await db.execute('SELECT * FROM booking_session_item_components WHERE session_item_id IN (SELECT id FROM booking_session_items WHERE session_id = ?)', [remarks.sessionId]);
                        const [tickets] = await db.execute('SELECT id, name, code FROM ticket_types');
                        booking.sessionItems = sessionItems;
                        booking.sessionComponents = sessionComponents;
                        booking.ticketsMetadata = tickets;
                    }
                }
            } catch (err) {
                console.error("Internal Render: Failed to fetch session data", err);
            }
        }
        
        return res.status(200).json({ data: booking });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createSession,
    updateSession,
    updateSessionItems,
    updateCustomer,
    generateQuote,
    getMyBookings,
    downloadMyBookingPdf,
    getInternalRenderData
};
