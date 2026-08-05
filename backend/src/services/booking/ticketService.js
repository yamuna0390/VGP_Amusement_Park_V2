const ticketRepository = require("../../repositories/catalog/ticketRepository");

/**
 * ------------------------------------------------------------
 * Get Regular Tickets
 * ------------------------------------------------------------
 * Returns all active ticket types.
 */
async function getRegularTickets(connection) {
    return await ticketRepository.getRegularTickets(connection);
}

/**
 * ------------------------------------------------------------
 * Get Offer Tickets
 * ------------------------------------------------------------
 * Returns all offer tickets valid for the selected visit date.
 */
async function getOfferTickets(connection, visitDate) {

    const rows = await ticketRepository.getOfferTickets(
        connection,
        visitDate
    );

    return rows.map(buildOfferTicket);
}

/**
 * ------------------------------------------------------------
 * Convert Database Row → Frontend Model
 * ------------------------------------------------------------
 */
/**
 * Calculate unit selling price.
 */
function calculateUnitPrice(row) {

    const originalPrice = Number(row.originalPrice);

    switch (row.discount_type) {

        case "PERCENTAGE":
            return Number(
                (originalPrice * (100 - Number(row.discount_value)) / 100).toFixed(2)
            );

        case "FLAT":
            return Number(
                (originalPrice - Number(row.discount_value)).toFixed(2)
            );

        case "FIXED_PRICE":
            return originalPrice;

        default:
            return originalPrice;
    }

}


/**
 * Initial quantity shown in UI.
 */
function getInitialQty(row) {

    if (row.offer_type === "BUY_X_GET_Y") {
        return Number(row.min_qty);
    }

    return 1;

}


/**
 * Offer Label
 */
function getOfferLabel(row) {

    switch (row.offer_type) {

        case "BUY_X_GET_Y":
            return `Buy ${row.min_qty} Get ${row.free_qty}`;

        default:

            switch (row.discount_type) {

                case "PERCENTAGE":
                    
                  return `${Number(row.discount_value)}% OFF`;

                case "FLAT":
                    return `₹${row.discount_value} OFF`;

                default:
                    return "";
            }

    }

}
/**
 * Convert Database Row → Frontend Model
 */
function buildOfferTicket(row) {

    const unitPrice = calculateUnitPrice(row);

    const initialQty = getInitialQty(row);

    const initialPayAmount = Number(
        (unitPrice * initialQty).toFixed(2)
    );

    return {

        offerTicketId: row.offerTicketId,

        displayName: row.display_name,

        unitPrice,

        initialQty,

        initialPayAmount,

        buyQty: Number(row.min_qty),

        freeQty: Number(row.free_qty),

        offerLabel: getOfferLabel(row),

        instruction: row.instruction || ""

    };

}

module.exports = {

    getRegularTickets,

    getOfferTickets

};