const offerRepository = require("../repositories/catalog/offerRepository");
const { success } = require("../utils/response");
const OfferResponseDTO = require("../dto/OfferResponseDTO");

/**
 * Get Public Active Offers
 * No date filter, with ticket mappings.
 */
const getPublicOffers = async (req, res, next) => {
    try {
        const rawOffers =
            await offerRepository.getAllActiveOffers();

        const offerMappings =
            await offerRepository.getOfferTicketMappings();

        const offers = rawOffers.map((offer) => {
            return {
                ...offer,
                offer_tickets: offerMappings.filter(
                    (ticket) => ticket.offerId === offer.id
                )
            };
        });

        return success(
            res,
            "Public offers retrieved successfully.",
            offers
        );

    } catch (error) {
        next(error);
    }
};

/**
 * Get Active Offers
 *
 * Returns offers that are:
 * - Active
 * - Valid for the requested visit date
 * - Joined with their ticket mappings
 * - Transformed through OfferResponseDTO
 */
const getOffers = async (req, res, next) => {
    try {
        const visitDate =
            req.query.visitDate ||
            new Date().toISOString().split("T")[0];

        const rawOffers =
            await offerRepository.getActiveOffers(
                undefined,
                visitDate
            );

        const offerMappings =
            await offerRepository.getOfferTicketMappings();

        const offersWithTickets = rawOffers.map((offer) => ({
            ...offer,
            offer_tickets: offerMappings.filter(
                (ticket) => ticket.offerId === offer.id
            )
        }));

        const offers =
            OfferResponseDTO.fromList(offersWithTickets);

        return success(
            res,
            "Offers retrieved successfully.",
            offers
        );

    } catch (error) {
        next(error);
    }
};

/**
 * Create Offer
 */
const createOffer = async (req, res, next) => {
    try {
        const offerId =
            await offerRepository.createOffer(req.body);

        return success(
            res,
            "Offer created successfully",
            { id: offerId },
            201
        );

    } catch (error) {
        next(error);
    }
};

/**
 * Update Offer
 */
const updateOffer = async (req, res, next) => {
    try {
        await offerRepository.updateOffer(
            req.params.id,
            req.body
        );

        return success(
            res,
            "Offer updated successfully",
            { id: req.params.id }
        );

    } catch (error) {
        next(error);
    }
};

/**
 * Delete Offer
 */
const deleteOffer = async (req, res, next) => {
    try {
        await offerRepository.deleteOffer(
            req.params.id
        );

        return success(
            res,
            "Offer deleted successfully",
            { id: req.params.id }
        );

    } catch (error) {
        next(error);
    }
};

/**
 * Get Active Offer Types
 */
const getOfferTypes = async (req, res, next) => {
    try {
        const offerTypes =
            await offerRepository.getActiveOfferTypes();

        return success(
            res,
            "Offer types retrieved successfully.",
            offerTypes
        );

    } catch (error) {
        next(error);
    }
};

/**
 * Get nearest valid date for an offer
 */
const getNearestValidDate = async (req, res, next) => {
    try {
        const offerId = req.params.id;
        
        const offer = await offerRepository.getOfferById(offerId);
        if (!offer || offer.status !== 'Active') {
            return res.status(404).json({
                success: false,
                message: "This offer is no longer available for booking."
            });
        }
        
        const scheduleRules = await offerRepository.getOfferScheduleRulesByOffer(offerId);
        const allowedDays = scheduleRules.map(rule => rule.dayOfWeek);
        
        const today = new Date();
        const minDays = offer.min_advance_days || 0;
        
        const testDate = new Date(today);
        testDate.setDate(today.getDate() + minDays);
        
        if (offer.valid_from) {
            const validFromDate = new Date(offer.valid_from);
            if (validFromDate > testDate) {
                testDate.setTime(validFromDate.getTime());
            }
        }
        
        const MAX_SEARCH_DAYS = 90;
        let foundDate = null;
        
        for (let i = 0; i < MAX_SEARCH_DAYS; i++) {
            const currentTestDate = new Date(testDate);
            currentTestDate.setDate(testDate.getDate() + i);
            
            if (offer.valid_to) {
                const validToDate = new Date(offer.valid_to);
                // Compare by local date components to avoid timezone shift issues
                if (currentTestDate.setHours(0,0,0,0) > validToDate.setHours(0,0,0,0)) {
                    break;
                }
            }
            
            // map getDay() (0=Sun, 1=Mon) to database (1=Mon, 7=Sun)
            const jsDay = currentTestDate.getDay();
            const dbDay = jsDay === 0 ? 7 : jsDay;
            
            if (allowedDays.length === 0 || allowedDays.includes(dbDay)) {
                // Return in YYYY-MM-DD
                foundDate = currentTestDate.getFullYear() + "-" + 
                            String(currentTestDate.getMonth() + 1).padStart(2, '0') + "-" + 
                            String(currentTestDate.getDate()).padStart(2, '0');
                break;
            }
        }
        
        if (foundDate) {
            return res.json({
                success: true,
                nearestDate: foundDate
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "This offer is no longer available for booking."
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNearestValidDate,
    getPublicOffers,
    getOffers,
    createOffer,
    updateOffer,
    deleteOffer,
    getOfferTypes
};