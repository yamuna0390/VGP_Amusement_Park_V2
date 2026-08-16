const adminAddonRepository = require('../repositories/admin/adminAddonRepository');

const VALID_ADDON_TYPES = ['MEAL_COUPON', 'LOCKER', 'OTHER'];

async function getAddons(req, res, next) {
    try {
        const { search, status, addon_type } = req.query;
        const addons = await adminAddonRepository.getAllAddons(search, status, addon_type);
        return res.status(200).json({ success: true, data: addons });
    } catch (error) {
        next(error);
    }
}

async function getAddonById(req, res, next) {
    try {
        const { id } = req.params;
        const addon = await adminAddonRepository.getAddonById(id);
        if (!addon) {
            return res.status(404).json({ success: false, message: 'Food/Add-on not found' });
        }
        return res.status(200).json({ success: true, data: addon });
    } catch (error) {
        next(error);
    }
}

async function createAddon(req, res, next) {
    try {
        const { code, name, description, addon_type, price, status, display_order } = req.body;
        
        if (!name || price === undefined || !addon_type) {
            return res.status(400).json({ success: false, message: 'Name, Type, and Price are required' });
        }

        if (price < 0) {
            return res.status(400).json({ success: false, message: 'Price must be >= 0' });
        }

        if (!VALID_ADDON_TYPES.includes(addon_type)) {
            return res.status(400).json({ success: false, message: 'Invalid addon type' });
        }

        const isDuplicate = await adminAddonRepository.checkDuplicateName(name);
        if (isDuplicate) {
            return res.status(400).json({ success: false, message: 'An addon with this name already exists' });
        }

        const insertId = await adminAddonRepository.createAddon({
            code: code || name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30),
            name,
            description: description || '',
            addon_type,
            price,
            status: status || 'Active',
            display_order: parseInt(display_order) || 0
        });

        return res.status(201).json({ success: true, data: { id: insertId }, message: 'Addon created successfully' });
    } catch (error) {
        next(error);
    }
}

async function updateAddon(req, res, next) {
    try {
        const { id } = req.params;
        // Notice we do NOT destruct or update addon_type as per safeguard 1
        const { name, description, price, display_order } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ success: false, message: 'Name and price are required' });
        }

        if (price < 0) {
            return res.status(400).json({ success: false, message: 'Price must be >= 0' });
        }

        const isDuplicate = await adminAddonRepository.checkDuplicateName(name, id);
        if (isDuplicate) {
            return res.status(400).json({ success: false, message: 'An addon with this name already exists' });
        }

        const success = await adminAddonRepository.updateAddon(id, {
            name,
            description: description || '',
            price,
            display_order: parseInt(display_order) || 0
        });

        if (!success) {
            return res.status(404).json({ success: false, message: 'Addon not found' });
        }

        return res.status(200).json({ success: true, message: 'Addon updated successfully' });
    } catch (error) {
        next(error);
    }
}

async function updateAddonStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const success = await adminAddonRepository.updateAddonStatus(id, status);
        if (!success) {
            return res.status(404).json({ success: false, message: 'Addon not found' });
        }

        return res.status(200).json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAddons,
    getAddonById,
    createAddon,
    updateAddon,
    updateAddonStatus
};
