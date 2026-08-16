const db = require("../../config/database");

/**
 * Fetch all active rides, including their gallery images and safety rules.
 * Uses batch queries to avoid N+1 query problem.
 */
const getActiveRides = async () => {
    const query = `
        SELECT * FROM rides 
        WHERE status = 'Active' 
        ORDER BY created_at DESC, id DESC
    `;
    const [rides] = await db.query(query);

    if (rides.length === 0) return [];

    const rideIds = rides.map(r => r.id);

    const [galleries] = await db.query(
        `SELECT ride_id, image_url FROM ride_gallery WHERE ride_id IN (?) ORDER BY ride_id, display_order`,
        [rideIds]
    );

    const [safetyRules] = await db.query(
        `SELECT ride_id, rule_text FROM ride_safety_rules WHERE ride_id IN (?) ORDER BY ride_id, display_order`,
        [rideIds]
    );

    const galleryMap = {};
    for (const g of galleries) {
        if (!galleryMap[g.ride_id]) galleryMap[g.ride_id] = [];
        galleryMap[g.ride_id].push(g.image_url);
    }

    const safetyMap = {};
    for (const s of safetyRules) {
        if (!safetyMap[s.ride_id]) safetyMap[s.ride_id] = [];
        safetyMap[s.ride_id].push(s.rule_text);
    }

    return rides.map(ride => ({
        ...ride,
        gallery: galleryMap[ride.id] || [],
        safety_rules: safetyMap[ride.id] || []
    }));
};

/**
 * Fetch a single active ride by its slug.
 */
const getActiveRideBySlug = async (slug) => {
    const [rides] = await db.query(
        `SELECT * FROM rides WHERE slug = ? AND status = 'Active'`,
        [slug]
    );
    
    if (rides.length === 0) return null;
    
    const ride = rides[0];
    
    const [galleries] = await db.query(
        `SELECT image_url FROM ride_gallery WHERE ride_id = ? ORDER BY display_order`,
        [ride.id]
    );
    
    const [safetyRules] = await db.query(
        `SELECT rule_text FROM ride_safety_rules WHERE ride_id = ? ORDER BY display_order`,
        [ride.id]
    );
    
    ride.gallery = galleries.map(g => g.image_url);
    ride.safety_rules = safetyRules.map(s => s.rule_text);
    
    return ride;
};

module.exports = {
    getActiveRides,
    getActiveRideBySlug
};
