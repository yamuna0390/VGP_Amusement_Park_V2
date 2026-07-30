const Joi = require("joi");

/**
 * Customer Details
 */
const customerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(150)
        .required()
        .messages({
            "string.empty": "Customer name is required.",
            "string.min": "Customer name must contain at least 3 characters.",
            "string.max": "Customer name cannot exceed 150 characters.",
            "any.required": "Customer name is required."
        }),

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.email": "Please enter a valid email address.",
            "string.empty": "Email address is required.",
            "any.required": "Email address is required."
        }),

    mobile: Joi.string()
        .trim()
        .pattern(/^\+?[0-9]{10,15}$/)
        .required()
        .messages({
            "string.pattern.base": "Please enter a valid mobile number.",
            "string.empty": "Mobile number is required.",
            "any.required": "Mobile number is required."
        })

}).required().unknown(false);


/**
 * Ticket Item
 */
const ticketSchema = Joi.object({
    ticketTypeId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Invalid ticket type.",
            "number.integer": "Invalid ticket type.",
            "number.positive": "Invalid ticket type.",
            "any.required": "Ticket type is required."
        }),

    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            "number.base": "Ticket quantity must be a number.",
            "number.integer": "Ticket quantity must be a whole number.",
            "number.min": "Ticket quantity must be at least 1.",
            "any.required": "Ticket quantity is required."
        })

}).unknown(false);


/**
 * Meal Item
 */
const mealSchema = Joi.object({
    mealTypeId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Invalid meal type.",
            "number.integer": "Invalid meal type.",
            "number.positive": "Invalid meal type.",
            "any.required": "Meal type is required."
        }),

    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            "number.base": "Meal quantity must be a number.",
            "number.integer": "Meal quantity must be a whole number.",
            "number.min": "Meal quantity must be at least 1.",
            "any.required": "Meal quantity is required."
        })

}).unknown(false);


/**
 * Booking Request
 */
const bookingRequestSchema = Joi.object({

    visitDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            "string.pattern.base": "Visit date must be in YYYY-MM-DD format.",
            "string.empty": "Visit date is required.",
            "any.required": "Visit date is required."
        }),

    customer: customerSchema,

    offerCode: Joi.string()
        .trim()
        .max(50)
        .allow(null, "")
        .optional(),

    couponCode: Joi.string()
        .trim()
        .max(50)
        .allow(null, "")
        .optional(),

    tickets: Joi.array()
        .items(ticketSchema)
        .min(1)
        .required()
        .messages({
            "array.base": "Tickets must be an array.",
            "array.min": "Select at least one ticket.",
            "any.required": "At least one ticket is required."
        }),

    meals: Joi.array()
        .items(mealSchema)
        .default([]),

    agreedToTerms: Joi.boolean()
        .valid(true)
        .required()
        .messages({
            "any.only": "Please accept the Terms & Conditions.",
            "any.required": "Terms & Conditions acceptance is required."
        })

})
.options({
    abortEarly: false,
    stripUnknown: true
});


module.exports = {
    bookingRequestSchema
};