// ─── Booking Offers — Single Source of Truth ───────────────────────────────
// All 6 promotional offers. Shapes match both OfferCard.js and the backend API.
// The `code` field must match the offer_code in the DB (used in backend API calls).
// discountType: "percent" | "flat" | "bogo" | "b2g1" | "combo" | "info"
export const BOOKING_OFFERS = [
  {
    id: "ONLINE15",
    code: "ONLINE15",
    title: "Online Booking Offer",
    badge: "Online 15%",
    badgeColor: "#2E8B57",
    description:
      "15% online booking discount on Adult, Child, and Senior passes — already reflected in the displayed ticket prices.",
    discountType: "percent",
    discountValue: 15,
    applicableTo: "tickets",
    terms: "Cannot be combined with other offers or coupons.",
    validDays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "CAMPUS20",
    code: "CAMPUS20",
    title: "Campus Thrill Deal",
    badge: "College ID",
    badgeColor: "#4A9A3A",
    description:
      "20% discount for college students. Valid college ID must be shown at entry.",
    discountType: "percent",
    discountValue: 20,
    applicableTo: "student",
    terms: "Valid college ID mandatory at the gate.",
    validDays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "BIRTHDAYBOGO",
    code: "BIRTHDAYBOGO",
    title: "Birthday Buddy Treat",
    badge: "Birthday month",
    badgeColor: "#C73A7B",
    description:
      "Buy 1 ticket and get 1 FREE (same category) during your birthday month. Valid for Adult, Child, Senior, and Student passes.",
    discountType: "bogo",
    discountValue: 1,
    applicableTo: "adult,child,senior,student",
    terms: "Original DOB proof required at entry. Minimum 2 tickets of same category.",
    validDays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "ADITHALUBADI",
    code: "ADITHALUBADI",
    title: "Adi Thalubadi",
    badge: "Tue & Wed · Jul 21–Aug 12",
    badgeColor: "#3A6AC7",
    description:
      "Buy 2 tickets and get 1 FREE (same category) on Tuesdays & Wednesdays, 21 July – 12 August 2026.",
    discountType: "b2g1",
    discountValue: 1,
    applicableTo: "adult,child,senior,student",
    terms: "Valid only on Tuesdays & Wednesdays between 21 Jul – 12 Aug 2026. Minimum 3 tickets.",
    validDays: [2, 3],
  },
  {
    id: "FRIENDTRIO",
    code: "FRIENDTRIO",
    title: "Friendship Trio Fun Pass",
    badge: "2 Aug only",
    badgeColor: "#B36D3C",
    description:
      "Two friends book, the third goes FREE! Buy 2 get 1 free (same category), valid only on 2 August 2026.",
    discountType: "b2g1",
    discountValue: 1,
    applicableTo: "adult,child,senior,student",
    terms: "Valid only on 2 August 2026. Minimum 3 tickets of the same category.",
    validDays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "FREEDOM800",
    code: "FREEDOM800",
    title: "Freedom Fun Fest",
    badge: "15 Aug only",
    badgeColor: "#8B6914",
    description:
      "Independence Day Special — ₹175 flat off per Adult Fun Pass (before tax). Valid only on 15 August 2026.",
    discountType: "flat",
    discountValue: 175,
    applicableTo: "adult",
    terms: "Valid only on 15 August 2026. Applicable to Adult Fun Pass only.",
    validDays: [0, 1, 2, 3, 4, 5, 6],
  },
];

// ─── Coupon Codes ──────────────────────────────────────────────────────────
// These are used ONLY as a fallback for BookingSummary pre-checkout display.
// Actual coupon validation is done via POST /api/coupons/validate.
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
