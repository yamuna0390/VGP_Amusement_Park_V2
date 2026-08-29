const adminEventRepository = require('../repositories/admin/adminEventRepository');

async function getAdminEvents(req, res, next) {
    try {
        const events = await adminEventRepository.getAdminEvents();
        return res.status(200).json({ success: true, data: events });
    } catch (error) {
        next(error);
    }
}

async function getAdminEventById(req, res, next) {
    try {
        const event = await adminEventRepository.getAdminEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        return res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
}

async function createAdminEvent(req, res, next) {
    try {
        const { event_name, image_url } = req.body;
        if (!event_name || !image_url) {
            return res.status(400).json({ success: false, message: 'event_name and image_url are required' });
        }

        // Generate a random event_code if not provided
        const event_code = req.body.event_code || `EVT-${Date.now()}`;
        
        const payload = {
            ...req.body,
            event_code
        };

        const eventId = await adminEventRepository.createAdminEvent(payload);
        return res.status(201).json({ success: true, message: 'Event created successfully', data: { id: eventId } });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Event code already exists' });
        }
        next(error);
    }
}

async function updateAdminEvent(req, res, next) {
    try {
        const id = req.params.id;
        const existingEvent = await adminEventRepository.getAdminEventById(id);
        if (!existingEvent) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        
        // Ensure image_url is not wiped out
        const payload = {
            ...req.body,
            image_url: req.body.image_url || existingEvent.image_url
        };

        await adminEventRepository.updateAdminEvent(id, payload);
        return res.status(200).json({ success: true, message: 'Event updated successfully' });
    } catch (error) {
        next(error);
    }
}

async function updateAdminEventStatus(req, res, next) {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (!['LIVE', 'UPCOMING'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        await adminEventRepository.updateAdminEventStatus(id, status);
        return res.status(200).json({ success: true, message: 'Event status updated successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAdminEvents,
    getAdminEventById,
    createAdminEvent,
    updateAdminEvent,
    updateAdminEventStatus
};
