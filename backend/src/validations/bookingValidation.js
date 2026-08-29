const Joi = require("joi");

const updateSessionSchema = Joi.object({
    visitDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            "string.pattern.base": "visitDate must be in YYYY-MM-DD format",
            "any.required": "visitDate is required"
        }),

    // Regular / Offer booking mode
    bookingType: Joi.string()
        .valid("REGULAR", "OFFER")
        .optional(),

    // Selected offer ID
    offerId: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .optional()
}).unknown(false);


const updateSessionItemsSchema = Joi.object({
    // Regular tickets
    tickets: Joi.array().items(
        Joi.object({
            ticketTypeId: Joi.number()
                .integer()
                .positive()
                .required(),

            quantity: Joi.number()
                .integer()
                .min(1)
                .required()
        })
    ).optional()
        .unique(
            (a, b) => a.ticketTypeId === b.ticketTypeId
        )
        .messages({
            "array.unique": "Duplicate ticket types are not allowed"
        }),

    // Add-ons
    addons: Joi.array().items(
        Joi.object({
            addonId: Joi.number()
                .integer()
                .positive()
                .required(),

            quantity: Joi.number()
                .integer()
                .min(1)
                .required()
        })
    ).optional()
        .unique(
            (a, b) => a.addonId === b.addonId
        )
        .messages({
            "array.unique": "Duplicate addons are not allowed"
        }),

    // Offer tickets
    offerTickets: Joi.array().items(
        Joi.object({
            offerTicketId: Joi.number()
                .integer()
                .positive()
                .required(),

            quantity: Joi.number()
                .integer()
                .min(1)
                .required()
        })
    ).optional()
        .unique(
            (a, b) => a.offerTicketId === b.offerTicketId
        )
        .messages({
            "array.unique": "Duplicate offer tickets are not allowed"
        })
}).unknown(false).custom((obj, helpers) => {
    const hasTickets = obj.tickets && obj.tickets.length > 0;
    const hasOffers = obj.offerTickets && obj.offerTickets.length > 0;
    if (!hasTickets && !hasOffers) {
        return helpers.message('"tickets" or "offerTickets" must contain at least 1 item');
    }
    return obj;
});


const updateCustomerSchema = Joi.object({
    leadTravellerName: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .max(150)
        .required(),

    mobile: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .required(),

    whatsappDelivery: Joi.boolean()
        .default(true)
}).unknown(false);


const verifyPaymentSchema = Joi.object({
    razorpay_order_id: Joi.string().trim().min(1).max(100).required(),
    razorpay_payment_id: Joi.string().trim().min(1).max(100).required(),
    razorpay_signature: Joi.string().trim().min(1).max(256).required()
}).unknown(false);


module.exports = {
    updateSessionSchema,
    updateSessionItemsSchema,
    updateCustomerSchema,
    verifyPaymentSchema
};