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

  // Handle Online Booking Offer (already baked into displayed prices)
  if (offer.id === "ONLINE15" || offer.code === "ONLINE15") {
    return 0;
  }

  // Handle Birthday Buddy (BOGO same category: Adult, Child, Senior, Student)
  if (offer.id === "BIRTHDAY" || offer.id === "BIRTHDAYBOGO" || offer.code === "BIRTHDAYBOGO") {
    let discount = 0;
    TICKETS.forEach((tk) => {
      if (["adult", "child", "senior", "student"].includes(tk.id)) {
        const qty = ticketQty[tk.id] || 0;
        discount += qty * effectivePrice(tk);
      }
    });
    return parseFloat(discount.toFixed(2));
  }

  // Handle Adi Thalubadi / Friendship Trio (B2G1 same category: Adult, Child, Senior, Student)
  if (
    offer.id === "ADITHALUBADI" ||
    offer.id === "FRIENDTRIO" ||
    offer.code === "ADITHALUBADI" ||
    offer.code === "FRIENDTRIO"
  ) {
    let discount = 0;
    TICKETS.forEach((tk) => {
      if (["adult", "child", "senior", "student"].includes(tk.id)) {
        const qty = ticketQty[tk.id] || 0;
        const free = Math.floor(qty / 2);
        discount += free * effectivePrice(tk);
      }
    });
    return parseFloat(discount.toFixed(2));
  }

  // Handle Campus Thrill Deal (20% off Student passes)
  if (offer.id === "CAMPUS20" || offer.code === "CAMPUS20") {
    const studentTk = TICKETS.find((tk) => tk.id === "student");
    if (studentTk) {
      const qty = ticketQty[studentTk.id] || 0;
      return parseFloat((qty * effectivePrice(studentTk) * 0.2).toFixed(2));
    }
  }

  // Handle Freedom Fun Fest (Flat 175.00 off per adult ticket)
  if (offer.id === "FREEDOM800" || offer.code === "FREEDOM800") {
    const adultTk = TICKETS.find((tk) => tk.id === "adult");
    if (adultTk) {
      const qty = ticketQty[adultTk.id] || 0;
      return parseFloat((qty * 175.00).toFixed(2));
    }
  }

  // Fallbacks
  if (offer.discountType === "percent" || offer.offer_rule === "PERCENTAGE") {
    const value = offer.discountValue !== undefined ? offer.discountValue : offer.discount_value;
    return parseFloat(((Number(value) / 100) * ticketSubtotal).toFixed(2));
  }
  if (offer.discountType === "flat" || offer.offer_rule === "FLAT") {
    const value = offer.discountValue !== undefined ? offer.discountValue : offer.discount_value;
    return Math.min(Number(value), ticketSubtotal);
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
