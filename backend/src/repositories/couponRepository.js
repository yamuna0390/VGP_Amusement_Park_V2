const db = require("../config/database");

const getValidCoupon = async (couponCode) => {
    const [rows] = await db.query(
        `SELECT *
         FROM coupons
         WHERE coupon_code = ?
           AND status = 'Active'
           AND CURDATE() BETWEEN valid_from AND valid_to
         LIMIT 1`,
        [couponCode]
    );

    return rows[0] || null;
};

module.exports = {
    getValidCoupon,
};