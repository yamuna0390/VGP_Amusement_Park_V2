import { API_BASE_URL } from "@/constants/api";

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const adminAddonService = {
  async getAddons(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/admin/food-items?${queryString}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to fetch food & add-ons");
      }
      return data;
    } catch (error) {
      console.error('Error fetching food & add-ons:', error);
      throw error;
    }
  },

  async getAddonById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/food-items/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to fetch addon details");
      }
      return data.data;
    } catch (error) {
      console.error(`Error fetching addon details for ID ${id}:`, error);
      throw error;
    }
  },

  async createAddon(addonData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/food-items`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(addonData),
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to create food/add-on");
      }
      return data;
    } catch (error) {
      console.error('Error creating food/add-on:', error);
      throw error;
    }
  },

  async updateAddon(id, addonData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/food-items/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(addonData),
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to update food/add-on");
      }
      return data;
    } catch (error) {
      console.error(`Error updating food/add-on ${id}:`, error);
      throw error;
    }
  },

  async updateAddonStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/food-items/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to update food/add-on status");
      }
      return data;
    } catch (error) {
      console.error(`Error updating food/add-on status ${id}:`, error);
      throw error;
    }
  }
};
