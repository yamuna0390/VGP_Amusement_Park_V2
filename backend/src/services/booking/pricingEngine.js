const PricingResultDTO = require("../../dto/PricingResultDTO");
const ticketRepository = require("../../repositories/catalog/ticketRepository");
const mealRepository = require("../../repositories/catalog/mealRepository");
const parkSettingsService = require("./parkSettingsService");
const { ITEM_TYPE, INVOICE_CODES } = require("../../constants/bookingConstants");
const { roundMoney } = require("../../utils/money");

/**
 * Custom Error class for financial integrity validation failures.
 */
class PricingIntegrityError extends Error {
    constructor(message) {
        super(message);
        this.name = "PricingIntegrityError";
    }
}

/**
 * Creates a frozen, immutable pricing configuration object from raw park settings.
 *
 * @param {Object} settings - Raw park settings object or cache
 * @returns {Object} Immutable pricing configuration object (pricingConfig)
 */
function createPricingConfig(settings = {}) {
    return Object.freeze({
        ticketGstRate: settings.ticket_gst_percentage !== undefined ? Number(settings.ticket_gst_percentage) : (settings.ticketGstRate !== undefined ? Number(settings.ticketGstRate) : 0),
        foodGstRate: settings.food_gst_percentage !== undefined ? Number(settings.food_gst_percentage) : (settings.foodGstRate !== undefined ? Number(settings.foodGstRate) : 0),
        convenienceFee: settings.convenience_fee !== undefined ? Number(settings.convenience_fee) : (settings.convenienceFee !== undefined ? Number(settings.convenienceFee) : 0),
        currency: settings.currency || null,
        bookingPrefix: settings.booking_prefix || null,
        discountPolicy: settings.discount_policy || null
    });
}

/**
 * Resolves or loads an immutable pricingConfig object using Park Settings Service.
 *
 * @param {Object} connectionOrConfig - Database connection or existing pricingConfig object
 * @returns {Promise<Object>} Immutable pricingConfig object
 */
async function getPricingConfig(connectionOrConfig) {
    if (connectionOrConfig && (connectionOrConfig.ticketGstRate !== undefined || connectionOrConfig.ticket_gst_percentage !== undefined) && Object.isFrozen(connectionOrConfig)) {
        return connectionOrConfig;
    }
    const settings = await parkSettingsService.getParkSettings(connectionOrConfig || {});
    return createPricingConfig(settings);
}

/**
 * Validates the financial integrity of a calculated pricing result.
 * Verifies non-negative monetary totals and strict equality between invoice items sum and grand total.
 * Throws a descriptive PricingIntegrityError if any inconsistency is detected.
 *
 * @param {PricingResultDTO} pricing - The calculated pricing object to validate
 * @returns {PricingResultDTO} The validated pricing object
 * @throws {PricingIntegrityError} If financial invariants are violated
 */
function validateFinancialIntegrity(pricing) {
    if (!pricing || typeof pricing !== "object") {
        throw new PricingIntegrityError("Cannot validate financial integrity: pricing result is null or invalid.");
    }

    if ((Number(pricing.grandTotal) || 0) < 0) {
        throw new PricingIntegrityError(`Financial integrity violation: grandTotal (${pricing.grandTotal}) cannot be negative.`);
    }

    if ((Number(pricing.ticketTaxableAmount) || 0) < 0) {
        throw new PricingIntegrityError(`Financial integrity violation: ticketTaxableAmount (${pricing.ticketTaxableAmount}) cannot be negative.`);
    }

    if ((Number(pricing.mealTaxableAmount) || 0) < 0) {
        throw new PricingIntegrityError(`Financial integrity violation: mealTaxableAmount (${pricing.mealTaxableAmount}) cannot be negative.`);
    }

    const invoiceTotal = roundMoney(
        (pricing.invoiceItems || []).reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0)
    );
    const grandTotal = roundMoney(Number(pricing.grandTotal) || 0);

    if (invoiceTotal !== grandTotal) {
        throw new PricingIntegrityError(
            `Financial integrity violation: invoice items sum (${invoiceTotal}) does not match grandTotal (${grandTotal}).`
        );
    }

    return pricing;
}

