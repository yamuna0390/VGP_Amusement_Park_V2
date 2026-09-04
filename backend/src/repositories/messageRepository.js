const pool = require("../config/database");

/**
 * Get all messages (Group Quotes & Operator Enquiries)
 * Sorted by newest first.
 */
async function getAllMessages() {
  const [groupQuotes] = await pool.execute(
    `SELECT 
      id, 
      organisation_name as name, 
      email, 
      contact_number as mobile, 
      group_size as groupSize, 
      preferred_date as preferredDate,
      created_at as receivedDate
    FROM group_quotes 
    ORDER BY created_at DESC`
  );

  const [operatorEnquiries] = await pool.execute(
    `SELECT 
      id, 
      operator_name as name, 
      email, 
      phone as mobile, 
      message,
      created_at as receivedDate
    FROM operator_enquiries 
    ORDER BY created_at DESC`
  );

  // Normalize and combine
  const normalizedGroupQuotes = groupQuotes.map((gq) => ({
    id: `GQ-${gq.id}`, // Prefix ID to ensure uniqueness across frontend
    type: "Group Quote",
    name: gq.name,
    email: gq.email,
    mobile: gq.mobile,
    subject: "Group Quote Request",
    receivedDate: gq.receivedDate,
    groupSize: gq.groupSize,
    preferredDate: gq.preferredDate,
    status: "New" // Default status
  }));

  const normalizedOperatorEnquiries = operatorEnquiries.map((oe) => ({
    id: `OE-${oe.id}`,
    type: "Operator Enquiry",
    name: oe.name,
    email: oe.email,
    mobile: oe.mobile,
    subject: "Operator Enquiry",
    receivedDate: oe.receivedDate,
    message: oe.message,
    status: "New"
  }));

  const allMessages = [...normalizedGroupQuotes, ...normalizedOperatorEnquiries];

  // Sort combined array descending by receivedDate
  allMessages.sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate));

  return allMessages;
}

module.exports = {
  getAllMessages,
};
