/**
 * Rounds monetary values to 2 decimal places using standard conversion to avoid floating point issues.
 *
 * @param {number|string} value - The monetary amount to round
 * @returns {number} Rounded value as a number
 */
function roundMoney(value) {
    return Number(Number(value || 0).toFixed(2));
}

module.exports = {
    roundMoney
};
