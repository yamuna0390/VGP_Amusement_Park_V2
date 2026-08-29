const groupQuoteService = require("../services/groupQuoteService");
const { success } = require("../utils/response");

/**
 * POST /api/group-quotes
 */
async function createGroupQuote(req, res, next) {
    try {
        const { organisationName, groupSize, preferredDate, contactNumber, email } = req.body;

        const result = await groupQuoteService.createGroupQuote({
            organisationName,
            groupSize,
            preferredDate,
            contactNumber,
            email
        });

        return success(res, "Group quote request received successfully.", result, 201);
    } catch (error) {
        // Pass to global error handler which handles statusCode
        next(error);
    }
}

module.exports = {
    createGroupQuote
};