/**
 * Helper to add a standardized item line to the invoice items array.
 *
 * @param {PricingResultDTO} pricing - Target pricing result object
 * @param {Object} itemData - Details of the invoice item
 */
function addInvoiceItem(pricing, {
    itemType,
    itemId = null,
    itemCode = null,
    description = "",
    quantity = null,
    unitPrice = null,
    totalPrice = 0
}) {
    pricing.invoiceItems.push({
        itemType,
        itemId: itemId !== undefined && itemId !== null ? Number(itemId) : null,
        itemCode: itemCode || null,
        description: description || "",
        quantity: quantity !== undefined && quantity !== null ? Number(quantity) : null,
        unitPrice: unitPrice !== undefined && unitPrice !== null ? roundMoney(unitPrice) : null,
        totalPrice: roundMoney(totalPrice)
    });
}

/**
 * Loads all catalog data required for pricing (tickets, meals, and park settings).
 * Consumes cached configuration values from Park Settings service to avoid repeated database queries.
 *
 * @param {Object} connection - Database connection
 * @param {BookingRequestDTO} bookingRequest - Incoming booking request
 * @returns {Promise<{ tickets: Array, meals: Array, settings: Object }>}
 */
async function loadCatalogData(connection, bookingRequest) {
    const ticketIds = Array.isArray(bookingRequest.tickets)
        ? Array.from(new Set(bookingRequest.tickets.map(t => Number(t.ticketTypeId)).filter(id => !isNaN(id) && id > 0)))
        : [];

    const mealIds = Array.isArray(bookingRequest.meals)
        ? Array.from(new Set(bookingRequest.meals.map(m => Number(m.mealTypeId)).filter(id => !isNaN(id) && id > 0)))
        : [];

    const [tickets, meals, settings] = await Promise.all([
        ticketRepository.getTicketsByIds(connection, ticketIds),
        mealRepository.getMealsByIds(connection, mealIds),
        parkSettingsService.getParkSettings(connection)
    ]);

    return { tickets, meals, settings };
}

/**
 * Validates that all requested ticket and meal IDs exist in the loaded catalog data using Maps.
 * Throws a standard Error if any ticket or meal type ID is invalid or missing.
 *
 * @param {BookingRequestDTO} bookingRequest - Incoming request containing selected items
 * @param {Object} catalog - Loaded catalog data containing tickets and meals arrays
 */
function validateCatalogData(bookingRequest, catalog) {
    const ticketMap = new Map(
        catalog.tickets.map(ticket => [Number(ticket.id), ticket])
    );
    const mealMap = new Map(
        catalog.meals.map(meal => [Number(meal.id), meal])
    );

    for (const selectedTicket of bookingRequest.tickets) {
        if (!ticketMap.get(Number(selectedTicket.ticketTypeId))) {
            throw new Error(`Invalid ticket type ID: ${selectedTicket.ticketTypeId}`);
        }
    }

    for (const selectedMeal of bookingRequest.meals) {
        if (!mealMap.get(Number(selectedMeal.mealTypeId))) {
            throw new Error(`Invalid meal type ID: ${selectedMeal.mealTypeId}`);
        }
    }
}

/**
 * Step 1: Calculates ticket subtotal, counts paid visitors, and populates ticket line items in the invoice.
 *
 * @param {BookingRequestDTO} bookingRequest - Incoming request containing selected tickets
 * @param {Array} ticketCatalog - Loaded ticket type rows from database
 * @param {PricingResultDTO} pricing - Pricing result object to mutate
 */
function calculateTicketSubtotal(bookingRequest, ticketCatalog, pricing) {
    let subtotal = 0;
    let paidVisitors = 0;
    const ticketMap = new Map(
        ticketCatalog.map(ticket => [Number(ticket.id), ticket])
    );

    for (const selectedTicket of bookingRequest.tickets) {
        const ticket = ticketMap.get(Number(selectedTicket.ticketTypeId));

        if (!ticket) {
            throw new Error(`Invalid ticket type ID: ${selectedTicket.ticketTypeId}`);
        }

        const quantity = Number(selectedTicket.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            continue;
        }

        const unitPrice = roundMoney(ticket.price);
        const totalPrice = roundMoney(unitPrice * quantity);

        subtotal = roundMoney(subtotal + totalPrice);
        paidVisitors += quantity;

        addInvoiceItem(pricing, {
            itemType: ITEM_TYPE.TICKET,
            itemId: ticket.id,
            itemCode: ticket.code,
            description: ticket.name,
            quantity,
            unitPrice,
            totalPrice
        });
    }

    pricing.ticketSubtotal = subtotal;
    pricing.paidVisitors = paidVisitors;
}

