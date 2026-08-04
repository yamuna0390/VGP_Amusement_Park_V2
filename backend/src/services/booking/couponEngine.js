const { roundMoney } = require("../../utils/money");
const { recalculatePostDiscountTotals, getPricingConfig } = require("./pricingEngine");

/**
 * Validates whether a coupon is applicable to the booking.
 *
 * Business validation failures return:
 * {
 *   valid: false,
 *   reason: "..."
 * }
 *
 * System errors throw Error.
 */
function validateCoupon(pricing, bookingRequest, coupon) {
    if (!pricing || typeof pricing !== "object") {
        throw new Error("PricingResultDTO is required.");
    }

    if (!coupon || typeof coupon !== "object") {
        throw new Error("Coupon object is required.");
    }

    if (!coupon.discount_type) {
        throw new Error("Invalid repository contract: missing discount_type.");
    }

    const type = coupon.discount_type.toUpperCase();

    if (!["PERCENTAGE", "FLAT"].includes(type)) {
        return {
            valid: false,
            reason: "Unsupported coupon type."
        };
    }

    if (
        coupon.minimum_amount &&
        pricing.subtotal < Number(coupon.minimum_amount)
    ) {
        return {
            valid: false,
            reason: "Minimum booking amount not reached."
        };
    }

    if (
        coupon.usage_limit !== null &&
        coupon.usage_limit !== undefined &&
        Number(coupon.used_count) >= Number(coupon.usage_limit)
    ) {
        return {
            valid: false,
            reason: "Coupon usage limit exceeded."
        };
    }

    if (
        bookingRequest?.visitDate &&
        coupon.valid_from &&
        coupon.valid_to
    ) {
        const visit = new Date(bookingRequest.visitDate).setHours(12, 0, 0, 0);
        const from = new Date(coupon.valid_from).setHours(0, 0, 0, 0);
        const to = new Date(coupon.valid_to).setHours(23, 59, 59, 999);

        if (!isNaN(visit) && !isNaN(from) && !isNaN(to)) {
            if (visit < from || visit > to) {
                return {
                    valid: false,
                    reason: "Coupon expired or not yet active."
                };
            }
        }
    }

    return {
        valid: true,
        reason: null
    };
}

/**
 * Determines whether the coupon targets tickets exclusively, meals exclusively, or the whole booking.
 *
 * @param {Object} coupon - Promotional coupon object
 * @returns {string} 'TICKET', 'MEAL', or 'BOOKING'
 */
function determineAllocationType(coupon) {
    if (!coupon) {
        return "BOOKING";
    }

    const target = (
        coupon.discount_on ||
        coupon.applicable_on ||
        coupon.target ||
        coupon.discount_target ||
        coupon.allocation_type ||
        coupon.applicable_to ||
        ""
    ).toString().trim().toUpperCase();

    if (["TICKET", "TICKETS", "TICKET_ONLY", "PARK_TICKET", "PARK_TICKETS"].includes(target)) {
        return "TICKET";
    }
    if (["MEAL", "MEALS", "FOOD", "MEAL_ONLY", "FOOD_ONLY"].includes(target)) {
        return "MEAL";
    }
    if (["ALL", "BOOKING", "TOTAL", "WHOLE_BOOKING", "ENTIRE_BOOKING", "BOTH"].includes(target)) {
        return "BOOKING";
    }

    const hasTickets = Boolean(
        coupon.applicable_tickets &&
        coupon.applicable_tickets.toString().trim().toLowerCase() !== "none" &&
        coupon.applicable_tickets.toString().trim().toLowerCase() !== "null" &&
        coupon.applicable_tickets.toString().trim() !== ""
    );
    const hasMeals = Boolean(
        coupon.applicable_meals &&
        coupon.applicable_meals.toString().trim().toLowerCase() !== "none" &&
        coupon.applicable_meals.toString().trim().toLowerCase() !== "null" &&
        coupon.applicable_meals.toString().trim() !== ""
    );

    if (hasTickets && hasMeals) {
        return "BOOKING";
    }
    if (hasTickets && !hasMeals) {
        return "TICKET";
    }
    if (hasMeals && !hasTickets) {
        return "MEAL";
    }

    return "BOOKING";
}

/**
 * Adds a coupon discount invoice line item after cleaning existing discount line items.
 */
function addDiscountInvoiceItem(pricing, coupon, amount) {
    if (amount <= 0) {
        return;
    }

    const roundedAmount = roundMoney(amount);
    const negativeAmount = roundedAmount > 0 ? -roundedAmount : 0;

    // Enforce single discount policy: clean out any existing DISCOUNT rows
    pricing.invoiceItems = (pricing.invoiceItems || []).filter(item => item.itemType !== "DISCOUNT");

    pricing.invoiceItems.push({
        itemType: "DISCOUNT",
        itemId: coupon.id !== undefined && coupon.id !== null ? Number(coupon.id) : null,
        itemCode: coupon.coupon_code || null,
        description: coupon.coupon_name || "Coupon Discount",
        quantity: 1,
        unitPrice: negativeAmount,
        totalPrice: negativeAmount
    });
}

