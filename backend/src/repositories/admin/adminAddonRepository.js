const db = require('../../config/database');

const adminAddonRepository = {
    async getAllAddons(search = '', status = '', addon_type = '') {
        let query = `
            SELECT id, code, name, description, addon_type, price, status, display_order, created_at, updated_at
            FROM addons
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
        
        if (addon_type) {
            query += ` AND addon_type = ?`;
            params.push(addon_type);
        }

        query += ` ORDER BY display_order ASC, created_at DESC`;

        const [rows] = await db.query(query, params);
        return rows;
    },

    async getAddonById(id) {
        const [rows] = await db.query(
            `SELECT id, code, name, description, addon_type, price, status, display_order, created_at, updated_at
             FROM addons WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    },

    async createAddon(addonData) {
        const { code, name, description, addon_type, price, status, display_order } = addonData;
        const [result] = await db.query(
            `INSERT INTO addons (code, name, description, addon_type, price, status, display_order, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [code, name, description, addon_type, price, status, display_order]
        );
        return result.insertId;
    },

    async updateAddon(id, addonData) {
        const { name, description, price, display_order } = addonData;
        const [result] = await db.query(
            `UPDATE addons
             SET name = ?, description = ?, price = ?, display_order = ?, updated_at = NOW()
             WHERE id = ?`,
            [name, description, price, display_order, id]
        );
        return result.affectedRows > 0;
    },

    async updateAddonStatus(id, status) {
        const [result] = await db.query(
            `UPDATE addons SET status = ?, updated_at = NOW() WHERE id = ?`,
            [status, id]
        );
        return result.affectedRows > 0;
    },
    
    async checkDuplicateName(name, excludeId = null) {
        let query = `SELECT id FROM addons WHERE name = ?`;
        const params = [name];
        
        if (excludeId) {
            query += ` AND id != ?`;
            params.push(excludeId);
        }
        
        const [rows] = await db.query(query, params);
        return rows.length > 0;
    }
};

module.exports = adminAddonRepository;
