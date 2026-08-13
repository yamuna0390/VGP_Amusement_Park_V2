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
 * Create a booking session (API #1)
 * POST /booking/session
 */
export async function createBookingSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/session`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to create booking session.");
    }

    return result;
  } catch (error) {
    console.error("Booking Session API Error:", error);
    throw error;
  }
}

/**
 * Update a booking session (API #2)
 * PATCH /booking/session
 */
export async function updateBookingSession(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/session`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to update booking session.");
    }

    return result;
  } catch (error) {
    console.error("Update Booking Session API Error:", error);
    throw error;
  }
}

/**
 * Update booking session items (API #3)
 * PUT /booking/session/items
 */
export async function updateBookingItems(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/session/items`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to update booking items.");
    }

    return result;
  } catch (error) {
    console.error("Update Booking Items API Error:", error);
    throw error;
  }
}

/**
 * Update customer information for the booking session (API #4)
 * PUT /booking/session/customer
 */
export async function updateCustomerInfo(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/session/customer`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to update customer information.");
    }

    return result;
  } catch (error) {
    console.error("Update Customer Info API Error:", error);
    throw error;
  }
}

/**
 * Generate final quote for the booking session (API #5)
 * POST /booking/session/quote
 */
export async function generateBookingQuote() {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/session/quote`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to generate booking quote.");
    }

    return result;
  } catch (error) {
    console.error("Generate Booking Quote API Error:", error);
    throw error;
  }
}

/**
 * Create Payment Order for the booking session
 * POST /booking/payment/order
 */
export async function createPaymentOrder() {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/payment/order`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to create payment order.");
    }

    return result;
  } catch (error) {
    console.error("Create Payment Order API Error:", error);
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

/**
 * Verify Razorpay payment signature
 * POST /booking/payment/verify
 * 
 * @param {Object} payload - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export async function verifyPayment(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/payment/verify`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Payment verification failed.");
    }

    return result;
  } catch (error) {
    console.error("Payment Verification API Error:", error);
    throw error;
  }
}