// ─── Booking Tickets Data ──────────────────────────────────────────
// All ticket category definitions for the VGP booking system
// Uses real VGP pricing

export const tickets = [
  {
    id: "adult",
    name: "Adult Fun Pass",
    description: "Full access to all rides and attractions",
    eligibility: "Height above 130 cm",
    icon: "🎢",
    image: "/images/Thumbnail/Adult.png",
    originalPrice: 975,
    category: "theme",
    gstRate: 0.18,
    maxQuantity: 10,
    sortOrder: 1
  },
  {
    id: "child",
    name: "Child Fun Pass",
    description: "Theme Park & Beach access for kids",
    eligibility: "Height 90 cm – 130 cm",
    icon: "🧒",
    image: "/images/Thumbnail/child.png",
    originalPrice: 763,
    category: "theme",
    gstRate: 0.18,
    maxQuantity: 10,
    sortOrder: 2
  },
  {
    id: "senior",
    name: "Senior Citizen Fun Pass",
    description: "Theme Park & Beach access for seniors",
    eligibility: "Age 60 years and above (ID required)",
    icon: "👴",
    image: "/images/Thumbnail/senior.png",
    originalPrice: 763,
    category: "theme",
    gstRate: 0.18,
    maxQuantity: 10,
    sortOrder: 3
  },
  {
    id: "student",
    name: "College Student ID Fun Pass",
    description: "Valid ONLY with college ID card display",
    eligibility: "Valid college ID required",
    icon: "🎓",
    image: "/images/Thumbnail/students.png",
    originalPrice: 780,
    category: "theme",
    gstRate: 0.18,
    maxQuantity: 10,
    sortOrder: 4
  },
  {
    id: "dfpa",
    name: "Double Fun Pass — Adult",
    description: "Universal Kingdom + Marine Kingdom combo",
    eligibility: "Height above 130 cm",
    icon: "🎠",
    image: null,
    originalPrice: 1715,
    category: "combo",
    gstRate: 0.18,
    maxQuantity: 10,
    sortOrder: 5
  },
  {
    id: "dfpc",
    name: "Double Fun Pass — Child",
    description: "Universal Kingdom + Marine Kingdom combo",
    eligibility: "Height 90 cm – 130 cm",
    icon: "🎡",
    image: null,
    originalPrice: 1403,
    category: "combo",
    gstRate: 0.18,
    maxQuantity: 10,
    sortOrder: 6
  },
  {
    id: "below90",
    name: "Below 90 cm Entry",
    description: "Children below 90 cm — FREE entry",
    eligibility: "Below 90 cm height",
    icon: "👶",
    image: null,
    originalPrice: 0,
    category: "free",
    gstRate: 0,
    maxQuantity: 10,
    sortOrder: 7
  }
];
