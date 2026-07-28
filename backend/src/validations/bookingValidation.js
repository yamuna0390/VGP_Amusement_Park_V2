const Joi = require("joi");

const bookingSchema = Joi.object({
  visitDate: Joi.date().required().messages({
    "any.required": "Visit date is required.",
    "date.base": "Invalid visit date.",
  }),

 offerId: Joi.number().allow(null),

offerCode: Joi.string()
  .trim()
  .allow("", null)
  .optional(),

couponCode: Joi.string()
  .trim()
  .allow("", null)
  .optional(),

  customer: Joi.object({
    name: Joi.string().trim().min(3).max(150).required().messages({
      "string.empty": "Customer name is required.",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Invalid email address.",
    }),

    mobile: Joi.string().trim().min(10).max(15).required().messages({
      "string.empty": "Mobile number is required.",
    }),
  }).required(),

  agreedToTerms: Joi.boolean().valid(true).required().messages({
    "any.only": "Please accept the Terms & Conditions.",
  }),

  tickets: Joi.array()
    .items(
      Joi.object({
        ticketType: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Select at least one ticket.",
    }),

  meals: Joi.array().items(
    Joi.object({
      mealType: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ),
});

module.exports = {
  bookingSchema,
};