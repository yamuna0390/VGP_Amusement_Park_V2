const db = require("../config/database");
const { success } = require("../utils/response");

const getAdminReviews = async (req, res, next) => {
    try {
        const [reviews] = await db.query(
            `SELECT * FROM customer_reviews ORDER BY display_order ASC, created_at DESC`
        );
        return success(res, "Reviews retrieved successfully", reviews);
    } catch (error) {
        next(error);
    }
};

const getAdminReviewById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [reviews] = await db.query(`SELECT * FROM customer_reviews WHERE id = ?`, [id]);
        if (reviews.length === 0) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }
        return success(res, "Review retrieved successfully", reviews[0]);
    } catch (error) {
        next(error);
    }
};

const createAdminReview = async (req, res, next) => {
    try {
        const {
            customer_name, location, rating, review_text, status, display_order
        } = req.body;

        if (!customer_name || !rating || !review_text) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const [result] = await db.query(
            `INSERT INTO customer_reviews (
                customer_name, location, rating, review_text, status, display_order
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                customer_name,
                location || null,
                rating,
                review_text,
                status || 'Unpublished',
                display_order || 0
            ]
        );

        return success(res, "Review created successfully", { id: result.insertId }, 201);
    } catch (error) {
        next(error);
    }
};

const updateAdminReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            customer_name, location, rating, review_text, status, display_order
        } = req.body;

        if (!customer_name || !rating || !review_text) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        await db.query(
            `UPDATE customer_reviews SET 
                customer_name=?, location=?, rating=?, review_text=?, status=?, display_order=?
            WHERE id=?`,
            [
                customer_name,
                location || null,
                rating,
                review_text,
                status || 'Unpublished',
                display_order || 0,
                id
            ]
        );

        return success(res, "Review updated successfully", { id });
    } catch (error) {
        next(error);
    }
};

const updateAdminReviewStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['Published', 'Unpublished'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }
        await db.query(`UPDATE customer_reviews SET status = ? WHERE id = ?`, [status, id]);
        return success(res, "Review status updated", { id });
    } catch (error) {
        next(error);
    }
};

const deleteAdminReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM customer_reviews WHERE id = ?`, [id]);
        return success(res, "Review deleted successfully", { id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminReviews,
    getAdminReviewById,
    createAdminReview,
    updateAdminReview,
    updateAdminReviewStatus,
    deleteAdminReview
};
