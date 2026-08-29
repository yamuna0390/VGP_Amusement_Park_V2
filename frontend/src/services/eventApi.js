import { API_BASE_URL } from "@/constants/api";

export const getPublicEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch events");
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching public events:", error);
    throw error;
  }
};
