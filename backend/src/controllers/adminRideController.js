const db = require("../config/database");
const { success } = require("../utils/response");

const getAdminRides = async (req, res, next) => {
    try {
        const [rides] = await db.query(
            `SELECT * FROM rides ORDER BY created_at DESC, id DESC`
        );
        return success(res, "Rides retrieved successfully", rides);
    } catch (error) {
        next(error);
    }
};

const getAdminRideById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [rides] = await db.query(`SELECT * FROM rides WHERE id = ?`, [id]);
        if (rides.length === 0) {
            return res.status(404).json({ success: false, message: "Ride not found." });
        }
        
        const ride = rides[0];
        const [gallery] = await db.query(
            `SELECT id, image_url, display_order FROM ride_gallery WHERE ride_id = ? ORDER BY display_order ASC`,
            [id]
        );
        const [safety_rules] = await db.query(
            `SELECT id, rule_text, display_order FROM ride_safety_rules WHERE ride_id = ? ORDER BY display_order ASC`,
            [id]
        );

        ride.gallery = gallery;
        ride.safety_rules = safety_rules;

        return success(res, "Ride retrieved successfully", ride);
    } catch (error) {
        next(error);
    }
};

const createAdminRide = async (req, res, next) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const {
            slug, name, category, sub_category, manufacturer, short_description, overview,
            bg_color, photo_text_overlay, icon_identifier, emoji_icon, card_image_url,
            hero_type, hero_image_url, hero_video_url, hero_youtube_url,
            duration, min_height, thrill_level, capacity, age_group,
            map_zone, map_lat, map_lng, status, display_order,
            gallery, safety_rules
        } = req.body;

        const [rideResult] = await connection.query(
            `INSERT INTO rides (
                slug, name, category, sub_category, manufacturer, short_description, overview,
                bg_color, photo_text_overlay, icon_identifier, emoji_icon, card_image_url,
                hero_type, hero_image_url, hero_video_url, hero_youtube_url,
                duration, min_height, thrill_level, capacity, age_group,
                map_zone, map_lat, map_lng, status, display_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                slug || null, name || null, category || null, sub_category || null, manufacturer || null, short_description || null, overview || null,
                bg_color || null, photo_text_overlay || null, icon_identifier || null, emoji_icon || null, card_image_url || null,
                hero_type || 'image', hero_image_url || null, hero_video_url || null, hero_youtube_url || null,
                duration || null, min_height || null, thrill_level || null, capacity || null, age_group || null,
                map_zone || null, map_lat || null, map_lng || null, status || 'Active', display_order || 0
            ]
        );

        const rideId = rideResult.insertId;

        if (gallery && Array.isArray(gallery) && gallery.length > 0) {
            const galleryValues = gallery.map((g, index) => [rideId, g.image_url, g.display_order ?? index]);
            if (galleryValues.length > 0) {
                await connection.query(
                    `INSERT INTO ride_gallery (ride_id, image_url, display_order) VALUES ?`,
                    [galleryValues]
                );
            }
        }

        if (safety_rules && Array.isArray(safety_rules) && safety_rules.length > 0) {
            const safetyValues = safety_rules.map((s, index) => [rideId, s.rule_text, s.display_order ?? index]);
            if (safetyValues.length > 0) {
                await connection.query(
                    `INSERT INTO ride_safety_rules (ride_id, rule_text, display_order) VALUES ?`,
                    [safetyValues]
                );
            }
        }

        await connection.commit();
        return success(res, "Ride created successfully", { id: rideId }, 201);
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

const updateAdminRide = async (req, res, next) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;

        const {
            name, category, sub_category, manufacturer, short_description, overview,
            bg_color, photo_text_overlay, icon_identifier, emoji_icon, card_image_url,
            hero_type, hero_image_url, hero_video_url, hero_youtube_url,
            duration, min_height, thrill_level, capacity, age_group,
            map_zone, map_lat, map_lng, status, display_order,
            gallery, safety_rules
        } = req.body;

        await connection.query(
            `UPDATE rides SET 
                name=?, category=?, sub_category=?, manufacturer=?, short_description=?, overview=?,
                card_image_url=?, hero_type=?, hero_image_url=?, hero_video_url=?, hero_youtube_url=?,
                duration=?, min_height=?, thrill_level=?, capacity=?, age_group=?,
                map_zone=?, map_lat=?, map_lng=?, status=?
            WHERE id=?`,
            [
                name || null, category || null, sub_category || null, manufacturer || null, short_description || null, overview || null,
                card_image_url || null, hero_type || 'image', hero_image_url || null, hero_video_url || null, hero_youtube_url || null,
                duration || null, min_height || null, thrill_level || null, capacity || null, age_group || null,
                map_zone || null, map_lat || null, map_lng || null, status || 'Active',
                id
            ]
        );

        await connection.query(`DELETE FROM ride_gallery WHERE ride_id = ?`, [id]);
        if (gallery && Array.isArray(gallery) && gallery.length > 0) {
            const galleryValues = gallery.map((g, index) => [id, g.image_url, g.display_order ?? index]);
            if (galleryValues.length > 0) {
                await connection.query(
                    `INSERT INTO ride_gallery (ride_id, image_url, display_order) VALUES ?`,
                    [galleryValues]
                );
            }
        }

        await connection.query(`DELETE FROM ride_safety_rules WHERE ride_id = ?`, [id]);
        if (safety_rules && Array.isArray(safety_rules) && safety_rules.length > 0) {
            const safetyValues = safety_rules.map((s, index) => [id, s.rule_text, s.display_order ?? index]);
            if (safetyValues.length > 0) {
                await connection.query(
                    `INSERT INTO ride_safety_rules (ride_id, rule_text, display_order) VALUES ?`,
                    [safetyValues]
                );
            }
        }

        await connection.commit();
        return success(res, "Ride updated successfully", { id });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

const updateAdminRideStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }
        await db.query(`UPDATE rides SET status = ? WHERE id = ?`, [status, id]);
        return success(res, "Ride status updated", { id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminRides,
    getAdminRideById,
    createAdminRide,
    updateAdminRide,
    updateAdminRideStatus
};
