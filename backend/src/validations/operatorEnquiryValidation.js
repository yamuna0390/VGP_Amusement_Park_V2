const Joi = require("joi");

const operatorEnquirySchema = Joi.object({
    operator_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Operator name is required",
            "any.required": "Operator name is required",
            "string.min": "Operator name must be at least 2 characters long",
            "string.max": "Operator name cannot exceed 100 characters"
        }),

    email: Joi.string()
        .trim()
        .email()
        .max(150)
        .required()
        .messages({
            "string.email": "Please provide a valid email address",
            "string.empty": "Email is required",
            "any.required": "Email is required"
        }),

    phone: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.pattern.base": "Phone number must contain exactly 10 digits",
            "string.empty": "Phone number is required",
            "any.required": "Phone number is required"
        }),

    message: Joi.string()
        .trim()
        .min(10)
        .max(1000)
        .required()
        .messages({
            "string.empty": "Message is required",
            "any.required": "Message is required",
            "string.min": "Message must be at least 10 characters long",
            "string.max": "Message cannot exceed 1000 characters"
        })
}).unknown(false);

module.exports = {
    operatorEnquirySchema
};
