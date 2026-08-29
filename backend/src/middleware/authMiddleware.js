const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/user/authRepository");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch latest user details from database to avoid trusting frontend payload
    const user = await authRepository.findUserById(decoded.id);
    if (!user) {
      req.user = null;
      return next();
    }

    req.user = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      mobile: user.phone,
      role: user.role
    };

    next();
  } catch (error) {
    let code = "UNAUTHORIZED";
    let message = "Authentication failed. Please log in again.";

    if (error.name === 'TokenExpiredError') {
      code = "SESSION_EXPIRED";
      message = "Your session has expired. Please log in again.";
    }

    return res.status(401).json({
      success: false,
      code,
      message
    });
  }
}

module.exports = authMiddleware;
