const authService = require("../services/auth/authService");
const response = require("../utils/response");

/**
 * Register User
 */
async function register(req, res) {
  try {
    const rawToken = req.cookies?.booking_session;
    const result = await authService.register(req.body, rawToken);

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
    const rawToken = req.cookies?.booking_session;

    const result = await authService.login(email, password, rawToken);

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

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    
    await authService.forgotPassword(email);

    // Generic response regardless of whether the email exists
    return response.success(
      res,
      "If an account exists for this email, a password reset link has been sent."
    );
  } catch (error) {
    return response.error(
      res,
      error.message,
      400
    );
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    return response.success(
      res,
      "Password has been successfully reset."
    );
  } catch (error) {
    return response.error(
      res,
      error.message,
      400
    );
  }
}

module.exports = {
  register,
  login,
  updateProfile,
  forgotPassword,
  resetPassword,
};