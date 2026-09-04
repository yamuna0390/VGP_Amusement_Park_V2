const express = require('express');
const router = express.Router();
const parkSettingsRepository = require('../repositories/catalog/parkSettingsRepository');

router.get('/homepage-video', async (req, res, next) => {
    try {
        const videoUrl = await parkSettingsRepository.getSetting(undefined, 'HOMEPAGE_HEADER_VIDEO_URL');
        
        return res.status(200).json({
            success: true,
            videoUrl: videoUrl || null
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
