const { roundMoney } = require("../../utils/money");
const { recalculatePostDiscountTotals, getPricingConfig } = require("./pricingEngine");

/**
 * Offer Engine - Business logic for applying promotions and discount rules.
 *
 * Responsibilities:
 * - Validate offers against booking requirements (minimum amount, validity dates, supported rules)
 * - Trust repository contract directly without redundant property fallbacks
 * - Gracefully handle invalid offers without failing the booking process
 * - Determine discount allocation type (TICKET, MEAL, or BOOKING level)
 * - Enforce promotional priority policy: only ONE promotional benefit allowed (Offer > Coupon)
 * - Apply defensive discount validation (preventing negative discounts, NaN, undefined)
 * - Apply percentage discounts, flat/fixed amount discounts, and BUY_X_GET_Y / BOGO / B2G1 rules
 * - Update discount totals and delegate post-discount taxable amounts, GST, and totals calculations to pricingEngine using immutable pricingConfig
 */

/**
 * Validates that an offer is applicable to the current booking request and pricing result.
 * Gracefully returns an inspection object indicating validity and failure reasons instead of throwing business errors.
 * Fails fast with standard Error if repository contract is violated or unexpected system errors occur.
 *
 * @param {Object} pricing - Current PricingResultDTO
 * @param {Object} bookingRequest - Original booking request
 * @param {Object} offer - Offer data object loaded from catalog repositories
 * @returns {{ valid: boolean, reason: string|null }}
 */
function validateOffer(pricing, bookingRequest, offer) {
    if (!pricing || typeof pricing !== "object") {
        throw new Error("Pricing result object is required and must be a valid object.");
    }
    if (!offer || typeof offer !== "object") {
        throw new Error("Offer object is required and must be a valid object.");
    }

    // Trust repository contract; fail fast on invalid repository data
    if (!offer.offer_rule || typeof offer.offer_rule !== "string") {
        throw new Error("Invalid repository contract: missing offer_rule on offer object.");
    }

    const rule = offer.offer_rule.toUpperCase();
    const supportedRules = ["PERCENTAGE", "FLAT", "BUY_X_GET_Y", "BOGO", "B2G1"];

    if (rule === "KIDS_FREE") {
        return { valid: false, reason: "Offer unsupported: KIDS_FREE is not implemented yet" };
    }
    if (!supportedRules.includes(rule)) {
        return { valid: false, reason: `Offer unsupported: ${offer.offer_rule}` };
    }

    // Validate minimum spend requirement
    if (offer.minimum_amount !== undefined && offer.minimum_amount !== null) {
        const minAmount = Number(offer.minimum_amount);
        if (!isNaN(minAmount) && minAmount > 0 && pricing.subtotal < minAmount) {
            return { valid: false, reason: "Offer minimum amount not reached" };
        }
    }

    // Validate date range if visitDate is available
    if (bookingRequest && bookingRequest.visitDate && offer.valid_from && offer.valid_to) {
        const visitTime = new Date(bookingRequest.visitDate).setHours(12, 0, 0, 0);
        const startTime = new Date(offer.valid_from).setHours(0, 0, 0, 0);
        const endTime = new Date(offer.valid_to).setHours(23, 59, 59, 999);

        if (!isNaN(visitTime) && !isNaN(startTime) && !isNaN(endTime)) {
            if (visitTime < startTime || visitTime > endTime) {
                return { valid: false, reason: "Offer outside date" };
            }
        }
    }

    return { valid: true, reason: null };
}

/**
 * Determines whether the offer targets tickets exclusively, meals exclusively, or the whole booking.
 *
 * @param {Object} offer - Promotional offer object
 * @returns {string} 'TICKET', 'MEAL', or 'BOOKING'
 */
