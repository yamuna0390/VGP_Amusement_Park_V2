require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./src/config/database');

async function seed() {
    console.log("Starting Rides data seeding...");
    const connection = await db.getConnection();
    
    try {
        // Read rides.js
        const ridesJsPath = path.join(__dirname, '../frontend/src/data/rides.js');
        const ridesContent = fs.readFileSync(ridesJsPath, 'utf8');
        // Extract array from ridesContent
        const ridesMatch = ridesContent.match(/export const rides = (\[[\s\S]*\]);/);
        let ridesList = [];
        if (ridesMatch) {
            // Need to carefully eval to get the object
            ridesList = eval(ridesMatch[1]);
        } else {
            console.error("Could not parse rides.js");
        }

        // Read singleRide.js
        const singleRideJsPath = path.join(__dirname, '../frontend/src/data/singleRide.js');
        const singleRideContent = fs.readFileSync(singleRideJsPath, 'utf8');
        // Extract array from singleRideContent
        const singleMatch = singleRideContent.match(/export const singleRide = (\[[\s\S]*\]);/);
        let singleRides = [];
        if (singleMatch) {
            singleRides = eval(singleMatch[1]);
        } else {
            console.error("Could not parse singleRide.js");
        }

        await connection.beginTransaction();
        
        let nextId = 16; // singleRides use 1-15
        
        for (const basicRide of ridesList) {
            const detailRide = singleRides.find(r => r.slug === basicRide.slug);
            
            const rideId = detailRide ? detailRide.id : nextId++;
            
            // Merge data
            // From basicRide:
            // n (name), m (manufacturer), c (category), ph (photo_text_overlay), bg (bg_color), d (short_description)
            // img (card_image_url), slug
            // h (min_height), i (icon_identifier), e (emoji_icon)
            
            // From detailRide:
            // heroType, heroYoutube, heroImage, heroVideo, overview
            // gallery [], rideInfo {}, safety [], map {}

            const name = detailRide?.n || basicRide.n;
            const slug = basicRide.slug;
            const category = basicRide.c || detailRide?.c;
            const manufacturer = detailRide?.rideInfo?.manufacturer || detailRide?.m || basicRide.m || null;
            const short_desc = detailRide?.d || basicRide.d || null;
            const overview = detailRide?.overview || null;
            
            const bg = detailRide?.bg || basicRide.bg || null;
            const photo_overlay = basicRide.ph || null;
            const icon = basicRide.i || null;
            const emoji = basicRide.e || null;
            
            const img = detailRide?.img || basicRide.img || null;
            const heroType = detailRide?.heroType || 'image';
            const heroImage = detailRide?.heroImage || null;
            const heroVideo = detailRide?.heroVideo || null;
            const heroYoutube = detailRide?.heroYoutube || null;
            
            const duration = detailRide?.rideInfo?.duration || null;
            const minHeight = detailRide?.rideInfo?.minHeight || basicRide.h || null;
            const thrillLevel = detailRide?.rideInfo?.thrillLevel || null;
            const capacity = detailRide?.rideInfo?.capacity || null;
            const ageGroup = detailRide?.rideInfo?.ageGroup || null;
            const subCategory = detailRide?.rideInfo?.type || null;
            
            const mapZone = detailRide?.map?.zone || null;
            const mapLat = detailRide?.map?.lat || null;
            const mapLng = detailRide?.map?.lng || null;
            
            let status = 'Active';
            
            const query = `
                INSERT INTO rides (
                    id, slug, name, category, sub_category, manufacturer,
                    short_description, overview, bg_color, photo_text_overlay,
                    icon_identifier, emoji_icon, card_image_url, hero_type,
                    hero_image_url, hero_video_url, hero_youtube_url,
                    duration, min_height, thrill_level, capacity, age_group,
                    map_zone, map_lat, map_lng, status
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?
                )
            `;
            
            const values = [
                rideId, slug, name, category, subCategory, manufacturer,
                short_desc, overview, bg, photo_overlay,
                icon, emoji, img, heroType,
                heroImage, heroVideo, heroYoutube,
                duration, minHeight, thrillLevel, capacity, ageGroup,
                mapZone, mapLat, mapLng, status
            ];
            
            await connection.execute(query, values);
            
            // Insert gallery
            if (detailRide && detailRide.gallery && detailRide.gallery.length > 0) {
                let order = 1;
                for (const g_img of detailRide.gallery) {
                    await connection.execute(
                        `INSERT INTO ride_gallery (ride_id, image_url, display_order) VALUES (?, ?, ?)`,
                        [rideId, g_img, order++]
                    );
                }
            }
            
            // Insert safety rules
            if (detailRide && detailRide.safety && detailRide.safety.length > 0) {
                let order = 1;
                for (const rule of detailRide.safety) {
                    await connection.execute(
                        `INSERT INTO ride_safety_rules (ride_id, rule_text, display_order) VALUES (?, ?, ?)`,
                        [rideId, rule, order++]
                    );
                }
            }
        }
        
        await connection.commit();
        console.log("Seeding completed successfully.");
    } catch (err) {
        await connection.rollback();
        console.error("Seeding failed:", err);
    } finally {
        connection.release();
        process.exit();
    }
}

seed();
