const couponRepository = require("../repositories/couponRepository");
const { success } = require("../utils/response");

const getCoupons = async (req, res, next) => {
  try {
    const coupons = await couponRepository.getAllCoupons();
    return success(res, "Coupons retrieved successfully", coupons);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/coupons/validate
 * Body: { couponCode, subtotal }
 * Validates a coupon against the DB and computes discount amount.
 */
const validateCoupon = async (req, res, next) => {
  try {
    const { couponCode, subtotal } = req.body;

    if (!couponCode) {
      return res.status(400).json({ success: false, message: "Coupon code is required." });
    }

    const result = await couponRepository.validateCoupon(
      couponCode.trim().toUpperCase(),
      Number(subtotal) || 0
    );

    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return success(res, "Coupon applied successfully", result.coupon);
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const couponId = await couponRepository.createCoupon(req.body);
    return success(res, "Coupon created successfully", { id: couponId }, 201);
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    await couponRepository.updateCoupon(req.params.id, req.body);
    return success(res, "Coupon updated successfully", { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    await couponRepository.deleteCoupon(req.params.id);
    return success(res, "Coupon deleted successfully", { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
