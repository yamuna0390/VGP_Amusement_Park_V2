const { BOOKING } = require("../../constants/bookingConstants");

/**
 * Generates a customer-facing booking number.
 *
 * Format:
 * VGPDDMMYYXXXXXX
 *
 * Example:
 * VGP290726000001
 *
 * @param {string|Date} visitDate
 * @param {number} sequence
 * @returns {string}
 */
function generateBookingNumber(visitDate, sequence) {

    const date = new Date(visitDate);

    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid visit date.");
    }

    if (!Number.isInteger(sequence) || sequence <= 0) {
        throw new Error("Invalid booking sequence.");
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    const formattedSequence = String(sequence).padStart(
        BOOKING.SEQUENCE_LENGTH,
        "0"
    );

    return `${BOOKING.PREFIX}${day}${month}${year}${formattedSequence}`;
}

module.exports = {
    generateBookingNumber
};