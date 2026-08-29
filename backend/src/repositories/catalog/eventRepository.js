const db = require('../../config/database');

async function getPublicEvents() {
    // Return events where end_date is today or in the future
    // Order by start_date ascending
    const [rows] = await db.execute(`
        SELECT id, event_code, event_name, event_type, description, venue, capacity,
               DATE_FORMAT(start_date, '%Y-%m-%d') as start_date,
               DATE_FORMAT(end_date, '%Y-%m-%d') as end_date,
               start_time, end_time, image_url, status
        FROM events
        WHERE end_date >= CURDATE()
        ORDER BY start_date ASC
    `);
    return rows;
}

module.exports = {
    getPublicEvents
};
