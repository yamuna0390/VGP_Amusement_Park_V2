// ─── Booking Price Calculator ──────────────────────────────────────────────
import { TICKETS, GST, CONVENIENCE_FEE } from "@/data/tickets";
import { MEALS } from "@/data/meals";
import { COUPONS } from "@/data/bookingOffers";

/**
 * Get effective price for a ticket
 * @param {object} ticket
 * @returns {number}
 */
export function effectivePrice(ticket) {
  return ticket.discountPrice !== null ? ticket.discountPrice : ticket.originalPrice;
}

/**
 * Calculate ticket subtotal (before tax)
 * @param {object} ticketQty  { ticketId: quantity }
 * @returns {number}
 */
export function calcTicketSubtotal(ticketQty) {
  return TICKETS.reduce((sum, t) => {
    const qty = ticketQty[t.id] || 0;
    return sum + effectivePrice(t) * qty;
  }, 0);
}

/**
 * Calculate food subtotal (before tax)
 * @param {object} mealQty  { mealId: quantity }
 * @returns {number}
 */
export function calcFoodSubtotal(mealQty) {
  return MEALS.reduce((sum, m) => {
    const qty = mealQty[m.id] || 0;
    return sum + m.price * qty;
  }, 0);
}

/**
 * Calculate offer discount amount applied to ticket subtotal
 * @param {object|null} offer
 * @param {number} ticketSubtotal
 * @param {object} ticketQty
 * @returns {number}
 */
export function calcOfferDiscount(offer, ticketSubtotal, ticketQty) {
  if (!offer) return 0;
  if (offer.discountType === "percent") {
    return parseFloat(((offer.discountValue / 100) * ticketSubtotal).toFixed(2));
  }
  if (offer.discountType === "flat") {
    return Math.min(offer.discountValue, ticketSubtotal);
  }
  if (offer.discountType === "bogo") {
    // Buy 1 get 1 on adult ticket
    const adultTicket = TICKETS.find((t) => t.id === offer.applicableTo);
    if (adultTicket) {
      const qty = ticketQty[adultTicket.id] || 0;
      const free = Math.floor(qty / 2);
      return parseFloat((free * effectivePrice(adultTicket)).toFixed(2));
    }
  }
  return 0;
}

/**
 * Validate and calculate coupon discount
 * @param {string} code
 * @param {number} baseAmount  (ticket subtotal - offer discount)
 * @returns {{ discount: number, error: string|null, coupon: object|null }}
 */
export function calcCouponDiscount(code, baseAmount) {
  if (!code) return { discount: 0, error: null, coupon: null };
  const coupon = COUPONS.find(
    (c) => c.code.toUpperCase() === code.toUpperCase().trim()
  );
  if (!coupon) return { discount: 0, error: "Invalid coupon code.", coupon: null };
  if (baseAmount < coupon.minOrder)
    return {
      discount: 0,
      error: `Minimum order ₹${coupon.minOrder} required for this coupon.`,
      coupon: null,
    };

  let discount = 0;
  if (coupon.discountType === "percent") {
    discount = parseFloat(((coupon.discountValue / 100) * baseAmount).toFixed(2));
  } else {
    discount = Math.min(coupon.discountValue, baseAmount);
  }
  return { discount, error: null, coupon };
}

/**
 * Full booking totals calculation
 * Formula: (ticketSubtotal + foodSubtotal) - offerDiscount - couponDiscount + ticketGST + foodGST + convenienceFee
 *
 * @param {object} ticketQty
 * @param {object} mealQty
 * @param {object|null} offer
 * @param {string} couponCode
 * @returns {object} totals
 */
export function calcTotals(ticketQty, mealQty, offer, couponCode) {
  const ticketSubtotal = calcTicketSubtotal(ticketQty);
  const foodSubtotal = calcFoodSubtotal(mealQty);
  const offerDiscount = calcOfferDiscount(offer, ticketSubtotal, ticketQty);

  const taxableTickets = ticketSubtotal - offerDiscount;
  const { discount: couponDiscount } = calcCouponDiscount(
    couponCode,
    taxableTickets
  );

  const afterDiscounts = Math.max(0, taxableTickets - couponDiscount);

  const ticketGST = parseFloat((afterDiscounts * GST.ticket).toFixed(2));
  const foodGST = parseFloat((foodSubtotal * GST.food).toFixed(2));

  const grandTotal = parseFloat(
    (afterDiscounts + foodSubtotal + ticketGST + foodGST + CONVENIENCE_FEE).toFixed(2)
  );

  return {
    ticketSubtotal,
    foodSubtotal,
    offerDiscount,
    couponDiscount,
    afterDiscounts,
    ticketGST,
    foodGST,
    convenienceFee: CONVENIENCE_FEE,
    grandTotal,
  };
}

/**
 * Count total tickets selected
 */
export function totalTicketCount(ticketQty) {
  return Object.values(ticketQty).reduce((s, v) => s + v, 0);
}

/**
 * Format currency in INR
 */
export function fmt(amount) {
  return `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Generate a random booking ID
 */
export function generateBookingId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "UKD-";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * Generate invoice number from booking ID
 */
export function generateInvoice(bookingId) {
  return "INV-" + bookingId;
}
