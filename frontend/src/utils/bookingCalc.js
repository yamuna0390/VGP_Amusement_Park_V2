// ─── Booking Price Calculator ──────────────────────────────────────────────
import { GST, CONVENIENCE_FEE } from "@/data/tickets";
import { COUPONS } from "@/data/bookingOffers";

/**
 * Get effective price for a ticket
 * @param {object} ticket
 * @returns {number}
 */
export function effectivePrice(ticket) {
  return Number(ticket.discountPrice !== null && ticket.discountPrice !== undefined ? ticket.discountPrice : (ticket.price !== undefined ? ticket.price : ticket.originalPrice)) || 0;
}

/**
 * Calculate ticket subtotal (before tax)
 * @param {object} ticketQty  { ticketId: quantity }
 * @param {Array} regularTickets
 * @returns {number}
 */
export function calcTicketSubtotal(ticketQty = {}, regularTickets = []) {
  return (regularTickets || []).reduce((sum, t) => {
    const id = t.id || t.code || t.ticketId;
    const qty = Number(ticketQty[id] || ticketQty[t.code] || 0);
    return sum + effectivePrice(t) * qty;
  }, 0);
}

/**
 * Calculate food subtotal (before tax)
 * @param {object} foodQty  { foodId: quantity }
 * @param {Array} foods
 * @returns {number}
 */
export function calcFoodSubtotal(foodQty = {}, foods = []) {
  return (foods || []).reduce((sum, m) => {
    const id = m.id || m.code || m.foodId;
    const qty = Number(foodQty[id] || foodQty[m.code] || 0);
    const price = Number(m.price !== undefined ? m.price : m.unitPrice) || 0;
    return sum + price * qty;
  }, 0);
}

/**
 * Calculate offer discount amount applied to ticket subtotal
 * @param {object|null} offer
 * @param {number} ticketSubtotal
 * @param {object} ticketQty
 * @param {Array} regularTickets
 * @returns {number}
 */
export function calcOfferDiscount(offer, ticketSubtotal, ticketQty = {}, regularTickets = []) {
  if (!offer) return 0;

  // Handle Online Booking Offer (already baked into displayed prices)
  if (offer.id === "ONLINE15" || offer.code === "ONLINE15") {
    return 0;
  }

  // Handle Birthday Buddy (BOGO same category: Adult, Child, Senior, Student)
  if (offer.id === "BIRTHDAY" || offer.id === "BIRTHDAYBOGO" || offer.code === "BIRTHDAYBOGO") {
    let discount = 0;
    (regularTickets || []).forEach((tk) => {
      const id = tk.id || tk.code;
      if (["adult", "child", "senior", "student", "ADULT", "CHILD", "SENIOR", "STUDENT"].includes(String(id).toLowerCase())) {
        const qty = Number(ticketQty[id] || ticketQty[tk.code] || 0);
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
    (regularTickets || []).forEach((tk) => {
      const id = tk.id || tk.code;
      if (["adult", "child", "senior", "student", "ADULT", "CHILD", "SENIOR", "STUDENT"].includes(String(id).toLowerCase())) {
        const qty = Number(ticketQty[id] || ticketQty[tk.code] || 0);
        const free = Math.floor(qty / 2);
        discount += free * effectivePrice(tk);
      }
    });
    return parseFloat(discount.toFixed(2));
  }

  // Handle Campus Thrill Deal (20% off Student passes)
  if (offer.id === "CAMPUS20" || offer.code === "CAMPUS20") {
    const studentTk = (regularTickets || []).find((tk) => String(tk.id || tk.code).toLowerCase() === "student");
    if (studentTk) {
      const id = studentTk.id || studentTk.code;
      const qty = Number(ticketQty[id] || 0);
      return parseFloat((qty * effectivePrice(studentTk) * 0.2).toFixed(2));
    }
  }

  // Handle Freedom Fun Fest (Flat 175.00 off per adult ticket)
  if (offer.id === "FREEDOM800" || offer.code === "FREEDOM800") {
    const adultTk = (regularTickets || []).find((tk) => String(tk.id || tk.code).toLowerCase() === "adult");
    if (adultTk) {
      const id = adultTk.id || adultTk.code;
      const qty = Number(ticketQty[id] || 0);
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
 * @param {object} foodQty
 * @param {object|null} offer
 * @param {string} couponCode
 * @param {Array} regularTickets
 * @param {Array} foods
 * @returns {object} totals
 */
export function calcTotals(ticketQty = {}, foodQty = {}, offer = null, couponCode = "", regularTickets = [], foods = []) {
  const ticketSubtotal = calcTicketSubtotal(ticketQty, regularTickets);
  const foodSubtotal = calcFoodSubtotal(foodQty, foods);
  const offerDiscount = calcOfferDiscount(offer, ticketSubtotal, ticketQty, regularTickets);

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