/**
 * Step 2: Calculates meal subtotal and populates meal line items in the invoice.
 *
 * @param {BookingRequestDTO} bookingRequest - Incoming request containing selected meals
 * @param {Array} mealCatalog - Loaded meal type rows from database
 * @param {PricingResultDTO} pricing - Pricing result object to mutate
 */
function calculateMealSubtotal(bookingRequest, mealCatalog, pricing) {
    let subtotal = 0;
    const mealMap = new Map(
        mealCatalog.map(meal => [Number(meal.id), meal])
    );

    for (const selectedMeal of bookingRequest.meals) {
        const meal = mealMap.get(Number(selectedMeal.mealTypeId));

        if (!meal) {
            throw new Error(`Invalid meal type ID: ${selectedMeal.mealTypeId}`);
        }

        const quantity = Number(selectedMeal.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            continue;
        }

        const unitPrice = roundMoney(meal.price);
        const totalPrice = roundMoney(unitPrice * quantity);

        subtotal = roundMoney(subtotal + totalPrice);

        addInvoiceItem(pricing, {
            itemType: ITEM_TYPE.MEAL,
            itemId: meal.id,
            itemCode: meal.code,
            description: meal.name,
            quantity,
            unitPrice,
            totalPrice
        });
    }

    pricing.mealSubtotal = subtotal;
}

/**
 * Step 3: Calculates the combined subtotal of tickets and meals before taxes and fees.
 *
 * @param {PricingResultDTO} pricing - Pricing result object to mutate
 */
function calculateSubtotal(pricing) {
    pricing.subtotal = roundMoney(pricing.ticketSubtotal + pricing.mealSubtotal);
}

/**
 * Step 5: Determines discount allocation across tickets and meals based on promotion target type.
 * Includes defensive discount validation to prevent negative values, NaN, and undefined.
 * Case 1 (TICKET): allocated exclusively to tickets.
 * Case 2 (MEAL): allocated exclusively to meals.
 * Case 3 (BOOKING / whole booking): allocated proportionally based on subtotals.
 *
 * @param {PricingResultDTO} pricing - Pricing result object
 * @param {string} allocationType - 'TICKET', 'MEAL', or 'BOOKING'
 * @returns {{ ticketDiscount: number, mealDiscount: number }}
 */
function allocateDiscounts(pricing, allocationType) {
    // Defensive discount validation: prevent negative discounts, NaN, undefined, or invalid numeric values
    let discount = Math.max(0, Number(pricing.totalDiscount) || 0);
    pricing.totalDiscount = roundMoney(discount);

    const ticketSub = Math.max(0, Number(pricing.ticketSubtotal) || 0);
    const mealSub = Math.max(0, Number(pricing.mealSubtotal) || 0);

    let ticketDiscount = 0;
    let mealDiscount = 0;

    if (discount > 0) {
        const type = (allocationType || "BOOKING").toString().trim().toUpperCase();
        if (["TICKET", "TICKETS", "TICKET_ONLY", "PARK_TICKET", "PARK_TICKETS"].includes(type)) {
            ticketDiscount = Math.min(ticketSub, discount);
            mealDiscount = 0;
        } else if (["MEAL", "MEALS", "MEAL_ONLY", "FOOD", "FOOD_ONLY"].includes(type)) {
            mealDiscount = Math.min(mealSub, discount);
            ticketDiscount = 0;
        } else {
            // Case 3: Whole booking discount proportional allocation
            if (pricing.subtotal > 0) {
                ticketDiscount = Math.min(ticketSub, roundMoney((ticketSub / pricing.subtotal) * discount));
                mealDiscount = roundMoney(discount - ticketDiscount);
                if (mealDiscount > mealSub) {
                    mealDiscount = mealSub;
                    ticketDiscount = roundMoney(discount - mealDiscount);
                }
            }
        }
    }

    return { ticketDiscount, mealDiscount };
}

