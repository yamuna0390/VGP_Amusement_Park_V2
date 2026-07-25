const settingsRepository = require("../../repositories/settingsRepository");

const generateBookingNumber = async (bookingId) => {
    const settings = await settingsRepository.getAllSettings();

    const prefix = settings.booking_prefix || "VGP";

    const today = new Date();

    const yyyy = today.getFullYear();

    const mm = String(today.getMonth() + 1).padStart(2, "0");

    const dd = String(today.getDate()).padStart(2, "0");

    const date = `${yyyy}${mm}${dd}`;

    const sequence = String(bookingId).padStart(6, "0");

    return `${prefix}-${date}-${sequence}`;
};

module.exports = {
    generateBookingNumber,
};