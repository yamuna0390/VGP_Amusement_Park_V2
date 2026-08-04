const ticketRepository = require("../repositories/catalog/ticketRepository");
const { success } = require("../utils/response");

/**
 * Get Active Ticket Types
 *
 * GET /api/tickets
 */
const getTickets = async (req, res, next) => {

    try {

        const tickets = await ticketRepository.getActiveTickets();

        return success(
            res,
            "Tickets retrieved successfully.",
            tickets
        );

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getTickets
};