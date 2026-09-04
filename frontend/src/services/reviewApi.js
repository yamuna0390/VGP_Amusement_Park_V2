import { API_BASE_URL } from "@/constants/api";

export const fetchReviews = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (data && data.success && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
};
