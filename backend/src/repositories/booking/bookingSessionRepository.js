const db = require("../../config/database");

/**
 * Create a new booking session.
 * 
 * @param {Object} data
 * @param {string} data.sessionTokenHash
 * @param {number|null} data.userId
 * @param {string} data.expiresAt
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<number>} The inserted ID
 */
async function createSession({ sessionTokenHash, userId, expiresAt }, connection = db) {
  const [result] = await connection.execute(
    `
    INSERT INTO booking_sessions (
      session_token_hash,
      user_id,
      visit_date,
      booking_type,
      offer_id,
      current_step,
      status,
      expires_at,
      last_activity_at
    ) VALUES (
      ?, ?, NULL, 'REGULAR', NULL, 1, 'ACTIVE', ?, NOW()
    )
    `,
    [sessionTokenHash, userId, expiresAt]
  );
  
  return result.insertId;
}

/**
 * Get a booking session by its token hash.
 * 
 * @param {string} sessionTokenHash
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Object|null>}
 */
async function getSessionByHash(sessionTokenHash, connection = db) {
  const [rows] = await connection.execute(
    `
    SELECT
      id,
      session_token_hash,
      user_id,
      visit_date,
      booking_type,
      offer_id,
      current_step,
      status,
      expires_at,
      last_activity_at
    FROM booking_sessions
    WHERE session_token_hash = ?
    `,
    [sessionTokenHash]
  );
  return rows.length ? rows[0] : null;
}

/**
 * Get the count of items in a booking session.
 * 
 * @param {number} sessionId
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<number>}
 */
async function getSessionItemsCount(sessionId, connection = db) {
  const [rows] = await connection.execute(
    `
    SELECT COUNT(*) as count
    FROM booking_session_items
    WHERE session_id = ?
    `,
    [sessionId]
  );
  return rows[0].count;
}

/**
 * Update a booking session.
 * 
 * @param {number} sessionId
 * @param {Object} updates
 * @param {PoolConnection|Pool} connection
 */
async function updateSession(sessionId, updates, connection = db) {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  if (fields.length === 0) return;

  values.push(sessionId);

  await connection.execute(
    `UPDATE booking_sessions SET ${fields.join(", ")} WHERE id = ?`,
    values
  );
}

/**
 * Get all items for a session.
 * 
 * @param {number} sessionId
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Array>}
 */
async function getSessionItems(sessionId, connection = db) {
  const [rows] = await connection.execute(
    `
    SELECT
      id, session_id, item_type, ticket_type_id, addon_id, item_code, item_name, quantity, paid_quantity, free_quantity, unit_price_snapshot
    FROM booking_session_items
    WHERE session_id = ?
    `,
    [sessionId]
  );
  return rows;
}

/**
 * Delete all items for a session.
 * 
 * @param {number} sessionId
 * @param {PoolConnection|Pool} connection
 */
async function deleteSessionItems(sessionId, connection = db) {
  await connection.execute(
    `DELETE FROM booking_session_items WHERE session_id = ?`,
    [sessionId]
  );
}

/**
 * Insert a session item.
 * 
 * @param {Object} item
 * @param {PoolConnection|Pool} connection
 */
async function insertSessionItem(item, connection = db) {
  await connection.execute(
    `
    INSERT INTO booking_session_items (
      session_id, item_type, ticket_type_id, addon_id, item_code, item_name, quantity, paid_quantity, free_quantity, unit_price_snapshot
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      item.sessionId,
      item.itemType,
      item.ticketTypeId || null,
      item.addonId || null,
      item.itemCode,
      item.itemName,
      item.quantity,
      item.paidQuantity,
      item.freeQuantity,
      item.unitPriceSnapshot
    ]
  );
}

module.exports = {
  createSession,
  getSessionByHash,
  getSessionItemsCount,
  updateSession,
  getSessionItems,
  deleteSessionItems,
  insertSessionItem
};
