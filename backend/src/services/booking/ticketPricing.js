const ticketRepository = require("../../repositories/ticketRepository");

const calculateTicketPricing = async (tickets = []) => {
    if (!tickets.length) {
        return {
            subtotal: 0,
            items: [],
        };
    }

    // Remove duplicate codes
    const codes = [...new Set(tickets.map(ticket => ticket.ticketType))];

    // Fetch all tickets in one query
    const ticketRows = await ticketRepository.getTicketsByCodes(codes);

    // Create lookup map
    const ticketMap = {};

    ticketRows.forEach(ticket => {
        ticketMap[ticket.code] = ticket;
    });

    let subtotal = 0;
    const items = [];

    for (const ticket of tickets) {

        const ticketInfo = ticketMap[ticket.ticketType];

        if (!ticketInfo) {
            throw new Error(`Invalid ticket type: ${ticket.ticketType}`);
        }

        const quantity = Number(ticket.quantity);
        const unitPrice = Number(ticketInfo.price);

        const totalPrice = Number((quantity * unitPrice).toFixed(2));

        subtotal += totalPrice;

        items.push({
            ticketType: ticketInfo.code,
            ticketName: ticketInfo.name,
            quantity,
            unitPrice,
            totalPrice,
        });
    }

    subtotal = Number(subtotal.toFixed(2));

    return {
        subtotal,
        items,
    };
};

module.exports = {
    calculateTicketPricing,
};