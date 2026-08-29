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
async function createSession(
  { sessionTokenHash, userId, expiresAt },
  connection = db
) {
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
    )
    VALUES (
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
    LIMIT 1
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
    SELECT COUNT(*) AS count
    FROM booking_session_items
    WHERE session_id = ?
    `,
    [sessionId]
  );

  return Number(rows[0].count);
}

/**
 * Update allowed booking session fields.
 *
 * API 2 currently uses:
 *   visit_date
 *
 * Later booking APIs may use:
 *   booking_type
 *   offer_id
 *   current_step
 *   last_activity_at
 *
 * @param {number} sessionId
 * @param {Object} updates
 * @param {PoolConnection|Pool} connection
 */
async function updateSession(sessionId, updates, connection = db) {
  const allowedFields = [
    "user_id",
    "visit_date",
    "booking_type",
    "offer_id",
    "current_step",
    "status",
    "last_activity_at"
  ];

  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (!allowedFields.includes(key)) {
      throw new Error(`Invalid booking session field: ${key}`);
    }

    fields.push(`${key} = ?`);
    values.push(value);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(sessionId);

  await connection.execute(
    `
    UPDATE booking_sessions
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
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
      id,
      session_id,
      item_type,
      pricing_type,
      ticket_type_id,
      addon_id,
      offer_id,
      offer_ticket_id,
      item_code,
      item_name,
      quantity,
      paid_quantity,
      free_quantity,
      unit_price_snapshot
    FROM booking_session_items
    WHERE session_id = ?
    ORDER BY id ASC
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
    `
    DELETE FROM booking_session_item_components
    WHERE session_item_id IN (
      SELECT id
      FROM booking_session_items
      WHERE session_id = ?
    )
    `,
    [sessionId]
  );

  await connection.execute(
    `
    DELETE FROM booking_session_items
    WHERE session_id = ?
    `,
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
  const [result] = await connection.execute(
    `
    INSERT INTO booking_session_items (
      session_id,
      item_type,
      pricing_type,
      ticket_type_id,
      addon_id,
      offer_id,
      offer_ticket_id,
      item_code,
      item_name,
      quantity,
      paid_quantity,
      free_quantity,
      unit_price_snapshot
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      item.sessionId,
      item.itemType,
      item.pricingType,
      item.ticketTypeId || null,
      item.addonId || null,
      item.offerId || null,
      item.offerTicketId || null,
      item.itemCode,
      item.itemName,
      item.quantity,
      item.paidQuantity,
      item.freeQuantity,
      item.unitPriceSnapshot
    ]
  );

  return result.insertId;
}
async function insertSessionItemComponent(component, connection = db) {
  await connection.execute(
    `
    INSERT INTO booking_session_item_components (
      session_item_id,
      component_type,
      ticket_type_id,
      quantity,
      unit_price_snapshot
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      component.sessionItemId,
      component.componentType,
      component.ticketTypeId,
      component.quantity,
      component.unitPriceSnapshot
    ]
  );
}
async function getSessionItemComponents(sessionItemIds = [], connection = db) {
  if (!sessionItemIds.length) {
    return [];
  }

  const placeholders = sessionItemIds.map(() => "?").join(",");

  const [rows] = await connection.execute(
    `
    SELECT
      id,
      session_item_id,
      component_type,
      ticket_type_id,
      quantity,
      unit_price_snapshot
    FROM booking_session_item_components
    WHERE session_item_id IN (${placeholders})
    ORDER BY id ASC
    `,
    sessionItemIds
  );

  return rows;
}
module.exports = {
  createSession,
  getSessionByHash,
  getSessionItemsCount,
  updateSession,
  getSessionItems,
  deleteSessionItems,
  insertSessionItem,
  insertSessionItemComponent,
  getSessionItemComponents
};