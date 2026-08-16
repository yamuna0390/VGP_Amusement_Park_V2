const pool = require("../config/database");

/**
 * Insert a new admin notification
 */
async function createNotification(data) {
  const { type, title, message, referenceId } = data;

  const [result] = await pool.execute(
    `INSERT INTO admin_notifications (type, title, message, reference_id, is_read)
     VALUES (?, ?, ?, ?, 0)`,
    [type, title, message, referenceId || null]
  );

  return result.insertId;
}

/**
 * Get notifications (latest first)
 */
async function getNotifications(limit = 20) {
  const [rows] = await pool.execute(
    `SELECT * FROM admin_notifications ORDER BY created_at DESC LIMIT ?`,
    [String(limit)]
  );
  return rows;
}

/**
 * Get count of unread notifications
 */
async function getUnreadCount() {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) as count FROM admin_notifications WHERE is_read = 0`
  );
  return rows[0].count;
}

/**
 * Mark a notification as read
 */
async function markAsRead(id) {
  const [result] = await pool.execute(
    `UPDATE admin_notifications SET is_read = 1 WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
};
