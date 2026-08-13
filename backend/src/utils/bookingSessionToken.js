const crypto = require("crypto");

/**
 * Generate a cryptographically secure random session token.
 * 
 * @returns {string} The raw token.
 */
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash a token using SHA-256 for secure storage.
 * 
 * @param {string} token 
 * @returns {string} The hashed token.
 */
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  generateToken,
  hashToken,
};
