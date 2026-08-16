const pool = require("../../config/database");

/**
 * Find a user by email
 */
async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
}

/**
 * Create a new user
 */
async function createUser(user) {
  const { fullName, email, phone, password, role } = user;

  const [result] = await pool.execute(
    `INSERT INTO users
      (full_name, email, phone, password, role)
     VALUES (?, ?, ?, ?, ?)`,
    [fullName, email, phone, password, role]
  );

  return result.insertId;
}

/**
 * Find a user by ID
 */
async function findUserById(id) {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );

  return rows[0];
}

/**
 * Update user email and phone
 */
async function updateUserProfile(id, email, phone) {
  await pool.execute(
    "UPDATE users SET email = ?, phone = ? WHERE id = ?",
    [email, phone, id]
  );
}

/**
 * Update the user's reset token and expiration
 */
async function updateResetToken(email, token, expiresAt) {
  await pool.execute(
    "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?",
    [token, expiresAt, email]
  );
}

/**
 * Find a user by reset token where token is not expired
 */
async function findUserByResetToken(token) {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()",
    [token]
  );
  return rows[0];
}

/**
 * Update the user's password and clear the reset token
 */
async function updatePassword(id, hashedPassword) {
  await pool.execute(
    "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?",
    [hashedPassword, id]
  );
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserProfile,
  updateResetToken,
  findUserByResetToken,
  updatePassword,
};