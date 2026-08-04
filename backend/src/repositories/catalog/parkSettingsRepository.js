const db = require("../../config/database");

/**
 * Get a single park setting by key.
 *
 * @param {PoolConnection|Pool} connection
 * @param {string} settingKey
 * @returns {Promise<string|null>}
 */
async function getSetting(connection = db, settingKey) {

    const [rows] = await connection.execute(
        `
        SELECT setting_value
        FROM park_settings
        WHERE setting_key = ?
        LIMIT 1
        `,
        [settingKey]
    );

    return rows.length ? rows[0].setting_value : null;
}

/**
 * Get multiple park settings.
 *
 * @param {PoolConnection|Pool} connection
 * @param {string[]} settingKeys
 * @returns {Promise<Object>}
 */
async function getSettings(connection = db, settingKeys = []) {

    if (!settingKeys.length) {
        return {};
    }

    const placeholders = settingKeys.map(() => "?").join(",");

    const [rows] = await connection.execute(
        `
        SELECT
            setting_key,
            setting_value
        FROM park_settings
        WHERE setting_key IN (${placeholders})
        `,
        settingKeys
    );

    return rows.reduce((settings, row) => {
        settings[row.setting_key] = row.setting_value;
        return settings;
    }, {});
}

module.exports = {
    getSetting,
    getSettings
};