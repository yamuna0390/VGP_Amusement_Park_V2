const Joi = require("joi");

const groupQuoteSchema = Joi.object({
    organisationName: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required()
        .messages({
            "string.empty": "Organisation Name is required",
            "any.required": "Organisation Name is required"
        }),

    groupSize: Joi.number()
        .integer()
        .positive()
        .min(1)
        .max(10000)
        .required()
        .messages({
            "number.base": "Group Size must be a valid number",
            "number.integer": "Group Size must be a valid integer",
            "number.positive": "Group Size must be a positive number",
            "number.min": "Group Size must be at least 1",
            "any.required": "Group Size is required"
        }),

    preferredDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .custom((value, helpers) => {
            const parsedDate = new Date(value);
            if (isNaN(parsedDate.getTime())) {
                return helpers.message("Invalid preferred date.");
            }
            if (parsedDate.toISOString().split("T")[0] !== value) {
                return helpers.message("Invalid calendar date.");
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const pref = new Date(parsedDate);
            pref.setHours(0, 0, 0, 0);

            if (pref < today) {
                return helpers.message("Preferred Date cannot be in the past.");
            }
            return value;
        })
        .messages({
            "string.pattern.base": "Preferred Date must be in YYYY-MM-DD format",
            "any.required": "Preferred Date is required"
        }),

    contactNumber: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.pattern.base": "Contact Number must contain exactly 10 digits",
            "string.empty": "Contact Number is required",
            "any.required": "Contact Number is required"
        }),

    email: Joi.string()
        .trim()
        .email()
        .allow(null, "")
        .optional()
        .messages({
            "string.email": "Please provide a valid email address"
        })
}).unknown(false);

module.exports = {
    groupQuoteSchema
};
