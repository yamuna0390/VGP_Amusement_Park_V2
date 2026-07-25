const authService = require("../services/auth/authService");
const response = require("../utils/response");

/**
 * Register User
 */
async function register(req, res) {
  try {
    const result = await authService.register(req.body);

    return response.success(
      res,
      result.message,
      {
        id: result.id,
      },
      201
    );
  } catch (error) {
    return response.error(
      res,
      error.message,
      400
    );
  }
}

/**
 * Login User
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return response.success(
      res,
      "Login successful",
      result
    );
  } catch (error) {
    return response.error(
      res,
      error.message,
      401
    );
  }
}

async function updateProfile(req, res) {
  try {
    if (!req.user) {
      return response.error(res, "Unauthorized. Please log in.", 401);
    }

    const { email, phone } = req.body;
    if (!email || !phone) {
      return response.error(res, "Email and phone numbers are required.", 400);
    }

    const updatedUser = await authService.updateProfile(req.user.id, email, phone);

    return response.success(res, "Profile updated successfully", {
      user: updatedUser
    });
  } catch (error) {
    return response.error(res, error.message, 400);
  }
}

module.exports = {
  register,
  login,
  updateProfile,
};