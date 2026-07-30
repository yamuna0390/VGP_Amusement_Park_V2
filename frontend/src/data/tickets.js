// ─── Mock Ticket Data ──────────────────────────────────────────────────────
// Replace with API call: GET /api/tickets
export const TICKETS = [
  {
    id: "adult",
    dbId: 1,
    name: "Adult Fun Pass",
    description: "Theme Park & Beach Access",
    ageRule: "Above 130 cm",
    originalPrice: 975,
    discountPrice: 828.75,
    category: "theme",
  },
  {
    id: "child",
    dbId: 2,
    name: "Child Fun Pass",
    description: "90–130 cm · Theme Park & Beach",
    ageRule: "90 cm – 130 cm",
    originalPrice: 763,
    discountPrice: 648.55,
    category: "theme",
  },
  {
    id: "senior",
    dbId: 3,
    name: "Senior Citizen Fun Pass",
    description: "Age 60+ with valid ID",
    ageRule: "60 years and above",
    originalPrice: 763,
    discountPrice: 648.55,
    category: "theme",
  },
  {
    id: "student",
    dbId: 4,
    name: "College Student ID Fun Pass",
    description: "Valid ONLY with college ID card display",
    ageRule: "Valid college ID required",
    originalPrice: 780,
    discountPrice: null,
    category: "theme",
  },
  {
    id: "dfpa",
    dbId: 5,
    name: "Double Fun Pass — Adult",
    description: "Universal Kingdom + Marine Kingdom",
    ageRule: "Above 130 cm",
    originalPrice: 1715,
    discountPrice: 1313,
    category: "combo",
  },
  {
    id: "dfpc",
    dbId: 6,
    name: "Double Fun Pass — Child",
    description: "Universal Kingdom + Marine Kingdom",
    ageRule: "90 cm – 130 cm",
    originalPrice: 1403,
    discountPrice: 1128,
    category: "combo",
  },
  {
    id: "below90",
    dbId: 7,
    name: "Below 90 cm Entry",
    description: "Children below 90 cm — FREE entry",
    ageRule: "Below 90 cm",
    originalPrice: 0,
    discountPrice: 0,
    category: "free",
  },
];

// GST rates
export const GST = {
  ticket: 0.18, // 18%
  food: 0.05,   // 5%
};

// Convenience fee (flat, min)
export const CONVENIENCE_FEE = 40;
