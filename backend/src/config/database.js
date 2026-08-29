const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Keep MySQL DATE columns as YYYY-MM-DD strings.
  // This prevents visit dates from being converted
  // into JavaScript Date objects and shifted by timezone.
  dateStrings: true,
});

module.exports = pool;