/**
 * Step 6: Calculates taxable amounts strictly after applying allocated discounts.
 *
 * @param {PricingResultDTO} pricing - Pricing result object to mutate
 * @param {{ ticketDiscount: number, mealDiscount: number }} discounts
 */
function calculateTaxableAmounts(pricing, { ticketDiscount, mealDiscount }) {
    pricing.ticketTaxableAmount = Math.max(0, roundMoney(pricing.ticketSubtotal - ticketDiscount));
    pricing.mealTaxableAmount = Math.max(0, roundMoney(pricing.mealSubtotal - mealDiscount));
}

/**
 * Step 7: Calculates ticket GST and food GST strictly on taxable amounts using immutable pricingConfig rates.
 * Automatically cleans and appends tax items to the invoice items array without duplication.
 *
 * @param {PricingResultDTO} pricing - Pricing result object to mutate
 * @param {Object} pricingConfig - Immutable configuration object from Park Settings
 */
function calculateTaxes(pricing, pricingConfig = {}) {
    const ticketGstRate = Math.max(0, Number(pricingConfig.ticketGstRate) || 0);
    const foodGstRate = Math.max(0, Number(pricingConfig.foodGstRate) || 0);

    pricing.ticketTax = roundMoney((pricing.ticketTaxableAmount * ticketGstRate) / 100);
    pricing.foodTax = roundMoney((pricing.mealTaxableAmount * foodGstRate) / 100);
    pricing.totalTax = roundMoney(pricing.ticketTax + pricing.foodTax);

    // Remove any previously generated TAX or FEE lines before inserting refreshed line items
    pricing.invoiceItems = pricing.invoiceItems.filter(
        item => item.itemType !== ITEM_TYPE.TAX && item.itemType !== ITEM_TYPE.FEE
    );

    if (pricing.ticketTax > 0) {
        addInvoiceItem(pricing, {
            itemType: ITEM_TYPE.TAX,
            itemId: null,
            itemCode: INVOICE_CODES.TICKET_GST,
            description: `GST on Tickets (${ticketGstRate}%)`,
            quantity: 1,
            unitPrice: pricing.ticketTax,
            totalPrice: pricing.ticketTax
        });
    }

    if (pricing.foodTax > 0) {
        addInvoiceItem(pricing, {
            itemType: ITEM_TYPE.TAX,
            itemId: null,
            itemCode: INVOICE_CODES.FOOD_GST,
            description: `GST on Food (${foodGstRate}%)`,
            quantity: 1,
            unitPrice: pricing.foodTax,
            totalPrice: pricing.foodTax
        });
    }
}

/**
 * Step 8: Adds convenience fee from immutable pricingConfig if any items are being booked.
 *
 * @param {PricingResultDTO} pricing - Pricing result object to mutate
 * @param {Object} pricingConfig - Immutable configuration object from Park Settings
 */
function calculateConvenienceFee(pricing, pricingConfig = {}) {
    const feeAmount = roundMoney(Math.max(0, Number(pricingConfig.convenienceFee) || 0));

    if (pricing.subtotal > 0 && feeAmount > 0) {
        pricing.convenienceFee = feeAmount;

        addInvoiceItem(pricing, {
            itemType: ITEM_TYPE.FEE,
            itemId: null,
            itemCode: INVOICE_CODES.CONVENIENCE_FEE,
            description: "Convenience Fee",
            quantity: 1,
            unitPrice: feeAmount,
            totalPrice: feeAmount
        });
    } else {
        pricing.convenienceFee = 0;
    }
}

/**
 * Step 9: Calculates Grand Total = ticketTaxableAmount + ticketTax + mealTaxableAmount + foodTax + convenienceFee.
 * Guarantees exact equivalence with the sum of all invoice line item totals.
 *
 * @param {PricingResultDTO} pricing - Pricing result object to mutate
 */
