const Joi = require("joi");

const registerSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  phone: Joi.string()
    .trim()
    .min(10)
    .max(15)
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required(),
  
  newPassword: Joi.string()
    .min(6)
    .max(100)
    .required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};