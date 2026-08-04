/**
 * Helper to transform comma-separated or array applicable_tickets into cleanly trimmed string array.
 */
function parseApplicableTickets(tickets) {
    if (!tickets) {
        return [];
    }
    if (Array.isArray(tickets)) {
        return tickets.map(t => String(t).trim()).filter(Boolean);
    }
    return String(tickets).split(",").map(t => t.trim()).filter(Boolean);
}

class OfferResponseDTO {
    /**
     * Maps a database offer entity to a standardized frontend response DTO.
     *
     * @param {Object} offer - Raw offer database row or object
     */
    constructor(offer = {}) {
        this.id = offer.id !== undefined && offer.id !== null ? Number(offer.id) : null;
        this.offerCode = offer.offer_code !== undefined ? offer.offer_code : (offer.offerCode || "");
        this.offerName = offer.offer_name !== undefined ? offer.offer_name : (offer.offerName || "");
        this.description = offer.description !== undefined && offer.description !== null ? String(offer.description) : null;
        this.offerRule = offer.offer_rule !== undefined ? offer.offer_rule : (offer.offerRule || "");
        this.discountValue = offer.discount_value !== undefined && offer.discount_value !== null ? Number(offer.discount_value) : 0;
        this.minimumAmount = offer.minimum_amount !== undefined && offer.minimum_amount !== null ? Number(offer.minimum_amount) : 0;
        this.applicableTickets = parseApplicableTickets(offer.applicable_tickets !== undefined ? offer.applicable_tickets : offer.applicableTickets);
    }

    /**
     * Static factory method to map an offer entity to OfferResponseDTO.
     *
     * @param {Object} offer - Raw offer database row
     * @returns {OfferResponseDTO|null} Standardized offer response DTO
     */
    static fromEntity(offer) {
        if (!offer) {
            return null;
        }
        return new OfferResponseDTO(offer);
    }

    /**
     * Static factory method to map an array of offer entities to an array of OfferResponseDTOs.
     *
     * @param {Array<Object>} offers - Array of raw offer database rows
     * @returns {Array<OfferResponseDTO>}
     */
    static fromList(offers = []) {
        if (!Array.isArray(offers)) {
            return [];
        }
        return offers.map(offer => OfferResponseDTO.fromEntity(offer));
    }
}

module.exports = OfferResponseDTO;
