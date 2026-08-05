/**
 * Pure utility functions for calculating booking summaries, totals, and preparing payloads.
 * No React, Context, API calls, or UI dependencies.
 */

/**
 * Returns selected regular tickets with quantity > 0.
 * @param {Object} ticketQty - Map of ticketId -> quantity
 * @param {Array} regularTickets - Array of regular ticket objects
 * @returns {Array<{ticketId: string|number, quantity: number}>}
 */
export function getSelectedRegularTickets(ticketQty = {}, regularTickets = []) {
  const selected = [];
  if (!ticketQty || !Array.isArray(regularTickets)) return selected;

  regularTickets.forEach((ticket) => {
    const ticketId = ticket.ticketId !== undefined ? ticket.ticketId : ticket.id;
    const qty = Number(ticketQty[ticketId] || ticketQty[String(ticketId)] || 0);
    if (qty > 0) {
      selected.push({
        ticketId,
        quantity: qty,
      });
    }
  });

  return selected;
}

/**
 * Returns selected offer tickets with quantity > 0.
 * @param {Object} offerQty - Map of offerTicketId -> quantity
 * @param {Array} offerTickets - Array of offer ticket objects
 * @returns {Array<{offerTicketId: string|number, quantity: number}>}
 */
export function getSelectedOfferTickets(offerQty = {}, offerTickets = []) {
  const selected = [];
  if (!offerQty || !Array.isArray(offerTickets)) return selected;

  offerTickets.forEach((offer) => {
    const offerTicketId = offer.offerTicketId !== undefined ? offer.offerTicketId : offer.id;
    const qty = Number(offerQty[offerTicketId] || offerQty[String(offerTicketId)] || 0);
    if (qty > 0) {
      selected.push({
        offerTicketId,
        quantity: qty,
      });
    }
  });

  return selected;
}

/**
 * Returns selected food items with quantity > 0.
 * @param {Object} foodQty - Map of foodId -> quantity
 * @param {Array} foods - Array of food objects
 * @returns {Array<{foodId: string|number, quantity: number}>}
 */
export function getSelectedFoods(foodQty = {}, foods = []) {
  const selected = [];
  if (!foodQty || !Array.isArray(foods)) return selected;

  foods.forEach((food) => {
    const foodId = food.foodId !== undefined ? food.foodId : food.id;
    const qty = Number(foodQty[foodId] || foodQty[String(foodId)] || 0);
    if (qty > 0) {
      selected.push({
        foodId,
        quantity: qty,
      });
    }
  });

  return selected;
}

/**
 * Calculates total amount from selected regular and offer tickets.
 * @param {Object} ticketQty
 * @param {Array} regularTickets
 * @param {Object} offerQty
 * @param {Array} offerTickets
 * @returns {number}
 */
export function getTicketTotal(
  ticketQty = {},
  regularTickets = [],
  offerQty = {},
  offerTickets = []
) {
  let total = 0;

  if (Array.isArray(regularTickets)) {
    regularTickets.forEach((ticket) => {
      const id = ticket.code || ticket.ticketId || ticket.id;
      const qty = Number(ticketQty[id] || ticketQty[String(id)] || 0);
      const price = Number(ticket.price || 0);
      if (qty > 0) {
        total += qty * price;
      }
    });
  }

  if (Array.isArray(offerTickets)) {
    offerTickets.forEach((offer) => {
      const id = offer.offerTicketId !== undefined ? offer.offerTicketId : offer.id;
      const qty = Number(offerQty[id] || offerQty[String(id)] || 0);
      const unitPrice = Number(offer.unitPrice || 0);
      if (qty > 0) {
        total += qty * unitPrice;
      }
    });
  }

  return total;
}

/**
 * Calculates total amount from selected foods.
 * @param {Object} foodQty
 * @param {Array} foods
 * @returns {number}
 */
