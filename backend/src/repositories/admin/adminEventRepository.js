const db = require('../../config/database');

async function getAdminEvents() {
    const [rows] = await db.execute(`
        SELECT id, event_code, event_name, event_type, description, venue, capacity,
               DATE_FORMAT(start_date, '%Y-%m-%d') as start_date,
               DATE_FORMAT(end_date, '%Y-%m-%d') as end_date,
               start_time, end_time, image_url, status
        FROM events
        ORDER BY created_at DESC
    `);
    return rows;
}

async function getAdminEventById(id) {
    const [rows] = await db.execute(`
        SELECT id, event_code, event_name, event_type, description, venue, capacity,
               DATE_FORMAT(start_date, '%Y-%m-%d') as start_date,
               DATE_FORMAT(end_date, '%Y-%m-%d') as end_date,
               start_time, end_time, image_url, status
        FROM events
        WHERE id = ?
    `, [id]);
    return rows[0];
}

async function createAdminEvent(eventData) {
    const {
        event_code, event_name, event_type, description, venue, capacity,
        start_date, end_date, start_time, end_time, image_url, status
    } = eventData;

    const [result] = await db.execute(`
        INSERT INTO events (
            event_code, event_name, event_type, description, venue, capacity,
            start_date, end_date, start_time, end_time, image_url, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        event_code, event_name, event_type, description || null, venue || null, capacity || null,
        start_date, end_date, start_time || null, end_time || null, image_url, status || 'UPCOMING'
    ]);

    return result.insertId;
}

async function updateAdminEvent(id, eventData) {
    const {
        event_name, event_type, description, venue, capacity,
        start_date, end_date, start_time, end_time, image_url, status
    } = eventData;

    await db.execute(`
        UPDATE events SET
            event_name = ?, event_type = ?, description = ?, venue = ?, capacity = ?,
            start_date = ?, end_date = ?, start_time = ?, end_time = ?, image_url = ?, status = ?
        WHERE id = ?
    `, [
        event_name, event_type, description || null, venue || null, capacity || null,
        start_date, end_date, start_time || null, end_time || null, image_url, status, id
    ]);
}

async function updateAdminEventStatus(id, status) {
    await db.execute(`UPDATE events SET status = ? WHERE id = ?`, [status, id]);
}

module.exports = {
    getAdminEvents,
    getAdminEventById,
    createAdminEvent,
    updateAdminEvent,
    updateAdminEventStatus
};
