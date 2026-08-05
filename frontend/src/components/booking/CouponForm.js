"use client";
import { useState, useEffect } from "react";
import { validateCoupon } from "@/services/bookingApi";
import { useBooking } from "@/context/BookingContext";
import { calculateTemporaryCouponUiDiscount } from "@/utils/bookingSummary";

export default function CouponForm(props) {
  const booking = useBooking() || {};
  const {
    visitDate = "",
    ticketQty = {},
    offerQty = {},
    masterData = {},
    couponCode: contextCouponCode = "",
    appliedCoupon: contextAppliedCoupon = null,
    setCoupon,
  } = booking;

  const appliedCoupon = props.appliedCoupon !== undefined ? props.appliedCoupon : contextAppliedCoupon;
  const couponCode = props.couponCode !== undefined ? props.couponCode : contextCouponCode;
  const onApply = props.onApply || setCoupon || (() => {});

  const [localCode, setLocalCode] = useState(couponCode || "");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  // Check if any offer ticket has quantity > 0
  const hasOfferSelected = Object.values(offerQty || {}).some((qty) => Number(qty) > 0);
  const couponApplied = Boolean(appliedCoupon && couponCode);

  useEffect(() => {
    setLocalCode(couponCode || "");
    setError("");
  }, [couponCode]);

  const applyCode = async () => {
    const code = localCode.trim().toUpperCase();
    if (!code || hasOfferSelected || couponApplied) return;

    setLoading(true);
    setError("");

    try {
      const coupon = await validateCoupon({
        visitDate,
        couponCode: code,
      });

      onApply(code, coupon);
    } catch (err) {
      setError(err.message || "Invalid or expired coupon.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setLocalCode("");
    setError("");
    onApply("", null);
  };

  return (
    <div className="bk-coupon">
      <h3 className="bk-coupon__title">Coupon Code</h3>

      <div className="bk-coupon__row">
        <div className="bk-coupon__code-row" style={{ display: "flex", gap: "8px" }}>
          <input
            className="bk-coupon__input"
            type="text"
            placeholder="ENTER COUPON CODE"
            value={localCode}
            onChange={(e) => { setLocalCode(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && !hasOfferSelected && !couponApplied && applyCode()}
            aria-label="Coupon code"
            style={{ textTransform: "uppercase" }}
            disabled={loading || hasOfferSelected || couponApplied}
          />
          <button
            className="cta-big cta-green"
            onClick={couponApplied ? clear : applyCode}
            disabled={loading || (hasOfferSelected && !couponApplied)}
            style={{
              padding: "8px 24px",
              fontSize: "0.85rem",
              height: "45px",
              opacity: (hasOfferSelected && !couponApplied) ? 0.6 : 1,
              cursor: (hasOfferSelected && !couponApplied) ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Checking…" : couponApplied ? "Remove Coupon" : "Apply Coupon"}
          </button>
        </div>
      </div>

      {hasOfferSelected && (
        <p className="bk-coupon__error" role="alert" style={{ color: "var(--red)", fontSize: "0.85rem", marginTop: "4px", fontWeight: "700" }}>
          Remove Offer Tickets to use a Coupon.
        </p>
      )}

      {error && !hasOfferSelected && !couponApplied && (
        <p className="bk-coupon__error" role="alert" style={{ color: "var(--red)", fontSize: "0.85rem", marginTop: "4px", fontWeight: "700" }}>
          {error}
        </p>
      )}

      {couponApplied && !hasOfferSelected && (
        <div className="bk-coupon__success" role="status" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "10px 14px", borderRadius: "8px", marginTop: "10px", fontWeight: "700", fontSize: "0.9rem" }}>
          <span>
            Coupon Applied ✓ <strong>{appliedCoupon?.couponCode || couponCode}</strong>{" "}
            {(booking.couponDiscount !== undefined ? booking.couponDiscount : calculateTemporaryCouponUiDiscount(booking.ticketTotal || 0, booking.foodTotal || 0, appliedCoupon).discountAmount) > 0
              ? `— ₹${Number(booking.couponDiscount !== undefined ? booking.couponDiscount : calculateTemporaryCouponUiDiscount(booking.ticketTotal || 0, booking.foodTotal || 0, appliedCoupon).discountAmount).toFixed(2)} Discount`
              : (appliedCoupon?.couponName ? `— ${appliedCoupon.couponName}` : "")}
          </span>
          <button
            className="bk-coupon__clear"
            onClick={clear}
            aria-label="Remove coupon"
            style={{ background: "none", border: "none", color: "#2e7d32", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
