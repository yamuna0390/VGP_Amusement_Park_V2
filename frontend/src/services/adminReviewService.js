import { API_BASE_URL } from "@/constants/api";

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const adminReviewService = {
  async getReviews() {
    const res = await fetch(`${API_BASE_URL}/admin/reviews`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch reviews");
    const data = await res.json();
    return data.data || [];
  },

  async getReviewById(id) {
    const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch review");
    const data = await res.json();
    return data.data;
  },

  async createReview(reviewData) {
    const res = await fetch(`${API_BASE_URL}/admin/reviews`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create review");
    }
    return res.json();
  },

  async updateReview(id, reviewData) {
    const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update review");
    }
    return res.json();
  },

  async updateReviewStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  },

  async deleteReview(id) {
    const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete review");
    return res.json();
  },
};
