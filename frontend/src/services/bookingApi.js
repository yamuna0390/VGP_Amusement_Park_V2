const API_BASE_URL = "http://localhost:5000";

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Create a new booking
 */
export async function createBooking(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Booking failed.");
    }

    return result.data;
  } catch (error) {
    console.error("Booking API Error:", error);
    throw error;
  }
}

/**
 * Validate a coupon code against the backend DB
 * @param {string} couponCode
 * @param {number} subtotal  — ticket subtotal for minimum-order check
 * @returns {Promise<{ code, name, discountType, discountValue, description, discount }>}
 */
export async function validateCoupon(couponCode, subtotal) {
  const response = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ couponCode, subtotal }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Invalid coupon code.");
  }

  return result.data;
}

/**
 * Confirm payment for a booking (simulated)
 * @param {number} bookingId
 */
export async function confirmPayment(bookingId) {
  const response = await fetch(`${API_BASE_URL}/api/payments/confirm`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ bookingId }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Payment confirmation failed.");
  }

  return result.data;
}