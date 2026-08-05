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
 * Validate a coupon code against the backend
 * POST /booking/validate-coupon
 *
 * @param {Object} params - { visitDate, couponCode }
 */
export async function validateCoupon({ visitDate, couponCode } = {}) {
  const response = await fetch(`${API_BASE_URL}/booking/validate-coupon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitDate,
      couponCode,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Invalid or expired coupon.");
  }

  return result.appliedCoupon || result.data?.appliedCoupon || result.data || result;
}

/**
 * Retrieve final booking review from backend (includes couponCode for server-side discount calculation)
 * POST /booking/finalreview
 *
 * @param {Object} payload - Checkout payload containing couponCode, visitDate, regularTickets, foods, etc.
 */
export async function getBookingFinalReview(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/finalreview`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to fetch booking final review.");
    }

    return result.data || result;
  } catch (error) {
    console.error("Booking Final Review API Error:", error);
    throw error;
  }
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
 * Load booking initialization master data (meals, park settings)
 * GET /booking/init
 */
export async function getBookingInit() {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/init`);

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load booking initialization data.");
    }

    return result;
  } catch (error) {
    console.error("Booking Init API Error:", error);
    throw error;
  }
}

/**
 * Validate visit date and retrieve regularTickets and offerTickets for that date
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

    return result;
  } catch (error) {
    console.error("Validate Visit Date API Error:", error);
    throw error;
  }
}