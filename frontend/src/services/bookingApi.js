import { API_BASE_URL } from "@/constants/api";

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
/**
 * Get all active ticket types
 */
export async function getTickets() {
  const response = await fetch(`${API_BASE_URL}/tickets`);

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unable to load tickets.");
  }

  return result.data;
}
/**
 * Create a new booking
 */
export async function createBooking(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
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
  const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
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
  const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ bookingId }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Payment confirmation failed.");
  }

  return result;
}

/**
 * Load booking initialization master data (tickets, meals, park settings)
 * GET /booking/init
 */
export async function getBookingInit() {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/init`);

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load booking initialization data.");
    }

    return result.data;
  } catch (error) {
    console.error("Booking Init API Error:", error);
    throw error;
  }
}

/**
 * Validate visit date and retrieve valid offers for that date
 * POST /bookings/validate-date
 *
 * @param {string} visitDate - Date string in YYYY-MM-DD format
 */
export async function validateVisitDate(visitDate) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/validate-date`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitDate }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to validate visit date.");
    }

    return result.data;
  } catch (error) {
    console.error("Validate Visit Date API Error:", error);
    throw error;
  }
}