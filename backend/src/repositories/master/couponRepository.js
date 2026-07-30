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

const getAllCoupons = async () => {
  const [rows] = await db.query("SELECT * FROM coupons ORDER BY id DESC");
  return rows;
};

const createCoupon = async (couponData) => {
  const [result] = await db.query(
    `INSERT INTO coupons 
      (coupon_code, coupon_name, discount_type, discount_value, minimum_amount, usage_limit, used_count, valid_from, valid_to, status)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
    [
      couponData.coupon_code,
      couponData.coupon_name,
      couponData.discount_type,
      couponData.discount_value,
      couponData.minimum_amount || 0,
      couponData.usage_limit || null,
      couponData.valid_from,
      couponData.valid_to,
      couponData.status || 'Active'
    ]
  );
  return result.insertId;
};

const updateCoupon = async (id, couponData) => {
  await db.query(
    `UPDATE coupons 
     SET coupon_code = ?, coupon_name = ?, discount_type = ?, discount_value = ?, minimum_amount = ?, usage_limit = ?, valid_from = ?, valid_to = ?, status = ?
     WHERE id = ?`,
    [
      couponData.coupon_code,
      couponData.coupon_name,
      couponData.discount_type,
      couponData.discount_value,
      couponData.minimum_amount || 0,
      couponData.usage_limit,
      couponData.valid_from,
      couponData.valid_to,
      couponData.status,
      id
    ]
  );
};

const deleteCoupon = async (id) => {
  await db.query("DELETE FROM coupons WHERE id = ?", [id]);
};

const validateCoupon = async (couponCode, subtotal) => {
  const coupon = await getValidCoupon(couponCode);
  if (!coupon) {
    return { valid: false, message: "Invalid or expired coupon code." };
  }
  const minAmount = Number(coupon.minimum_amount || 0);
  if (subtotal < minAmount) {
    return { valid: false, message: `Minimum order of ₹${minAmount.toFixed(2)} required for this coupon.` };
  }

  let discount = 0;
  if (coupon.discount_type === "Percentage") {
    discount = Number(((subtotal * Number(coupon.discount_value)) / 100).toFixed(2));
  } else {
    discount = Math.min(Number(coupon.discount_value), subtotal);
  }

  return {
    valid: true,
    coupon: {
      code: coupon.coupon_code,
      name: coupon.coupon_name,
      discountType: coupon.discount_type,
      discountValue: Number(coupon.discount_value),
      description: coupon.discount_type === "Percentage"
        ? `${coupon.discount_value}% off`
        : `₹${Number(coupon.discount_value).toFixed(2)} off`,
      discount,
    },
  };
};

module.exports = {
  getValidCoupon,
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};