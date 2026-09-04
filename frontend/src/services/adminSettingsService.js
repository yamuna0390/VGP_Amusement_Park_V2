const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const adminSettingsService = {
  getSettings: async (keys = "") => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings?keys=${keys}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to fetch settings");
      }
      return data.data;
    } catch (error) {
      console.error("Error in getSettings:", error);
      throw error;
    }
  },

  updateSetting: async (key, value) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ key, value })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to update setting");
      }
      return data;
    } catch (error) {
      console.error("Error in updateSetting:", error);
      throw error;
    }
  }
};
