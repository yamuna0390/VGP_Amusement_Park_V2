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

        const data = await bookingSessionService.updateSession(rawToken, value);

        // Map to Response DTO
        const responseData = BookingSessionResponseDTO.fromEntities(data);

        const message = value.bookingType === 'OFFER' ? "Booking selection updated" : "Visit date updated";

        return success(res, message, responseData, 200);
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

module.exports = {
    createSession,
    updateSession,
    updateSessionItems,
    updateCustomer,
    generateQuote
};
