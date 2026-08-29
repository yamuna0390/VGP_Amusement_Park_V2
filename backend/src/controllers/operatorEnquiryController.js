const operatorEnquiryService = require("../services/operatorEnquiryService");
const { success } = require("../utils/response");

/**
 * POST /api/operator-enquiries
 */
async function createOperatorEnquiry(req, res, next) {
    try {
        const { operator_name, email, phone, message } = req.body;

        const result = await operatorEnquiryService.createOperatorEnquiry({
            operator_name,
            email,
            phone,
            message
        });

        return success(res, "Operator enquiry submitted successfully.", result, 201);
    } catch (error) {
        // Pass to global error handler which handles statusCode
        next(error);
    }
}

module.exports = {
    createOperatorEnquiry
};
