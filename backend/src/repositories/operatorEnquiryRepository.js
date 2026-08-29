const pool = require("../config/database");

/**
 * Insert a new operator enquiry
 */
async function createOperatorEnquiry(data) {
  const { operatorName, email, phone, message } = data;

  const [result] = await pool.execute(
    `INSERT INTO operator_enquiries
      (operator_name, email, phone, message)
     VALUES (?, ?, ?, ?)`,
    [operatorName, email, phone, message]
  );

  return result.insertId;
}

module.exports = {
  createOperatorEnquiry,
};
