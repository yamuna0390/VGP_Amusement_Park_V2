const Joi = require("joi");

const updateSessionSchema = Joi.object({
    visitDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            "string.pattern.base": "visitDate must be in YYYY-MM-DD format",
            "any.required": "visitDate is required"
        }),
    bookingType: Joi.string()
        .valid("REGULAR", "OFFER")
        .required()
        .messages({
            "any.only": "bookingType must be either REGULAR or OFFER",
            "any.required": "bookingType is required"
        }),
    offerId: Joi.alternatives().conditional("bookingType", {
        is: "OFFER",
        then: Joi.number().required().messages({
            "any.required": "offerId is required when bookingType is OFFER"
        }),
        otherwise: Joi.valid(null).optional()
    })
});

const updateSessionItemsSchema = Joi.object({
    tickets: Joi.array().items(
        Joi.object({
            ticketTypeId: Joi.number().integer().positive().required(),
            quantity: Joi.number().integer().min(1).required()
        })
    ).min(1).required().unique((a, b) => a.ticketTypeId === b.ticketTypeId).messages({
        "array.unique": "Duplicate ticket types are not allowed"
    }),
    addons: Joi.array().items(
        Joi.object({
            addonId: Joi.number().integer().positive().required(),
            quantity: Joi.number().integer().min(1).required()
        })
    ).optional().unique((a, b) => a.addonId === b.addonId).messages({
        "array.unique": "Duplicate addons are not allowed"
    })
}).unknown(false);

const updateCustomerSchema = Joi.object({
    leadTravellerName: Joi.string().trim().max(150).required(),
    email: Joi.string().trim().email().max(150).required(),
    mobile: Joi.string().trim().max(20).required(),
    whatsappDelivery: Joi.boolean().default(true)
}).unknown(false);

module.exports = {
    updateSessionSchema,
    updateSessionItemsSchema,
    updateCustomerSchema
};
