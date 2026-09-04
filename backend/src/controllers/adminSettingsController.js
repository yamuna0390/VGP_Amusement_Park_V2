const parkSettingsRepository = require("../repositories/catalog/parkSettingsRepository");
const { success } = require("../utils/response"); // Wait, earlier I saw responseHandler wasn't there, and they did res.status. Wait, adminRideController imports `const { success } = require("../utils/response");`.

// I'll just use res.status for safety.
async function getSettings(req, res, next) {
    try {
        const { keys } = req.query; // optional comma-separated list of keys
        let settings = {};
        if (keys) {
            const keysArray = keys.split(",");
            settings = await parkSettingsRepository.getSettings(undefined, keysArray);
        } else {
            // Assuming getSettings without params or we can just fetch a specific one
            const videoUrl = await parkSettingsRepository.getSetting(undefined, 'HOMEPAGE_HEADER_VIDEO_URL');
            settings = { 'HOMEPAGE_HEADER_VIDEO_URL': videoUrl };
        }
        
        return res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        next(error);
    }
}

async function updateSetting(req, res, next) {
    try {
        const { key, value } = req.body;
        if (!key) {
            return res.status(400).json({ success: false, message: "Setting key is required" });
        }
        
        await parkSettingsRepository.updateSetting(undefined, key, value);
        
        return res.status(200).json({
            success: true,
            message: "Setting updated successfully"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getSettings,
    updateSetting
};
