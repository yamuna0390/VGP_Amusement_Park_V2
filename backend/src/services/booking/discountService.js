const offerRepository = require("../../repositories/offerRepository");
const couponRepository = require("../../repositories/couponRepository");
const settingsRepository = require("../../repositories/settingsRepository");

const calculateDiscount = async ({
    subtotal,
    visitDate,
    couponCode,
}) => {

    const settings = await settingsRepository.getAllSettings();

    const discountPolicy =
        settings.discount_policy || "COUPON_PRIORITY";

    let appliedDiscountType = "NONE";

    let offerId = null;
    let offerName = null;

    let appliedCouponCode = null;

    let discount = 0;

    // ==========================================
    // COUPON PRIORITY
    // ==========================================

    if (discountPolicy === "COUPON_PRIORITY") {

        if (couponCode) {

            const coupon =
                await couponRepository.getValidCoupon(couponCode);

            if (
                coupon &&
                subtotal >= Number(coupon.minimum_amount)
            ) {

                appliedDiscountType = "COUPON";
                appliedCouponCode = coupon.coupon_code;

                if (coupon.discount_type === "Percentage") {

                    discount =
                        subtotal *
                        Number(coupon.discount_value) /
                        100;

                } else {

                    discount =
                        Number(coupon.discount_value);

                }

            }

        }

        // Apply Offer only if coupon wasn't applied
        if (appliedDiscountType === "NONE") {

            const offer =
                await offerRepository.getActiveOffer(visitDate);

            if (
                offer &&
                subtotal >= Number(offer.minimum_amount)
            ) {

                appliedDiscountType = "OFFER";

                offerId = offer.id;
                offerName = offer.offer_name;

                if (offer.discount_type === "Percentage") {

                    discount =
                        subtotal *
                        Number(offer.discount_value) /
                        100;

                } else {

                    discount =
                        Number(offer.discount_value);

                }

            }

        }

    }

    discount = Number(discount.toFixed(2));

    return {

        appliedDiscountType,

        offerId,
        offerName,

        couponCode: appliedCouponCode,

        discount,
    };

};

module.exports = {
    calculateDiscount,
};