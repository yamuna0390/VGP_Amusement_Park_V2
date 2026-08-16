import { API_BASE_URL } from "@/constants/api";

/**
 * Maps the snake_case API response to the legacy JSON format expected by components.
 */
export const mapRideToLegacyFormat = (apiRide) => {
  return {
    id: apiRide.id,
    slug: apiRide.slug,
    n: apiRide.name,
    c: apiRide.category,
    d: apiRide.short_description,
    m: apiRide.manufacturer,
    bg: apiRide.bg_color,
    ph: apiRide.photo_text_overlay,
    i: apiRide.icon_identifier,
    e: apiRide.emoji_icon,
    img: apiRide.card_image_url,
    heroType: apiRide.hero_type,
    heroYoutube: apiRide.hero_youtube_url,
    heroImage: apiRide.hero_image_url,
    heroVideo: apiRide.hero_video_url,
    overview: apiRide.overview,
    gallery: apiRide.gallery || [],
    rideInfo: {
      type: apiRide.sub_category,
      duration: apiRide.duration,
      minHeight: apiRide.min_height,
      thrillLevel: apiRide.thrill_level,
      capacity: apiRide.capacity,
      ageGroup: apiRide.age_group,
      manufacturer: apiRide.manufacturer,
      location: apiRide.map_zone,
      status: apiRide.operational_status || apiRide.status // Backwards compatibility if needed
    },
    safety: apiRide.safety_rules || [],
    map: {
      zone: apiRide.map_zone,
      lat: apiRide.map_lat,
      lng: apiRide.map_lng
    }
  };
};

export const fetchRides = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/rides`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (data && data.success && data.data) {
      return data.data.map(mapRideToLegacyFormat);
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch rides:", error);
    return [];
  }
};

export const fetchRideBySlug = async (slug) => {
  try {
    const res = await fetch(`${API_BASE_URL}/rides/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.success && data.data) {
      return mapRideToLegacyFormat(data.data);
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch ride by slug:", error);
    return null;
  }
};
