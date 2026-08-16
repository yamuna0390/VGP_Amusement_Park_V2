require('dotenv').config();
const db = require('./src/config/database');

async function migrate() {
    console.log("Starting Rides schema migration...");
    const connection = await db.getConnection();
    try {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS rides (
                id BIGINT NOT NULL AUTO_INCREMENT,
                slug VARCHAR(100) NOT NULL,
                name VARCHAR(150) NOT NULL,
                
                category ENUM('family', 'adult', 'child', 'water', 'zoo') NOT NULL,
                sub_category VARCHAR(100) DEFAULT NULL,
                manufacturer VARCHAR(100) DEFAULT NULL,
                
                short_description TEXT DEFAULT NULL,
                overview TEXT DEFAULT NULL,
                
                bg_color VARCHAR(30) DEFAULT NULL,
                photo_text_overlay VARCHAR(150) DEFAULT NULL,
                icon_identifier VARCHAR(30) DEFAULT NULL,
                emoji_icon VARCHAR(10) DEFAULT NULL,
                card_image_url VARCHAR(255) DEFAULT NULL,
                hero_type ENUM('image', 'video') DEFAULT 'image',
                hero_image_url VARCHAR(255) DEFAULT NULL,
                hero_video_url VARCHAR(255) DEFAULT NULL,
                hero_youtube_url VARCHAR(255) DEFAULT NULL,
                
                duration VARCHAR(50) DEFAULT NULL,
                min_height VARCHAR(50) DEFAULT NULL,
                thrill_level VARCHAR(30) DEFAULT NULL,
                capacity VARCHAR(50) DEFAULT NULL,
                age_group VARCHAR(50) DEFAULT NULL,
                
                map_zone VARCHAR(100) DEFAULT NULL,
                map_lat DECIMAL(10, 8) DEFAULT NULL,
                map_lng DECIMAL(11, 8) DEFAULT NULL,
                
                status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
                display_order INT NOT NULL DEFAULT 0,
                
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                PRIMARY KEY (id),
                UNIQUE KEY uq_rides_slug (slug),
                KEY idx_rides_category (category),
                KEY idx_rides_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("Created table: rides");

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS ride_gallery (
                id BIGINT NOT NULL AUTO_INCREMENT,
                ride_id BIGINT NOT NULL,
                image_url VARCHAR(255) NOT NULL,
                display_order INT NOT NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                
                PRIMARY KEY (id),
                KEY idx_ride_gallery_ride (ride_id),
                CONSTRAINT fk_ride_gallery_ride FOREIGN KEY (ride_id) REFERENCES rides (id) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("Created table: ride_gallery");

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS ride_safety_rules (
                id BIGINT NOT NULL AUTO_INCREMENT,
                ride_id BIGINT NOT NULL,
                rule_text VARCHAR(500) NOT NULL,
                display_order INT NOT NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                
                PRIMARY KEY (id),
                KEY idx_ride_safety_rules_ride (ride_id),
                CONSTRAINT fk_ride_safety_rules_ride FOREIGN KEY (ride_id) REFERENCES rides (id) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("Created table: ride_safety_rules");

        console.log("Migration completed successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        connection.release();
        process.exit();
    }
}

migrate();
