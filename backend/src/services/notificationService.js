const notificationRepository = require("../repositories/notificationRepository");

/**
 * Creates a new admin notification
 */
async function createNotification(data) {
  const { type, title, message, referenceId } = data;

  if (!type || !title || !message) {
    throw { statusCode: 400, message: "Type, title, and message are required for notification." };
  }

  const id = await notificationRepository.createNotification({
    type,
    title,
    message,
    referenceId,
  });

  return { id };
}

/**
 * Gets the latest admin notifications
 */
async function getNotifications() {
  const rows = await notificationRepository.getNotifications(50);
  
  // Format the data to match expected JSON structure (camelCase)
  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    referenceId: row.reference_id,
    isRead: row.is_read === 1,
    createdAt: row.created_at,
  }));
}

/**
 * Gets the count of unread notifications
 */
async function getUnreadCount() {
  const count = await notificationRepository.getUnreadCount();
  return { count };
}

/**
 * Marks a notification as read
 */
async function markAsRead(id) {
  if (!id) {
    throw { statusCode: 400, message: "Notification ID is required." };
  }

  const success = await notificationRepository.markAsRead(id);
  if (!success) {
    throw { statusCode: 404, message: "Notification not found." };
  }

  return { success: true };
}

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
};
