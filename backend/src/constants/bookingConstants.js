/**
 * Booking Status
 */
const BOOKING_STATUS = Object.freeze({
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED"
});

/**
 * Booking Constants
 */
const BOOKING = Object.freeze({
    PREFIX: "VGP",
    SEQUENCE_LENGTH: 6
});
/**
 * Payment Status
 */
const PAYMENT_STATUS = Object.freeze({
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED"
});

/**
 * Booking Item Types
 */
const ITEM_TYPE = Object.freeze({
    TICKET: "TICKET",
    MEAL: "MEAL",
    FEE: "FEE"
});

/**
 * Payment Methods
 */
const PAYMENT_METHOD = Object.freeze({
    ONLINE: "ONLINE",
    CASH: "CASH"
});

/**
 * Payment Gateways
 */
const PAYMENT_GATEWAY = Object.freeze({
    NONE: "NONE",
    RAZORPAY: "RAZORPAY"
});

/**
 * Offer Types
 */
const OFFER_TYPE = Object.freeze({
    PERCENTAGE: "PERCENTAGE",
    FIXED_AMOUNT: "FIXED_AMOUNT",
    BUY_X_GET_Y: "BUY_X_GET_Y"
});

module.exports = {
    BOOKING,
    BOOKING_STATUS,
    PAYMENT_STATUS,
    ITEM_TYPE,
    PAYMENT_METHOD,
    PAYMENT_GATEWAY,
    OFFER_TYPE
};