import { API_BASE_URL } from "@/constants/api";

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

class AdminEventService {
  async getEvents() {
    const response = await fetch(`${API_BASE_URL}/admin/events`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
      cache: 'no-store'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch events');
    return data.data;
  }

  async getEventById(id) {
    const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
      cache: 'no-store'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch event');
    return data.data;
  }

  async createEvent(eventData) {
    const response = await fetch(`${API_BASE_URL}/admin/events`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(eventData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create event');
    return data;
  }

  async updateEvent(id, eventData) {
    const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(eventData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update event');
    return data;
  }

  async updateEventStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/admin/events/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update event status');
    return data;
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const headers = { ...getHeaders() };
    delete headers['Content-Type']; // Let browser set multipart boundary

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to upload image');
    }
    // Return the response object to be compatible with EventForm.js expectation:
    // result.success and result.url
    return data;
  }
}

export const adminEventService = new AdminEventService();