/**
 * Applies a percentage coupon discount against the targeted subtotal with defensive discount validation.
 *
 * @param {Object} pricing - PricingResultDTO to mutate
 * @param {Object} coupon - Applied percentage coupon object
 * @param {Object} pricingConfig - Immutable configuration object from Park Settings
 * @param {string} allocationType - Discount allocation target type
 */
function applyPercentageCoupon(pricing, coupon, pricingConfig, allocationType = "BOOKING") {
    const percentage = Number(coupon.discount_value || 0);
    let baseAmount = pricing.subtotal;

    if (allocationType === "TICKET") {
        baseAmount = pricing.ticketSubtotal;
    } else if (allocationType === "MEAL") {
        baseAmount = pricing.mealSubtotal;
    }

    let discount = roundMoney((baseAmount * percentage) / 100);
    // Defensive discount validation: prevent negative discounts, NaN, undefined
    discount = Math.max(0, Number(discount) || 0);

    // Existing Math.min protection
    discount = Math.min(discount, baseAmount);

    pricing.couponDiscount = roundMoney(discount);
    pricing.totalDiscount = roundMoney(pricing.couponDiscount);

    addDiscountInvoiceItem(pricing, coupon, discount);
    recalculatePostDiscountTotals(pricing, pricingConfig, allocationType);
}

/**
 * Applies a flat coupon discount against the targeted subtotal with defensive discount validation.
 *
 * @param {Object} pricing - PricingResultDTO to mutate
 * @param {Object} coupon - Applied flat coupon object
 * @param {Object} pricingConfig - Immutable configuration object from Park Settings
 * @param {string} allocationType - Discount allocation target type
 */
function applyFlatCoupon(pricing, coupon, pricingConfig, allocationType = "BOOKING") {
    const fixedAmount = Number(coupon.discount_value || 0);
    let baseAmount = pricing.subtotal;

    if (allocationType === "TICKET") {
        baseAmount = pricing.ticketSubtotal;
    } else if (allocationType === "MEAL") {
        baseAmount = pricing.mealSubtotal;
    }

    // Defensive discount validation: prevent negative discounts, NaN, undefined
    let discount = Math.max(0, Number(fixedAmount) || 0);
    discount = roundMoney(discount);

    // Existing Math.min protection
    discount = Math.min(discount, baseAmount);

    pricing.couponDiscount = roundMoney(discount);
    pricing.totalDiscount = roundMoney(pricing.couponDiscount);

    addDiscountInvoiceItem(pricing, coupon, discount);
    recalculatePostDiscountTotals(pricing, pricingConfig, allocationType);
}

/**
 * Public API: Applies a valid promotional coupon to a calculated pricing result.
 * Strictly respects promotional priority rule: if an Offer has already applied successfully, coupon is ignored.
 *
 * @param {Object} pricingResult - Current PricingResultDTO
 * @param {Object} bookingRequest - Incoming booking request DTO
 * @param {Object|null} coupon - Coupon row/data object retrieved by CouponRepository
 * @param {Object|null} [connectionOrConfig=null] - DB connection or existing immutable pricingConfig
 * @returns {Promise<Object>} Updated PricingResultDTO with discounts, post-discount taxes, and invoice items applied
 */
async function applyCoupon(pricingResult, bookingRequest, coupon, connectionOrConfig = null) {
    if (!pricingResult || !coupon) {
        return pricingResult;
    }

    // Enforce promotional priority policy (Offer > Coupon). If an offer was applied, ignore coupon completely.
    if (Number(pricingResult.offerDiscount) > 0) {
        pricingResult.couponDiscount = 0;
        return pricingResult;
    }

    const validation = validateCoupon(pricingResult, bookingRequest, coupon);
    if (!validation.valid) {
        return pricingResult;
    }

    const allocationType = determineAllocationType(coupon);
    const type = (coupon.discount_type || "").toUpperCase();
    const pricingConfig = await getPricingConfig(connectionOrConfig);

    switch (type) {
        case "PERCENTAGE":
            applyPercentageCoupon(pricingResult, coupon, pricingConfig, allocationType);
            break;

        case "FLAT":
            applyFlatCoupon(pricingResult, coupon, pricingConfig, allocationType);
            break;

        default:
            break;
    }

    return pricingResult;
}

module.exports = {
    applyCoupon
};