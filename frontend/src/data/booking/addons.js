// ─── Booking Add-ons Data ──────────────────────────────────────────
// Optional add-on products for the VGP booking system

export const addons = [
  {
    id: "food-coupon",
    name: "Food Coupon",
    description: "Redeemable at any food stall inside the park",
    icon: "🍔",
    image: "/images/addons/food.png",
    price: 250,
    gstRate: 0.05,
    maxQuantity: 10,
    available: true,
    comingSoon: false
  },
  {
    id: "locker",
    name: "Locker",
    description: "Secure your belongings for the whole day",
    icon: "🔐",
    image: "/images/addons/locker.png",
    price: 100,
    gstRate: 0.18,
    maxQuantity: 5,
    available: true,
    comingSoon: false
  },
  {
    id: "fast-track",
    name: "Fast Track",
    description: "Skip the queue on select rides",
    icon: "⚡",
    image: "/images/addons/fasttrack.png",
    price: null,
    gstRate: 0.18,
    maxQuantity: 1,
    available: false,
    comingSoon: true
  },
  {
    id: "photo-pass",
    name: "Photo Pass",
    description: "Unlimited ride photos & professional shots",
    icon: "📸",
    image: "/images/addons/photo.png",
    price: null,
    gstRate: 0.18,
    maxQuantity: 1,
    available: false,
    comingSoon: true
  }
];
