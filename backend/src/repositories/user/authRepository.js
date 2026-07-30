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

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserProfile,
};