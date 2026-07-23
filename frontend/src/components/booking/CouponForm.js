"use client";
import { useState } from "react";
import { calcCouponDiscount } from "@/utils/bookingCalc";
import { BOOKING_OFFERS } from "@/data/bookingOffers";

export default function CouponForm({ ticketSubtotal, onApply, appliedCoupon, couponCode }) {
  const [localCode, setLocalCode] = useState(couponCode || "");
  const [error, setError]         = useState("");
  const [offerSel, setOfferSel]   = useState("");

  const applyCode = () => {
    const code = localCode.trim();
    if (!code) return;
    const { discount, error: err, coupon } = calcCouponDiscount(code, ticketSubtotal);
    if (err) { setError(err); return; }
    setError("");
    onApply(code, coupon, discount);
  };

  const applyOffer = () => {
    if (!offerSel) return;
    const offer = BOOKING_OFFERS.find((o) => o.id === offerSel);
    if (offer?.couponCode) {
      setLocalCode(offer.couponCode);
      const { discount, error: err, coupon } = calcCouponDiscount(offer.couponCode, ticketSubtotal);
      if (!err) { onApply(offer.couponCode, coupon, discount); setError(""); }
    }
  };

  const clear = () => {
    setLocalCode("");
    setError("");
    onApply("", null, 0);
  };

  return (
    <div className="bk-coupon">
      <h3 className="bk-coupon__title">Apply an Offer or Coupon Code</h3>

      {/* Offer dropdown */}
      <div className="bk-coupon__row">
        <label className="bk-coupon__label">Select an offer or coupon</label>
        <div className="bk-coupon__offer-row">
          <select
            className="bk-coupon__select"
            value={offerSel}
            onChange={(e) => setOfferSel(e.target.value)}
            aria-label="Select an offer"
          >
            <option value="">— Choose an offer or coupon —</option>
            {BOOKING_OFFERS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.title}
              </option>
            ))}
          </select>
          <button className="bk-coupon__apply" onClick={applyOffer}>
            APPLY
          </button>
        </div>
      </div>

      {/* Manual coupon input */}
      <div className="bk-coupon__row">
        <div className="bk-coupon__code-row">
          <input
            className="bk-coupon__input"
            type="text"
            placeholder="OR TYPE A COUPON CODE"
            value={localCode}
            onChange={(e) => { setLocalCode(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && applyCode()}
            aria-label="Coupon code"
          />
          <button className="bk-coupon__code-btn" onClick={applyCode}>
            Apply Code
          </button>
        </div>
      </div>

      {error && <p className="bk-coupon__error" role="alert">{error}</p>}

      {appliedCoupon && (
        <div className="bk-coupon__success" role="status">
          ✅ <strong>{appliedCoupon.code}</strong> applied — {appliedCoupon.description}
          <button className="bk-coupon__clear" onClick={clear} aria-label="Remove coupon">✕</button>
        </div>
      )}

      <p className="bk-coupon__note">
        Only one VGP promotional ticket offer or coupon can be applied per booking. Regular-priced food, parking, lockers, merchandise and other paid add-ons may be added.
      </p>
    </div>
  );
}
