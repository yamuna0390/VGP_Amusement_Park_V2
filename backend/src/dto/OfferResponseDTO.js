/**
 * Standardizes an offer database entity for frontend/API responses.
 */

function toNumber(value, defaultValue = 0) {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }

    const number = Number(value);
    return Number.isNaN(number) ? defaultValue : number;
}

function parseApplicableTickets(tickets) {
    if (!tickets) {
        return [];
    }

    if (Array.isArray(tickets)) {
        return tickets
            .map((ticket) => String(ticket).trim())
            .filter(Boolean);
    }

    return String(tickets)
        .split(",")
        .map((ticket) => ticket.trim())
        .filter(Boolean);
}

function mapOfferTicket(ticket = {}) {
    return {
        id: ticket.id !== undefined && ticket.id !== null
            ? Number(ticket.id)
            : null,

        offerId: ticket.offerId !== undefined
            ? toNumber(ticket.offerId, null)
            : toNumber(ticket.offer_id, null),

        buyTicketId: ticket.buyTicketId !== undefined
            ? toNumber(ticket.buyTicketId, null)
            : toNumber(ticket.buy_ticket_id, null),

        freeTicketId: ticket.freeTicketId !== undefined
            ? toNumber(ticket.freeTicketId, null)
            : toNumber(ticket.free_ticket_id, null),

        displayName: ticket.displayName !== undefined
            ? ticket.displayName
            : (ticket.display_name || ""),

        displaySubname: ticket.displaySubname !== undefined
            ? ticket.displaySubname
            : (ticket.display_subname || ""),

        buyQuantity: ticket.buyQuantity !== undefined
            ? toNumber(ticket.buyQuantity, 1)
            : toNumber(ticket.buy_quantity, 1),

        freeQuantity: ticket.freeQuantity !== undefined
            ? toNumber(ticket.freeQuantity, 0)
            : toNumber(ticket.free_quantity, 0),

        offerPrice: ticket.offerPrice !== undefined
            ? toNumber(ticket.offerPrice, 0)
            : toNumber(ticket.offer_price, 0),

        maxQty: ticket.maxQty !== undefined
            ? (
                ticket.maxQty === null || ticket.maxQty === ""
                    ? null
                    : toNumber(ticket.maxQty, null)
            )
            : (
                ticket.max_qty === null || ticket.max_qty === ""
                    ? null
                    : toNumber(ticket.max_qty, null)
            ),

        displayOrder: ticket.displayOrder !== undefined
            ? toNumber(ticket.displayOrder, 1)
            : toNumber(ticket.display_order, 1),

        isActive: ticket.isActive !== undefined
            ? toNumber(ticket.isActive, 1)
            : toNumber(ticket.is_active, 1)
    };
}

class OfferResponseDTO {
    constructor(offer = {}) {
        this.id = toNumber(offer.id, null);

        this.offerCode =
            offer.offer_code !== undefined
                ? offer.offer_code
                : (offer.offerCode || "");

        this.offerName =
            offer.offer_name !== undefined
                ? offer.offer_name
                : (offer.offerName || "");

        this.description =
            offer.description !== undefined && offer.description !== null
                ? String(offer.description)
                : null;

        this.instruction =
            offer.instruction !== undefined && offer.instruction !== null
                ? String(offer.instruction)
                : null;

        this.validFrom =
            offer.valid_from !== undefined
                ? offer.valid_from
                : (offer.validFrom || null);

        this.validTo =
            offer.valid_to !== undefined
                ? offer.valid_to
                : (offer.validTo || null);

        this.minAdvanceDays =
            offer.min_advance_days !== undefined
                ? toNumber(offer.min_advance_days, 0)
                : toNumber(offer.minAdvanceDays, 0);

        this.status = offer.status || "";

        this.displayOrder =
            offer.display_order !== undefined
                ? toNumber(offer.display_order, 1)
                : toNumber(offer.displayOrder, 1);

        /*
         * Offer type
         */
        this.offerTypeId =
            offer.offer_type_id !== undefined
                ? toNumber(offer.offer_type_id, null)
                : toNumber(offer.offerTypeId, null);

        this.offerTypeCode =
            offer.offer_type_code !== undefined
                ? offer.offer_type_code
                : (offer.offerTypeCode || "");

        this.offerTypeName =
            offer.offer_type_name !== undefined
                ? offer.offer_type_name
                : (offer.offerTypeName || "");

        /*
         * Discount configuration
         */
        this.discountPercentage =
            offer.discount_percentage !== undefined &&
            offer.discount_percentage !== null
                ? toNumber(offer.discount_percentage, 0)
                : toNumber(offer.discountPercentage, 0);

        this.flatDiscount =
            offer.flat_discount !== undefined &&
            offer.flat_discount !== null
                ? toNumber(offer.flat_discount, 0)
                : toNumber(offer.flatDiscount, 0);

        this.minimumBookingValue =
            offer.minimum_booking_value !== undefined &&
            offer.minimum_booking_value !== null
                ? toNumber(offer.minimum_booking_value, 0)
                : toNumber(offer.minimumBookingValue, 0);

        /*
         * Backward-compatible fields.
         *
         * Some existing frontend code may still use these names.
         */
        this.offerRule =
            offer.offer_rule !== undefined
                ? offer.offer_rule
                : (offer.offerRule || "");

        this.discountValue =
            offer.discount_value !== undefined &&
            offer.discount_value !== null
                ? toNumber(offer.discount_value, 0)
                : toNumber(offer.discountValue, 0);

        this.minimumAmount =
            offer.minimum_amount !== undefined &&
            offer.minimum_amount !== null
                ? toNumber(offer.minimum_amount, 0)
                : toNumber(offer.minimumAmount, 0);

        this.applicableTickets = parseApplicableTickets(
            offer.applicable_tickets !== undefined
                ? offer.applicable_tickets
                : offer.applicableTickets
        );

        /*
         * Ticket mappings
         */
        const tickets =
            offer.offer_tickets !== undefined
                ? offer.offer_tickets
                : (offer.offerTickets || []);

        this.offerTickets = Array.isArray(tickets)
            ? tickets.map(mapOfferTicket)
            : [];
    }

    static fromEntity(offer) {
        if (!offer) {
            return null;
        }

        return new OfferResponseDTO(offer);
    }

    static fromList(offers = []) {
        if (!Array.isArray(offers)) {
            return [];
        }

        return offers.map((offer) =>
            OfferResponseDTO.fromEntity(offer)
        );
    }
}

module.exports = OfferResponseDTO;