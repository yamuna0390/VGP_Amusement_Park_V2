const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const adminBookingService = {
  async getBookings(params) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/admin/bookings?${queryString}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to fetch admin bookings");
      }
      return data;
    } catch (error) {
      console.error('Error fetching admin bookings:', error);
      throw error;
    }
  },

  async getBookingDetails(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to fetch booking details");
      }
      return data;
    } catch (error) {
      console.error(`Error fetching booking details for ID ${id}:`, error);
      throw error;
    }
  },

  getTicketPdfUrl(id) {
    return `${API_BASE_URL}/admin/bookings/${id}/ticket-pdf`;
  },

  async downloadTicketPdf(id, bookingNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}/ticket-pdf`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Ticket_${bookingNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket PDF:', error);
      throw error;
    }
  }
};
