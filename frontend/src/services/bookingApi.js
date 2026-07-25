const API_BASE_URL = "http://localhost:5000";

export async function createBooking(payload) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Booking failed.");
    }

    // Return only the booking data
    return result.data;

  } catch (error) {
    console.error("Booking API Error:", error);
    throw error;
  }
}