function calculateGrandTotal(pricing) {
    pricing.grandTotal = roundMoney(
        pricing.ticketTaxableAmount +
        pricing.ticketTax +
        pricing.mealTaxableAmount +
        pricing.foodTax +
        pricing.convenienceFee
    );
}

/**
 * Calculates visitor counts directly using existing paidVisitors without scanning invoice items.
 *
 * @param {PricingResultDTO} pricing - Pricing result object to mutate
 */
function calculateVisitorCounts(pricing) {
    if (pricing.freeVisitors === undefined || pricing.freeVisitors === null || isNaN(pricing.freeVisitors)) {
        pricing.freeVisitors = 0;
    }
    pricing.totalVisitors = pricing.paidVisitors + pricing.freeVisitors;
}

/**
 * Canonical calculation sequence helper (Steps 5 through 9 of mandatory financial flow).
 * Executed initially during pricing calculation and invoked by OfferEngine / CouponEngine whenever a promotional benefit is applied.
 * Automatically validates financial integrity before returning.
 *
 * @param {PricingResultDTO} pricing - Pricing result object to recalculate
 * @param {Object} pricingConfig - Immutable configuration object from Park Settings
 * @param {string} [allocationType="BOOKING"] - Discount allocation type ('TICKET', 'MEAL', or 'BOOKING')
 * @returns {PricingResultDTO} Refreshed pricing result with consistent taxes, fees, and invoice items
 */
function recalculatePostDiscountTotals(pricing, pricingConfig = {}, allocationType = "BOOKING") {
    const discounts = allocateDiscounts(pricing, allocationType);
    calculateTaxableAmounts(pricing, discounts);
    calculateTaxes(pricing, pricingConfig);
    calculateConvenienceFee(pricing, pricingConfig);
    calculateGrandTotal(pricing);
    validateFinancialIntegrity(pricing);
    return pricing;
}

/**
 * Public API: Calculates booking pricing before any discounts or promotional offers.
 *
 * Responsibilities:
 * - Validate incoming bookingRequest input
 * - Load ticket & meal catalog data and consume cached configuration values from Park Settings Service
 * - Validate requested ticket and meal type IDs against loaded catalog via Map lookups
 * - Follow mandatory financial calculation sequence (Steps 1 to 3, then 5 to 9 before promotional rules)
 * - Populate standardized invoice items array with clean constant codes
 * - Execute financial integrity validation immediately before returning PricingResultDTO
 *
 * @param {Object} connection - Database connection or pool
 * @param {BookingRequestDTO} bookingRequest - The incoming booking request
 * @returns {Promise<PricingResultDTO>} Completed pricing calculations and invoice items
 */
async function calculatePricing(connection, bookingRequest) {
    if (!bookingRequest) {
        throw new Error("Booking request cannot be null or undefined.");
    }
    if (!Array.isArray(bookingRequest.tickets)) {
        throw new Error("Booking request tickets must be an array.");
    }
    if (bookingRequest.tickets.length === 0) {
        throw new Error("Booking request must contain at least one ticket.");
    }
    if (!bookingRequest.meals || !Array.isArray(bookingRequest.meals)) {
        bookingRequest.meals = [];
    }

    const pricing = new PricingResultDTO();
    const catalog = await loadCatalogData(connection, bookingRequest);
    validateCatalogData(bookingRequest, catalog);

    // Steps 1 - 3: Subtotals
    calculateTicketSubtotal(bookingRequest, catalog.tickets, pricing);
    calculateMealSubtotal(bookingRequest, catalog.meals, pricing);
    calculateSubtotal(pricing);

    // Create immutable pricing configuration object (pricingConfig) from Park Settings
    const pricingConfig = createPricingConfig(catalog.settings || {});

    // Steps 5 - 9: Taxable amounts, GST, convenience fee, and grand total before promotional discounts
    recalculatePostDiscountTotals(pricing, pricingConfig, "BOOKING");
    calculateVisitorCounts(pricing);

    // Validate financial integrity immediately before returning PricingResultDTO
    validateFinancialIntegrity(pricing);

    return pricing;
}

module.exports = {
    calculatePricing,
    recalculatePostDiscountTotals,
    createPricingConfig,
    getPricingConfig,
    validateFinancialIntegrity,
    PricingIntegrityError
};