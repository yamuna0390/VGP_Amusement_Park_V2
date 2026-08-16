const pool = require("../config/database");

/**
 * Insert a new group quote request
 */
async function createGroupQuote(data) {
  const { organisationName, groupSize, preferredDate, contactNumber, email } = data;

  const [result] = await pool.execute(
    `INSERT INTO group_quotes
      (organisation_name, group_size, preferred_date, contact_number, email)
     VALUES (?, ?, ?, ?, ?)`,
    [organisationName, groupSize, preferredDate, contactNumber, email || null]
  );

  return result.insertId;
}

module.exports = {
  createGroupQuote,
};
