const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const adminOfferService = {
  getOffers: async () => {
    const res = await fetch(`${API_URL}/admin/offers`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
      cache: 'no-store'
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error("Backend Error:", data);
      throw new Error(data.message || "Failed to fetch offers");
    }
    return data.data;
  },

  getOfferById: async (id) => {
    const res = await fetch(`${API_URL}/admin/offers/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
      cache: 'no-store'
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error("Backend Error:", data);
      throw new Error(data.message || "Failed to fetch offer");
    }
    return data.data;
  },

  createOffer: async (payload) => {
    const res = await fetch(`${API_URL}/admin/offers`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error("Backend Error:", data);
      throw new Error(data.message || "Failed to create offer");
    }
    return data.data;
  },

  updateOffer: async (id, payload) => {
    const res = await fetch(`${API_URL}/admin/offers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error("Backend Error:", data);
      throw new Error(data.message || "Failed to update offer");
    }
    return data.data;
  },

  updateOfferStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/admin/offers/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error("Backend Error:", data);
      throw new Error(data.message || "Failed to update offer status");
    }
    return data.data;
  }
};
