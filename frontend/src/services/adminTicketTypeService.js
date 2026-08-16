const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const adminTicketTypeService = {
  async getTickets(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/admin/ticket-types?${queryString}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to fetch ticket types");
      }
      return data;
    } catch (error) {
      console.error('Error fetching ticket types:', error);
      throw error;
    }
  },

  async getTicketById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ticket-types/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to fetch ticket details");
      }
      return data.data;
    } catch (error) {
      console.error(`Error fetching ticket details for ID ${id}:`, error);
      throw error;
    }
  },

  async createTicket(ticketData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ticket-types`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(ticketData),
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to create ticket");
      }
      return data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async updateTicket(id, ticketData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ticket-types/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(ticketData),
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to update ticket");
      }
      return data;
    } catch (error) {
      console.error(`Error updating ticket ${id}:`, error);
      throw error;
    }
  },

  async updateTicketStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ticket-types/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to update ticket status");
      }
      return data;
    } catch (error) {
      console.error(`Error updating ticket status ${id}:`, error);
      throw error;
    }
  }
};
