const db = require("../../config/database");

const getActiveOffer = async (visitDate) => {
  const [rows] = await db.query(
    `SELECT *
     FROM offers
     WHERE status = 'Active'
       AND ? BETWEEN valid_from AND valid_to
     ORDER BY priority DESC
     LIMIT 1`,
    [visitDate]
  );
  return rows[0] || null;
};

const getOfferByCode = async (code, visitDate) => {
  const query = visitDate 
    ? `SELECT * FROM offers WHERE offer_code = ? AND status = 'Active' AND ? BETWEEN valid_from AND valid_to LIMIT 1`
    : `SELECT * FROM offers WHERE offer_code = ? LIMIT 1`;
  const params = visitDate ? [code, visitDate] : [code];
  const [rows] = await db.query(query, params);
  return rows[0] || null;
};

const getAllOffers = async () => {
  const [rows] = await db.query("SELECT * FROM offers ORDER BY priority DESC, id DESC");
  return rows;
};

const createOffer = async (offerData) => {
  const [result] = await db.query(
    `INSERT INTO offers 
      (offer_name, offer_code, discount_type, discount_value, minimum_amount, valid_from, valid_to, status, offer_rule, applicable_tickets, min_qty, free_qty, priority)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      offerData.offer_name,
      offerData.offer_code,
      offerData.discount_type,
      offerData.discount_value,
      offerData.minimum_amount || 0,
      offerData.valid_from,
      offerData.valid_to,
      offerData.status || 'Active',
      offerData.offer_rule || 'PERCENTAGE',
      offerData.applicable_tickets || null,
      offerData.min_qty || 1,
      offerData.free_qty || 1,
      offerData.priority || 1,
    ]
  );
  return result.insertId;
};

const updateOffer = async (id, offerData) => {
  await db.query(
    `UPDATE offers 
     SET offer_name = ?, offer_code = ?, discount_type = ?, discount_value = ?, minimum_amount = ?, valid_from = ?, valid_to = ?, status = ?, offer_rule = ?, applicable_tickets = ?, min_qty = ?, free_qty = ?, priority = ?
     WHERE id = ?`,
    [
      offerData.offer_name,
      offerData.offer_code,
      offerData.discount_type,
      offerData.discount_value,
      offerData.minimum_amount || 0,
      offerData.valid_from,
      offerData.valid_to,
      offerData.status,
      offerData.offer_rule,
      offerData.applicable_tickets,
      offerData.min_qty,
      offerData.free_qty,
      offerData.priority,
      id
    ]
  );
};

const deleteOffer = async (id) => {
  await db.query("DELETE FROM offers WHERE id = ?", [id]);
};

module.exports = {
  getActiveOffer,
  getOfferByCode,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};