const couponRepository = require("../repositories/catalog/couponRepository");
const { success } = require("../utils/response");

/**
 * Get Active Coupons
 *
 * GET /api/coupons
 * GET /api/coupons?visitDate=2026-08-15
 */
const getCoupons = async (req, res, next) => {

    try {

        const visitDate =
            req.query.visitDate ||
            new Date().toISOString().split("T")[0];

        const coupons = await couponRepository.getActiveCoupons(
            undefined,
            visitDate
        );

        return success(
            res,
            "Coupons retrieved successfully.",
            coupons
        );

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getCoupons
};