function determineAllocationType(offer) {
    if (!offer) {
        return "BOOKING";
    }

    const target = (
        offer.discount_on ||
        offer.applicable_on ||
        offer.target ||
        offer.discount_target ||
        offer.allocation_type ||
        offer.applicable_to ||
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

    const rule = (offer.offer_rule || "").toString().toUpperCase();
    if (["BUY_X_GET_Y", "BOGO", "B2G1", "KIDS_FREE"].includes(rule)) {
        return "TICKET";
    }

    const hasTickets = Boolean(
        offer.applicable_tickets &&
        offer.applicable_tickets.toString().trim().toLowerCase() !== "none" &&
        offer.applicable_tickets.toString().trim().toLowerCase() !== "null" &&
        offer.applicable_tickets.toString().trim() !== ""
    );
    const hasMeals = Boolean(
        offer.applicable_meals &&
        offer.applicable_meals.toString().trim().toLowerCase() !== "none" &&
        offer.applicable_meals.toString().trim().toLowerCase() !== "null" &&
        offer.applicable_meals.toString().trim() !== ""
    );

    if (hasTickets && hasMeals) {
        return "BOOKING";
    }
    if (hasMeals && !hasTickets) {
        return "MEAL";
    }

    return "TICKET";
}

/**
 * Adds a standardized DISCOUNT line item to the invoice items list after cleaning any previous discount items.
 * Enforces single discount promotional priority (Offer > Coupon).
 *
 * @param {Object} pricing - PricingResultDTO to mutate
 * @param {Object} offer - Applied offer data object
 * @param {number} discountAmount - Positive discount figure to record as negative on invoice
 */
function addDiscountInvoiceItem(pricing, offer, discountAmount) {
    if (discountAmount <= 0) {
        return;
    }
    const amount = roundMoney(discountAmount);
    const negativeAmount = amount > 0 ? -amount : 0;

    // Enforce single discount policy: remove existing DISCOUNT rows before recording the winning offer discount
    pricing.invoiceItems = (pricing.invoiceItems || []).filter(item => item.itemType !== "DISCOUNT");

    pricing.invoiceItems.push({
        itemType: "DISCOUNT",
        itemId: offer.id !== undefined && offer.id !== null ? Number(offer.id) : null,
        itemCode: offer.offer_code || null,
        description: offer.offer_name || "Offer Discount",
        quantity: 1,
        unitPrice: negativeAmount,
        totalPrice: negativeAmount
    });
}

/**
 * Enforces single promotional discount priority (Offer > Coupon) before applying an offer.
 * Resets any existing coupon discount so the offer takes full precedence.
 *
 * @param {Object} pricing - PricingResultDTO to mutate
 */
function enforceOfferPriority(pricing) {
    pricing.couponDiscount = 0;
}

/**
 * Applies a percentage-based discount to the targeted subtotal (tickets, meals, or whole booking).
 * Respects max_discount cap if available on the offer and applies defensive validation.
 *
 * @param {Object} pricing - PricingResultDTO to mutate
 * @param {Object} offer - Applied percentage offer object
 * @param {Object} pricingConfig - Immutable configuration object from Park Settings
 * @param {string} allocationType - Discount allocation target type
 */
function applyPercentageOffer(pricing, offer, pricingConfig, allocationType = "BOOKING") {
    const percentage = Number(offer.discount_value || 0);
    let baseAmount = pricing.subtotal;

    if (allocationType === "TICKET") {
        baseAmount = pricing.ticketSubtotal;
    } else if (allocationType === "MEAL") {
        baseAmount = pricing.mealSubtotal;
    }

    let discount = roundMoney((baseAmount * percentage) / 100);
    // Defensive discount validation: prevent negative discounts, NaN, undefined
    discount = Math.max(0, Number(discount) || 0);

    // Respect max_discount cap if specified
    if (offer.max_discount !== undefined && offer.max_discount !== null) {
        const maxDiscount = Number(offer.max_discount);
        if (!isNaN(maxDiscount) && maxDiscount > 0 && discount > maxDiscount) {
            discount = roundMoney(maxDiscount);
        }
    }

    // Discount cannot exceed the targeted base amount (existing Math.min protection)
    discount = Math.min(discount, baseAmount);

    enforceOfferPriority(pricing);
    pricing.offerDiscount = roundMoney(discount);
    pricing.totalDiscount = roundMoney(pricing.offerDiscount);

    addDiscountInvoiceItem(pricing, offer, pricing.offerDiscount);
    recalculatePostDiscountTotals(pricing, pricingConfig, allocationType);
}

/**
 * Applies a flat (fixed amount) discount capped by the targeted subtotal with defensive validation.
 *
 * @param {Object} pricing - PricingResultDTO to mutate
 * @param {Object} offer - Applied flat offer object
 * @param {Object} pricingConfig - Immutable configuration object from Park Settings
 * @param {string} allocationType - Discount allocation target type
 */
function applyFlatOffer(pricing, offer, pricingConfig, allocationType = "BOOKING") {
    const fixedAmount = Number(offer.discount_value || 0);
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

    enforceOfferPriority(pricing);
    pricing.offerDiscount = roundMoney(discount);
    pricing.totalDiscount = roundMoney(pricing.offerDiscount);

    addDiscountInvoiceItem(pricing, offer, pricing.offerDiscount);
    recalculatePostDiscountTotals(pricing, pricingConfig, allocationType);
}

/**
 * Applies BUY_X_GET_Y / BOGO / B2G1 promotions using group size rules, freeing the cheapest applicable ticket.
 *
 * @param {Object} pricing - PricingResultDTO to mutate
 * @param {Object} bookingRequest - Original booking request
 * @param {Object} offer - Applied promotional offer object
 * @param {Object} pricingConfig - Immutable configuration object from Park Settings
 * @param {string} [allocationType="TICKET"] - Discount allocation target type
 */
function applyBuyXGetY(pricing, bookingRequest, offer, pricingConfig, allocationType = "TICKET") {
    const applicableCodes = Array.isArray(offer.applicable_tickets)
        ? offer.applicable_tickets.map(String)
        : (offer.applicable_tickets && typeof offer.applicable_tickets === "string"
            ? offer.applicable_tickets.split(",").map(s => s.trim()).filter(Boolean)
            : []);

    // Extract selected active ticket line items from invoice items
    const applicableItems = (pricing.invoiceItems || [])
        .filter(item => (item.itemType === "TICKET" || item.itemType === "TICKET_TYPE") && Number(item.quantity) > 0)
        .filter(item => {
            if (applicableCodes.length === 0 || applicableCodes.includes("all")) {
                return true;
            }
            return applicableCodes.includes(String(item.itemCode)) || applicableCodes.includes(String(item.itemId));
        });

    if (applicableItems.length === 0) {
        return; // No applicable tickets found in cart
    }

    const rule = (offer.offer_rule || "").toString().toUpperCase();
    let minQty = Number(offer.min_qty || 0);
    let freeQty = Number(offer.free_qty || 0);

    if (rule === "BOGO") {
        minQty = minQty > 0 ? minQty : 1;
        freeQty = freeQty > 0 ? freeQty : 1;
    } else if (rule === "B2G1") {
        minQty = minQty > 0 ? minQty : 2;
        freeQty = freeQty > 0 ? freeQty : 1;
    }

    if (minQty <= 0 || freeQty <= 0) {
        return; // Invalid or unconfigured BUY_X_GET_Y parameters
    }

    const totalApplicableQty = applicableItems.reduce((sum, item) => sum + Number(item.quantity), 0);
    const groupSize = minQty + freeQty;
    const eligibleGroups = Math.floor(totalApplicableQty / groupSize);
    const freeTicketsCount = eligibleGroups * freeQty;

    if (freeTicketsCount <= 0) {
        return;
    }

    // Sort ascending by unit price to ensure only the cheapest applicable ticket is freed
    applicableItems.sort((a, b) => Number(a.unitPrice) - Number(b.unitPrice));
    const cheapestTicket = applicableItems[0];

    let discount = roundMoney(freeTicketsCount * Number(cheapestTicket.unitPrice));
    // Defensive discount validation: prevent negative discounts, NaN, undefined
    discount = Math.max(0, Number(discount) || 0);
    discount = Math.min(discount, pricing.ticketSubtotal);

    enforceOfferPriority(pricing);

    // Update visitor counts
    pricing.freeVisitors = (Number(pricing.freeVisitors) || 0) + freeTicketsCount;
    pricing.totalVisitors = (Number(pricing.paidVisitors) || 0) + pricing.freeVisitors;

    // Update discount totals and delegate post-discount calculation with immutable pricingConfig
    pricing.offerDiscount = roundMoney(discount);
    pricing.totalDiscount = roundMoney(pricing.offerDiscount);

    addDiscountInvoiceItem(pricing, offer, discount);
    recalculatePostDiscountTotals(pricing, pricingConfig, "TICKET");
}

/**
 * Public API: Applies a valid promotional offer to a calculated pricing result.
 * Gracefully ignores invalid offers (returning the pricing result unchanged) so bookings proceed without failing.
 *
 * @param {Object} pricingResult - Current PricingResultDTO before discount calculation
 * @param {Object} bookingRequest - Incoming booking request DTO
 * @param {Object|null} offer - Offer row/data object retrieved by OfferRepository
 * @param {Object|null} [connectionOrConfig=null] - DB connection or existing immutable pricingConfig
 * @returns {Promise<Object>} Updated PricingResultDTO with discounts, post-discount taxes, and invoice items applied
 */
async function applyOffer(pricingResult, bookingRequest, offer, connectionOrConfig = null) {
    if (!pricingResult || !offer) {
        return pricingResult;
    }

    const validation = validateOffer(pricingResult, bookingRequest, offer);
    if (!validation.valid) {
        return pricingResult;
    }

    const rule = offer.offer_rule.toUpperCase();
    const allocationType = determineAllocationType(offer);
    const pricingConfig = await getPricingConfig(connectionOrConfig);

    switch (rule) {
        case "PERCENTAGE":
            applyPercentageOffer(pricingResult, offer, pricingConfig, allocationType);
            break;

        case "FLAT":
            applyFlatOffer(pricingResult, offer, pricingConfig, allocationType);
            break;

        case "BUY_X_GET_Y":
        case "BOGO":
        case "B2G1":
            applyBuyXGetY(pricingResult, bookingRequest, offer, pricingConfig, allocationType);
            break;

        default:
            // Gracefully handle unsupported offer rules without failing the booking
            break;
    }

    return pricingResult;
}

module.exports = {
    applyOffer
};

