const eventRepository = require('../repositories/catalog/eventRepository');

async function getPublicEvents(req, res, next) {
    try {
        const events = await eventRepository.getPublicEvents();
        return res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPublicEvents
};
