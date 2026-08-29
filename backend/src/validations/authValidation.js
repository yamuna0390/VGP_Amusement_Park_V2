const Joi = require("joi");

const registerSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .max(150)
    .required(),

  phone: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),
}).unknown(false);

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .max(150)
    .required(),

  password: Joi.string()
    .required(),
}).unknown(false);

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .max(150)
    .required(),
}).unknown(false);

const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .trim()
    .required(),
  
  newPassword: Joi.string()
    .min(6)
    .max(100)
    .required(),
}).unknown(false);

const updateProfileSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required"
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must contain exactly 10 digits",
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required"
    })
}).unknown(false);

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};