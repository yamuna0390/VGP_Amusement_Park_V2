const offerRepository = require("../repositories/catalog/offerRepository");
const { success } = require("../utils/response");
const OfferResponseDTO = require("../dto/OfferResponseDTO");

/**
 * Get Active Offers
 */
const getOffers = async (req, res, next) => {
    try {

        const visitDate =
            req.query.visitDate ||
            new Date().toISOString().split("T")[0];

        const rawOffers = await offerRepository.getActiveOffers(
            undefined,
            visitDate
        );

        const offers = OfferResponseDTO.fromList(rawOffers);

        return success(
            res,
            "Offers retrieved successfully.",
            offers
        );

    } catch (error) {
        next(error);
    }
};

const createOffer = async (req, res, next) => {
  try {
    const offerId = await offerRepository.createOffer(req.body);
    return success(res, "Offer created successfully", { id: offerId }, 201);
  } catch (error) {
    next(error);
  }
};

const updateOffer = async (req, res, next) => {
  try {
    await offerRepository.updateOffer(req.params.id, req.body);
    return success(res, "Offer updated successfully", { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

const deleteOffer = async (req, res, next) => {
  try {
    await offerRepository.deleteOffer(req.params.id);
    return success(res, "Offer deleted successfully", { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};
