/**
 * ==========================================
 * Booking Constants
 * ==========================================
 */

/**
 * Booking Number Configuration
 */
const BOOKING = Object.freeze({
    PREFIX: "VGP",
    SEQUENCE_LENGTH: 6
});

/**
 * Booking Status
 * Must match bookings.booking_status enum
 */
const BOOKING_STATUS = Object.freeze({
    PAYMENT_PENDING: "PAYMENT_PENDING",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    REFUNDED: "REFUNDED"
});

/**
 * Payment Status
 * Must match booking_payments.payment_status enum
 */
const PAYMENT_STATUS = Object.freeze({
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED"
});

/**
 * Booking Item Types
 * Must match booking_items.item_type enum
 */
const ITEM_TYPE = Object.freeze({
    TICKET: "TICKET",
    MEAL: "MEAL",
    TAX: "TAX",
    FEE: "FEE",
    DISCOUNT: "DISCOUNT"
});

/**
 * Invoice Item Codes
 */
const INVOICE_CODES = Object.freeze({
    TICKET_GST: "TICKET_GST",
    FOOD_GST: "FOOD_GST",
    CONVENIENCE_FEE: "CONVENIENCE_FEE"
});

/**
 * Payment Methods
 * Must match booking_payments.payment_method enum
 */
const PAYMENT_METHOD = Object.freeze({
    UPI: "UPI",
    CARD: "CARD",
    NET_BANKING: "NET_BANKING",
    WALLET: "WALLET",
    CASH: "CASH"
});

/**
 * Payment Gateways
 * Must match booking_payments.payment_gateway enum
 */
const PAYMENT_GATEWAY = Object.freeze({
    RAZORPAY: "RAZORPAY",
    PHONEPE: "PHONEPE",
    PAYTM: "PAYTM",
    CASH: "CASH",
    MANUAL: "MANUAL"
});

/**
 * Default Payment Configuration
 */
const DEFAULT_PAYMENT_GATEWAY = PAYMENT_GATEWAY.RAZORPAY;
const DEFAULT_PAYMENT_METHOD = PAYMENT_METHOD.UPI;
const BOOKING_NOT_FOUND = "Booking not found.";

const INVALID_BOOKING_DETAILS = "Invalid booking number or contact details.";

/**
 * Supported Offer Types
 * Must match offers.offer_rule enum
 */
const OFFER_TYPE = Object.freeze({
    PERCENTAGE: "PERCENTAGE",
    FLAT: "FLAT",
    BUY_X_GET_Y: "BUY_X_GET_Y"
});

/**
 * Discount Policy
 */
const DISCOUNT_POLICY = Object.freeze({
    SINGLE_DISCOUNT_ONLY: "SINGLE_DISCOUNT_ONLY"
});

/**
 * Supported Currency
 */
const CURRENCY = Object.freeze({
    INR: "INR"
});

/**
 * Default Booking Configuration
 * Used while creating a new booking.
 */
const DEFAULT_BOOKING = Object.freeze({
    STATUS: BOOKING_STATUS.PAYMENT_PENDING,
    PAYMENT_STATUS: PAYMENT_STATUS.PENDING,
    PAYMENT_GATEWAY: DEFAULT_PAYMENT_GATEWAY,
    PAYMENT_METHOD: DEFAULT_PAYMENT_METHOD,
    CURRENCY: CURRENCY.INR
});

/**
 * Common Service Messages
 * Avoid hardcoded messages across services/controllers.
 */
const RESPONSE_MESSAGE = Object.freeze({
    BOOKING_CREATED: "Booking created successfully.",
    PAYMENT_PENDING: "Payment pending.",
    PAYMENT_SUCCESS: "Payment completed successfully.",
    PAYMENT_FAILED: "Payment failed.",
    BOOKING_CONFIRMED: "Booking confirmed.",
    BOOKING_CANCELLED: "Booking cancelled.",
    INVALID_OFFER: "Offer is invalid.",
    INVALID_COUPON: "Coupon is invalid."
});

module.exports = {
    BOOKING,

    BOOKING_STATUS,
    PAYMENT_STATUS,

    ITEM_TYPE,
    INVOICE_CODES,

    PAYMENT_METHOD,
    PAYMENT_GATEWAY,

    DEFAULT_PAYMENT_GATEWAY,
    DEFAULT_PAYMENT_METHOD,

    OFFER_TYPE,
    DISCOUNT_POLICY,

    CURRENCY,
    DEFAULT_BOOKING,

    RESPONSE_MESSAGE
};