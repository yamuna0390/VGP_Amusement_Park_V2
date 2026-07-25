const { calculateTicketPricing } = require("./ticketPricing");
const { calculateMealPricing } = require("./mealPricing");
const { calculateDiscount } = require("./discountService");
const { calculateTax } = require("./taxService");

const calculateBookingPrice = async ({
    tickets = [],
    meals = [],
    visitDate,
    couponCode,
}) => {

    // Ticket pricing
    const ticketPricing = await calculateTicketPricing(tickets);

    // Meal pricing
    const mealPricing = await calculateMealPricing(meals);

    // Total before discount
    const subtotal = Number(
        (
            ticketPricing.subtotal +
            mealPricing.subtotal
        ).toFixed(2)
    );

    // Discount
    const discountResult = await calculateDiscount({
        subtotal,
        visitDate,
        couponCode,
    });

    const amountAfterDiscount = Number(
        (
            subtotal -
            discountResult.discount
        ).toFixed(2)
    );

    // GST
    const taxResult = await calculateTax(amountAfterDiscount);

    return {

        subtotal,

        discount: discountResult.discount,

        appliedDiscountType:
            discountResult.appliedDiscountType,

        offerId:
            discountResult.offerId,

        offerName:
            discountResult.offerName,

        couponCode:
            discountResult.couponCode,

        tax:
            taxResult.tax,

        grandTotal:
            taxResult.grandTotal,

        ticketItems:
            ticketPricing.items,

        mealItems:
            mealPricing.items,
    };
};

module.exports = {
    calculateBookingPrice,
};