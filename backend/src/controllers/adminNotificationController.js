const notificationService = require("../services/notificationService");
const { success } = require("../utils/response");

/**
 * GET /api/admin/notifications
 * Get all notifications for admin panel
 */
async function getNotifications(req, res, next) {
  try {
    const notifications = await notificationService.getNotifications();
    return success(res, "Notifications retrieved successfully.", notifications, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/notifications/unread-count
 * Get count of unread notifications
 */
async function getUnreadCount(req, res, next) {
  try {
    const data = await notificationService.getUnreadCount();
    return success(res, "Unread count retrieved successfully.", data, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/notifications/:id/read
 * Mark a specific notification as read
 */
async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const result = await notificationService.markAsRead(id);
    return success(res, "Notification marked as read.", result, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
};
