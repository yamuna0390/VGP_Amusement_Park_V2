import { API_BASE_URL } from "@/constants/api";

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const adminNotificationService = {
  async getNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to fetch notifications");
      }
      return data.data;
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      throw error;
    }
  },

  async getUnreadCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/notifications/unread-count`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to fetch unread count");
      }
      return data.data.count;
    } catch (error) {
      // Gracefully handle browser-level network interceptions (e.g. adblockers blocking "unread-count")
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return null;
      }
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  async markAsRead(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to mark as read");
      }
      return data.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
};
