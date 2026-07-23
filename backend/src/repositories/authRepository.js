const pool = require("../config/database");

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

module.exports = {
  findUserByEmail,
  createUser,
};