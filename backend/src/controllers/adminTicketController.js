const adminTicketRepository = require('../repositories/admin/adminTicketRepository');

async function getTickets(req, res, next) {
    try {
        const { search, status } = req.query;
        const tickets = await adminTicketRepository.getAllTickets(search, status);
        return res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        next(error);
    }
}

async function getTicketById(req, res, next) {
    try {
        const { id } = req.params;
        const ticket = await adminTicketRepository.getTicketById(id);
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }
        return res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        next(error);
    }
}

async function createTicket(req, res, next) {
    try {
        const { code, name, description, price, status, display_order } = req.body;
        
        if (!name || price === undefined) {
            return res.status(400).json({ success: false, message: 'Name and price are required' });
        }

        if (price < 0) {
            return res.status(400).json({ success: false, message: 'Price must be >= 0' });
        }

        const isDuplicate = await adminTicketRepository.checkDuplicateName(name);
        if (isDuplicate) {
            return res.status(400).json({ success: false, message: 'A ticket with this name already exists' });
        }

        const insertId = await adminTicketRepository.createTicket({
            code: code || name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30),
            name,
            description: description || '',
            price,
            status: status || 'Active',
            display_order: parseInt(display_order) || 0
        });

        return res.status(201).json({ success: true, data: { id: insertId }, message: 'Ticket created successfully' });
    } catch (error) {
        next(error);
    }
}

async function updateTicket(req, res, next) {
    try {
        const { id } = req.params;
        const { name, description, price, display_order } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ success: false, message: 'Name and price are required' });
        }

        if (price < 0) {
            return res.status(400).json({ success: false, message: 'Price must be >= 0' });
        }

        const isDuplicate = await adminTicketRepository.checkDuplicateName(name, id);
        if (isDuplicate) {
            return res.status(400).json({ success: false, message: 'A ticket with this name already exists' });
        }

        const success = await adminTicketRepository.updateTicket(id, {
            name,
            description: description || '',
            price,
            display_order: parseInt(display_order) || 0
        });

        if (!success) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        return res.status(200).json({ success: true, message: 'Ticket updated successfully' });
    } catch (error) {
        next(error);
    }
}

async function updateTicketStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const success = await adminTicketRepository.updateTicketStatus(id, status);
        if (!success) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        return res.status(200).json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    updateTicketStatus
};
