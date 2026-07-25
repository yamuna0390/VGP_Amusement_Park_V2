const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

// PUT /api/auth/profile (Update authenticated user email and mobile phone)
router.put(
  "/profile",
  authMiddleware,
  authController.updateProfile
);

module.exports = router;