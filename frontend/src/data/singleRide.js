export const singleRide = [
  {
    id: 1,
    slug: "castle-jet",

    // Basic
    n: "Castle Jet",
    c: "family",
    bg: "bg-mint",

    // Listing Page
    d: "Fly high around the castle tower while enjoying panoramic views of the park. A gentle thrill that's perfect for families.",
    m: "Zamperla",

    img: "/images/rides/castle-jet/card.webp",

    // Detail Page
    heroType: "image", // image | video | youtube

    heroYoutube:
        "https://www.youtube.com/embed/kKwysjmqxJU?autoplay=1&mute=1&loop=1&playlist=kKwysjmqxJU&playsinline=1&controls=0&rel=0",
    heroImage: "/images/rides/castle-jet/hero.webp",
    heroVideo: "/videos/rides/castle-jet.mp4",
    

    overview:
      "Castle Jet lifts riders high into the sky and spins gently around a beautiful castle tower, offering breathtaking views of VGP Universal Kingdom. It is one of the most popular family rides in the park.",

    gallery: [
      "/images/rides/castle-jet/gallery-1.webp",
      "/images/rides/castle-jet/gallery-2.webp",
      "/images/rides/castle-jet/gallery-3.webp",
      "/images/rides/castle-jet/gallery-4.webp"
    ],

    rideInfo: {
      type: "Family Ride",
      duration: "2–3 Minutes",
      minHeight: "90 cm",
      thrillLevel: "Medium",
      capacity: "24 Riders",
      ageGroup: "3+ Years",
      manufacturer: "Zamperla",
      location: "Adventure Zone",
      status: "Operational"
    },

    safety: [
      "Minimum height 90 cm.",
      "Children must be accompanied by an adult.",
      "Pregnant guests should avoid this ride.",
      "Secure all loose belongings.",
      "Remain seated until the ride stops."
    ],

    map: {
      zone: "Adventure Zone",
      lat: 12.9089,
      lng: 80.2495
    }
  },

  {
    id: 2,
    slug: "tea-cup",

    n: "Tea Cup",
    c: "family",
    bg: "bg-peach",

    d: "Spin around in colorful teacups while enjoying cheerful music and a fun family experience.",

    m: "Okamoto",

    img: "/images/rides/tea-cup/card.webp",

    heroType: "image",

    heroImage: "/images/rides/tea-cup/hero.webp",
    heroVideo: "",
    heroYoutube: "",

    overview:
      "Tea Cup is a colorful spinning ride suitable for children and adults alike. Riders control how fast their teacup spins for an interactive experience.",

    gallery: [
      "/images/rides/tea-cup/gallery-1.webp",
      "/images/rides/tea-cup/gallery-2.webp",
      "/images/rides/tea-cup/gallery-3.webp"
    ],

    rideInfo: {
      type: "Family Ride",
      duration: "2 Minutes",
      minHeight: "80 cm",
      thrillLevel: "Low",
      capacity: "36 Riders",
      ageGroup: "All Ages",
      manufacturer: "Okamoto",
      location: "Family Zone",
      status: "Operational"
    },

    safety: [
      "Children under 5 must ride with an adult.",
      "Hold the center wheel firmly.",
      "Remain seated throughout the ride."
    ],

    map: {
      zone: "Family Zone",
      lat: 12.9092,
      lng: 80.2499
    }
  },

  {
    id: 3,
    slug: "roller-coaster",

    n: "Roller Coaster",
    c: "adult",
    bg: "bg-softyellow",

    d: "Experience thrilling drops, twists, and turns on one of the park's most exciting attractions.",

    m: "Moser",

    img: "/images/rides/roller-coaster/card.webp",

    heroType: "video",

    heroImage: "/images/rides/roller-coaster/hero.webp",
    heroVideo: "/videos/rides/roller-coaster.mp4",
    heroYoutube: "",

    overview:
      "The Roller Coaster delivers an unforgettable adrenaline rush with steep climbs, thrilling drops, and high-speed curves.",

    gallery: [
      "/images/rides/roller-coaster/gallery-1.webp",
      "/images/rides/roller-coaster/gallery-2.webp",
      "/images/rides/roller-coaster/gallery-3.webp"
    ],

    rideInfo: {
      type: "Thrill Ride",
      duration: "3 Minutes",
      minHeight: "140 cm",
      thrillLevel: "High",
      capacity: "20 Riders",
      ageGroup: "12+ Years",
      manufacturer: "Moser",
      location: "Thrill Zone",
      status: "Operational"
    },

    safety: [
      "Minimum height 140 cm.",
      "Not suitable for heart patients.",
      "No loose articles allowed."
    ],

    map: {
      zone: "Thrill Zone",
      lat: 12.9095,
      lng: 80.2501
    }
  },

  {
    id: 4,
    slug: "wave-pool",

    n: "Wave Pool",
    c: "water",
    bg: "bg-sky",

    d: "Enjoy giant rolling waves and cool off with family and friends in the park's biggest water attraction.",

    m: "Aqua Kingdom",

    img: "/images/rides/wave-pool/card.webp",

    heroType: "video",

    heroImage: "/images/rides/wave-pool/hero.webp",
    heroVideo: "/videos/rides/wave-pool.mp4",
    heroYoutube: "",

    overview:
      "The Wave Pool recreates ocean-like waves, providing a relaxing yet exciting water experience for all ages.",

    gallery: [
      "/images/rides/wave-pool/gallery-1.webp",
      "/images/rides/wave-pool/gallery-2.webp",
      "/images/rides/wave-pool/gallery-3.webp"
    ],

    rideInfo: {
      type: "Water Ride",
      duration: "Unlimited",
      minHeight: "None",
      thrillLevel: "Medium",
      capacity: "300 Guests",
      ageGroup: "All Ages",
      manufacturer: "Aqua Kingdom",
      location: "Water Park",
      status: "Operational"
    },

    safety: [
      "Children must be supervised.",
      "Wear proper swimwear.",
      "No diving."
    ],

    map: {
      zone: "Water Park",
      lat: 12.9100,
      lng: 80.2508
    }
  },

  {
    id: 5,
    slug: "bumper-cars",

    n: "Bumper Cars",
    c: "family",
    bg: "bg-lavender",

    d: "Drive, bump, and laugh your way through one of the park's classic family attractions.",

    m: "SBF Visa",

    img: "/images/rides/bumper-cars/card.webp",

    heroType: "image",

    heroImage: "/images/rides/bumper-cars/hero.webp",
    heroVideo: "",
    heroYoutube: "",

    overview:
      "Bumper Cars offer safe, exciting fun where guests drive electric cars and gently bump into each other.",

    gallery: [
      "/images/rides/bumper-cars/gallery-1.webp",
      "/images/rides/bumper-cars/gallery-2.webp",
      "/images/rides/bumper-cars/gallery-3.webp"
    ],

    rideInfo: {
      type: "Family Ride",
      duration: "3 Minutes",
      minHeight: "120 cm",
      thrillLevel: "Low",
      capacity: "24 Cars",
      ageGroup: "6+ Years",
      manufacturer: "SBF Visa",
      location: "Family Zone",
      status: "Operational"
    },

    safety: [
      "Fasten the seat belt.",
      "Drive in the correct direction.",
      "No intentional collisions with stationary cars."
    ],

    map: {
      zone: "Family Zone",
      lat: 12.9097,
      lng: 80.2503
    }
  }
];