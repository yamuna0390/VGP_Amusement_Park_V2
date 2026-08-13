const db = require("../../config/database");

/**
 * Get all active addons.
 *
 * @param {PoolConnection|Pool} connection
 * @returns {Promise<Array>}
 */
async function getActiveAddons(connection = db) {
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            code,
            name,
            description,
            addon_type AS addonType,
            price,
            display_order AS displayOrder
        FROM addons
        WHERE status = 'Active'
        ORDER BY display_order ASC
        `
    );

    return rows;
}

/**
 * Get multiple active addons by IDs.
 *
 * @param {PoolConnection|Pool} connection
 * @param {Array<number>} addonIds
 * @returns {Promise<Array>}
 */
async function getActiveAddonsByIds(connection = db, addonIds = []) {
    if (!addonIds.length) {
        return [];
    }
    const placeholders = addonIds.map(() => "?").join(",");
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            code,
            name,
            description,
            addon_type AS addonType,
            price,
            display_order AS displayOrder
        FROM addons
        WHERE status = 'Active'
          AND id IN (${placeholders})
        ORDER BY display_order ASC
        `,
        addonIds
    );
    return rows;
}

module.exports = {
    getActiveAddons,
    getActiveAddonsByIds
};
