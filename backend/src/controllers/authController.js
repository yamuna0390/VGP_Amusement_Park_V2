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

module.exports = {
  register,
  login,
};