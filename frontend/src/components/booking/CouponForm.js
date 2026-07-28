"use client";
import { useState, useEffect } from "react";
import { validateCoupon } from "@/services/bookingApi";

export default function CouponForm({ ticketSubtotal, onApply, appliedCoupon, couponCode }) {
  const [localCode, setLocalCode] = useState(couponCode || "");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    setLocalCode(couponCode || "");
    setError("");
  }, [couponCode]);

  const applyCode = async () => {
    const code = localCode.trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setError("");

    try {
      const coupon = await validateCoupon(code, ticketSubtotal);
      onApply(code, coupon);
    } catch (err) {
      setError(err.message || "Invalid coupon code.");
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
            onKeyDown={(e) => e.key === "Enter" && applyCode()}
            aria-label="Coupon code"
            style={{ textTransform: "uppercase" }}
            disabled={loading}
          />
          <button
            className="cta-big cta-green"
            onClick={applyCode}
            disabled={loading}
            style={{ padding: "8px 24px", fontSize: "0.85rem", height: "45px" }}
          >
            {loading ? "Checking…" : "Apply Coupon"}
          </button>
        </div>
      </div>

      {error && (
        <p className="bk-coupon__error" role="alert" style={{ color: "var(--red)", fontSize: "0.85rem", marginTop: "4px", fontWeight: "700" }}>
          {error}
        </p>
      )}

      {appliedCoupon && (
        <div className="bk-coupon__success" role="status" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "10px 14px", borderRadius: "8px", marginTop: "10px", fontWeight: "700", fontSize: "0.9rem" }}>
          <span>
            ✅ <strong>{appliedCoupon.code}</strong> applied —{" "}
            {appliedCoupon.description || `${appliedCoupon.discountValue}% Off`}
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
