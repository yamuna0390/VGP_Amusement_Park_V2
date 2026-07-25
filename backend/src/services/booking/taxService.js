const settingsRepository = require("../../repositories/settingsRepository");

const calculateTax = async (amountAfterDiscount) => {

    const settings = await settingsRepository.getAllSettings();

    const gstPercentage = Number(settings.gst_percentage || 0);

    const tax = Number(
        ((amountAfterDiscount * gstPercentage) / 100).toFixed(2)
    );

    const grandTotal = Number(
        (amountAfterDiscount + tax).toFixed(2)
    );

    return {
        gstPercentage,
        tax,
        grandTotal,
    };
};

module.exports = {
    calculateTax,
};