// ─── Mock Offer Data ───────────────────────────────────────────────────────
// Replace with API call: GET /api/offers
export const BOOKING_OFFERS = [
  {
    id: "ONLINE15",
    title: "Online Booking Offer",
    badge: "Online 15%",
    badgeColor: "#2E8B57",
    description:
      "15% online booking discount — already included in the displayed ticket prices.",
    couponCode: "U0001F4C5",
    discountType: "percent",   // "percent" | "flat" | "bogo"
    discountValue: 15,
    applicableTo: "tickets",   // "tickets" | "all"
    validDays: [0, 1, 2, 3, 4, 5, 6], // all days
    terms: "Cannot be combined with other offers.",
  },
  {
    id: "CAMPUS20",
    title: "Campus Thrill Deal",
    badge: "College ID",
    badgeColor: "#4A9A3A",
    description:
      "20% discount for college students. Valid college ID must be shown at entry.",
    couponCode: null,
    discountType: "percent",
    discountValue: 20,
    applicableTo: "tickets",
    validDays: [0, 1, 2, 3, 4, 5, 6],
    terms: "Valid college ID mandatory at gate.",
  },
  {
    id: "BIRTHDAY",
    title: "Birthday Buddy Treat",
    badge: "Birthday month",
    badgeColor: "#C73A7B",
    description:
      "Buy 1 get 1 free on Adult Fun Pass for the birthday person (DOB proof required).",
    couponCode: null,
    discountType: "bogo",
    discountValue: 1,
    applicableTo: "adult",
    validDays: [0, 1, 2, 3, 4, 5, 6],
    terms: "Original DOB proof required at entry.",
  },
  {
    id: "DOUBLE",
    title: "Double Fun Pass",
    badge: "2-day pass",
    badgeColor: "#B36D3C",
    description:
      "Access both Universal Kingdom and Marine Kingdom — 2 parks, 1 price.",
    couponCode: null,
    discountType: "combo",
    discountValue: 0,
    applicableTo: "dfpa",
    validDays: [0, 1, 2, 3, 4, 5, 6],
    terms: "Both parks must be visited on the same day.",
  },
];

// ─── Coupon Codes ──────────────────────────────────────────────────────────
// Replace with API validation call: POST /api/coupons/validate
export const COUPONS = [
  {
    code: "WELCOME10",
    discountType: "percent",
    discountValue: 10,
    description: "10% off for new visitors",
    minOrder: 500,
  },
  {
    code: "FLAT200",
    discountType: "flat",
    discountValue: 200,
    description: "₹200 off on bookings above ₹1000",
    minOrder: 1000,
  },
  {
    code: "SUMMER50",
    discountType: "flat",
    discountValue: 50,
    description: "₹50 summer special discount",
    minOrder: 0,
  },
];