export function getFoodTotal(foodQty = {}, foods = []) {
  let total = 0;

  if (Array.isArray(foods)) {
    foods.forEach((food) => {
      const id = food.foodId !== undefined ? food.foodId : food.id;
      const qty = Number(foodQty[id] || foodQty[String(id)] || 0);
      const price = Number(food.price || food.unitPrice || 0);
      if (qty > 0) {
        total += qty * price;
      }
    });
  }

  return total;
}

/**
 * Calculates grand total by summing ticketTotal and foodTotal.
 *
 * @param {Object} ticketQty
 * @param {Array} regularTickets
 * @param {Object} offerQty
 * @param {Array} offerTickets
 * @param {Object} foodQty
 * @param {Array} foods
 * @returns {number}
 */
export function getGrandTotal(
  ticketQty = {},
  regularTickets = [],
  offerQty = {},
  offerTickets = [],
  foodQty = {},
  foods = []
) {
  const ticketTotal = getTicketTotal(
    ticketQty,
    regularTickets,
    offerQty,
    offerTickets
  );

  const foodTotal = getFoodTotal(foodQty, foods);

  return ticketTotal + foodTotal;
}

/**
 * Prepares the payload object for the Checkout API without calculating totals or making API calls.
 *
 * @param {Object} params
 * @returns {Object}
 */
export function buildCheckoutPayload({
  visitDate,
  ticketQty = {},
  regularTickets = [],
  offerQty = {},
  offerTickets = [],
  foodQty = {},
  foods = [],
  couponCode = "",
  customer = {},
} = {}) {
  return {
    visitDate,
    regularTickets: getSelectedRegularTickets(ticketQty, regularTickets),
    offerTickets: getSelectedOfferTickets(offerQty, offerTickets),
    foods: getSelectedFoods(foodQty, foods),
    couponCode,
    customer,
  };
}

/**
 * Temporary UI calculation for coupon discount based on Subtotal and coupon rules.
 * Where Subtotal = Regular Ticket Total + Offer Ticket Total + Food Total (ticketTotal + foodTotal).
 * THIS IS ONLY FOR UI DISPLAY and will later be replaced by server-side POST /booking/finalreview.
 *
 * @param {number} ticketTotal - Regular Ticket Total + Offer Ticket Total
 * @param {number} foodTotal - Food Total
 * @param {Object|null} appliedCoupon - Coupon object { discountType, discountValue }
 * @returns {{ discountAmount: number, adjustedGrandTotal: number }}
 */
export function calculateTemporaryCouponUiDiscount(ticketTotal = 0, foodTotal = 0, appliedCoupon = null) {
  const subtotal = Number(ticketTotal || 0) + Number(foodTotal || 0);
  if (!appliedCoupon || subtotal <= 0) {
    return { discountAmount: 0, adjustedGrandTotal: subtotal };
  }

  const discountType = String(appliedCoupon.discountType || "").toUpperCase().trim();
  const discountValue = Number(appliedCoupon.discountValue || 0);
  let discountAmount = 0;

  if (discountType === "PERCENTAGE" || discountType === "PERCENT") {
    discountAmount = (subtotal * discountValue) / 100;
  } else if (discountType === "FLAT" || discountType === "FIXED") {
    discountAmount = discountValue;
  }

  // Limit the discount so it never exceeds the current subtotal
  discountAmount = Math.max(0, Math.min(discountAmount, subtotal));
  discountAmount = parseFloat(discountAmount.toFixed(2));

  const adjustedGrandTotal = parseFloat((subtotal - discountAmount).toFixed(2));

  return {
    discountAmount,
    adjustedGrandTotal,
  };
}

export default {
  getSelectedRegularTickets,
  getSelectedOfferTickets,
  getSelectedFoods,
  getTicketTotal,
  getFoodTotal,
  getGrandTotal,
  buildCheckoutPayload,
  calculateTemporaryCouponUiDiscount,
};

