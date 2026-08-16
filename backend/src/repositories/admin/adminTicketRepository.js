const db = require('../../config/database');

const adminTicketRepository = {
    async getAllTickets(search = '', status = '') {
        let query = `
            SELECT id, code, name, description, price, status, display_order, created_at, updated_at
            FROM ticket_types
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ` AND (name LIKE ? OR code LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (status) {
            query += ` AND status = ?`;
            params.push(status);
        }

        query += ` ORDER BY display_order ASC, created_at DESC`;

        const [rows] = await db.query(query, params);
        return rows;
    },

    async getTicketById(id) {
        const [rows] = await db.query(
            `SELECT id, code, name, description, price, status, display_order, created_at, updated_at
             FROM ticket_types WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    },

    async createTicket(ticketData) {
        const { code, name, description, price, status, display_order } = ticketData;
        const [result] = await db.query(
            `INSERT INTO ticket_types (code, name, description, price, status, display_order, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [code, name, description, price, status, display_order]
        );
        return result.insertId;
    },

    async updateTicket(id, ticketData) {
        const { name, description, price, display_order } = ticketData;
        const [result] = await db.query(
            `UPDATE ticket_types
             SET name = ?, description = ?, price = ?, display_order = ?, updated_at = NOW()
             WHERE id = ?`,
            [name, description, price, display_order, id]
        );
        return result.affectedRows > 0;
    },

    async updateTicketStatus(id, status) {
        const [result] = await db.query(
            `UPDATE ticket_types SET status = ?, updated_at = NOW() WHERE id = ?`,
            [status, id]
        );
        return result.affectedRows > 0;
    },
    
    async checkDuplicateName(name, excludeId = null) {
        let query = `SELECT id FROM ticket_types WHERE name = ?`;
        const params = [name];
        
        if (excludeId) {
            query += ` AND id != ?`;
            params.push(excludeId);
        }
        
        const [rows] = await db.query(query, params);
        return rows.length > 0;
    }
};

module.exports = adminTicketRepository;
