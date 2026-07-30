const { calculatePricing } = require("./offerEngine");
const couponRepository = require("../../repositories/couponRepository");
const offerRepository = require("../../repositories/offerRepository");

const calculateBookingPrice = async ({
  tickets = [],
  meals = [],
  visitDate,
  couponCode,
  offerCode,
}) => {
  let appliedCoupon = null;
  let appliedOffer = null;
console.log("Offer Code:", offerCode);
console.log("Visit Date:", visitDate);
  // Resolve promo conflicts: Coupon takes priority
  if (couponCode) {
    appliedCoupon = await couponRepository.getValidCoupon(couponCode);
  } else if (offerCode) {
    appliedOffer = await offerRepository.getOfferByCode(offerCode, visitDate);
  }

  // Calculate pricing using centralized Offer Engine
  const result = await calculatePricing({
    tickets,
    meals,
    appliedOffer,
    appliedCoupon,
  });

  return {
    subtotal: result.subtotal,
    discount: result.discount,
    offerDiscount: result.offerDiscount,
    couponDiscount: result.couponDiscount,
    discountPercent: result.discountPercent,
    appliedDiscountType: appliedCoupon ? "COUPON" : (appliedOffer ? "OFFER" : "NONE"),
    offerId: appliedOffer ? appliedOffer.id : null,
    offerName: appliedOffer ? appliedOffer.offer_name : null,
    offerCode: appliedOffer ? appliedOffer.offer_code : null,
    couponCode: appliedCoupon ? appliedCoupon.coupon_code : null,
    tax: result.tax,
    convenienceFee: result.convenienceFee,
    grandTotal: result.grandTotal,
    savings: result.savings,
    visitorCount: result.visitorCount,
    paidVisitorCount: result.paidVisitorCount,
    freeVisitorCount: result.freeVisitorCount,
    ticketItems: result.invoiceItems, // Contains all line items (tickets, meals, taxes, fees)
    mealItems: [], // meals are already included inside ticketItems for invoice persistence
  };
};

module.exports = {
  calculateBookingPrice,
};