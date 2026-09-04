const db = require("../config/database");
const { success } = require("../utils/response");

const getPublishedReviews = async (req, res, next) => {
    try {
        const [reviews] = await db.query(
            `SELECT * FROM customer_reviews WHERE status = 'Published' ORDER BY display_order ASC, created_at DESC`
        );
        return success(res, "Published reviews retrieved successfully", reviews);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPublishedReviews
};
