import { API_BASE_URL } from "@/constants/api";

/**
 * Fetch all public offers
 * GET /api/offers/public/all
 */
export async function fetchOffers() {
  try {
    const response = await fetch(`${API_BASE_URL}/offers/public/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to load offers.");
    }

    return result.data;
  } catch (error) {
    console.error("Offer API Error:", error);
    throw error;
  }
}

/**
 * Fetch nearest valid date for a specific offer
 * GET /api/offers/public/:id/nearest-date
 */
export async function fetchNearestOfferDate(offerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/offers/public/${offerId}/nearest-date`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to calculate nearest date for offer.");
    }

    return result.nearestDate;
  } catch (error) {
    console.error("Nearest Offer Date API Error:", error);
    throw error;
  }
}
