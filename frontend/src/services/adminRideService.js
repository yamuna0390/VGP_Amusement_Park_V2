const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== "undefined") {
    // Other admin services use adminToken
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

class AdminRideService {
  async getRides() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/rides`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("Backend Error:", data);
        throw new Error(data.message || 'Failed to fetch rides');
      }
      return data.data;
    } catch (error) {
      console.error('Error fetching admin rides:', error);
      throw error;
    }
  }

  async getRideById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/rides/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("Backend Error:", data);
        throw new Error(data.message || 'Failed to fetch ride details');
      }
      return data.data;
    } catch (error) {
      console.error('Error fetching admin ride:', error);
      throw error;
    }
  }

  async createRide(rideData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/rides`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(rideData),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("Backend Error:", data);
        throw new Error(data.message || 'Failed to create ride');
      }
      return data.data;
    } catch (error) {
      console.error('Error creating ride:', error);
      throw error;
    }
  }

  async updateRide(id, rideData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/rides/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(rideData),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("Backend Error:", data);
        throw new Error(data.message || 'Failed to update ride');
      }
      return data.data;
    } catch (error) {
      console.error('Error updating ride:', error);
      throw error;
    }
  }

  async updateRideStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/rides/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("Backend Error:", data);
        throw new Error(data.message || 'Failed to update ride status');
      }
      return data.data;
    } catch (error) {
      console.error('Error updating ride status:', error);
      throw error;
    }
  }
}

export const adminRideService = new AdminRideService();
