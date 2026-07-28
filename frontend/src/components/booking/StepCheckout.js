"use client";
import { useState, useEffect } from "react";
import { createBooking } from "@/services/bookingApi";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import CouponForm from "@/components/booking/CouponForm";
import CustomerForm from "@/components/booking/CustomerForm";
import BookingSummary from "@/components/booking/BookingSummary";
import { calcTicketSubtotal, calcOfferDiscount, fmt } from "@/utils/bookingCalc";

function validateCustomer(c) {
  const errs = {};
  if (!c.name?.trim()) errs.name = "Name is required.";
  if (!c.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email))
    errs.email = "Valid email is required.";
  if (!c.mobile?.trim() || !/^[6-9]\d{9}$/.test(c.mobile.replace(/\D/g, "").slice(-10)))
    errs.mobile = "Valid 10-digit Indian mobile number required.";
  return errs;
}

export default function StepCheckout({ onBack }) {
  const {
    visitDate,
    selectedOffer,
    setOffer,

    ticketQty,
    mealQty,

    couponCode,
    appliedCoupon,
    setCoupon,

    customer,
    setCustomer,

    agreedToTerms,
    setTerms,

    setStep,
    setBookingResult,
  } = useBooking();

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setCustomer({
        name: user.fullName || "",
        email: user.email || "",
        mobile: user.phone || "",
      });
    }
  }, [user, setCustomer]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Coupon conflict modal states
  const [showCouponConfirm, setShowCouponConfirm] = useState(false);
  const [pendingCoupon, setPendingCoupon] = useState(null);

  const ticketBase = calcTicketSubtotal(ticketQty);

  // Compute savings from selected offer
  const offerSavings = calcOfferDiscount(selectedOffer, ticketBase, ticketQty);

  const handleCouponApplyAttempt = (code, coupon) => {
    // If an offer is already applied and code is not empty, show confirmation popup
    if (selectedOffer && code) {
      setPendingCoupon({ code, coupon });
      setShowCouponConfirm(true);
    } else {
      setCoupon(code, coupon);
    }
  };

  const confirmCouponApply = () => {
    if (pendingCoupon) {
      setCoupon(pendingCoupon.code, pendingCoupon.coupon);
    }
    setPendingCoupon(null);
    setShowCouponConfirm(false);
  };

  const handlePay = async () => {
    const errs = validateCustomer(customer);

    if (!agreedToTerms) {
      errs.terms = "You must agree to the Terms & Conditions.";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setApiError("");
    setSubmitting(true);

    try {
      const tickets = Object.entries(ticketQty)
        .filter(([, quantity]) => quantity > 0)
        .map(([ticketType, quantity]) => ({
          ticketType,
          quantity,
        }));

      const meals = Object.entries(mealQty)
        .filter(([, quantity]) => quantity > 0)
        .map(([mealType, quantity]) => ({
          mealType,
          quantity,
        }));

      const payload = {
        visitDate,
        customer,
        couponCode: couponCode || null,
        offerCode: selectedOffer ? (selectedOffer.code || selectedOffer.id) : null,
        tickets,
        meals,
        agreedToTerms,
      };

      const bookingResult = await createBooking(payload);
      setBookingResult(bookingResult);
    } catch (error) {
      setApiError(error.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bk-step-content">
      <div className="bk-panel bk-panel--wide">
        
        {/* Promotion Summary Widget */}
        {selectedOffer && (
          <div className="bk-promo-summary" style={{
            backgroundColor: "#fff8e1",
            border: "2px solid #ffe082",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "20px",
            position: "relative"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h4 style={{ color: "#b78103", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px", margin: 0, fontSize: "1.05rem" }}>
                  ✓ {selectedOffer.name || selectedOffer.title} Applied
                </h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6d5c3d", fontWeight: "600" }}>
                  {selectedOffer.description || "Special promotional offer applied to your booking passes."}
                </p>
                {offerSavings > 0 && (
                  <div style={{ marginTop: "6px", fontSize: "0.9rem", fontWeight: "800", color: "var(--purple-deep)" }}>
                    Savings: {fmt(offerSavings)}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1.5px solid #b78103",
                    color: "#b78103",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: "800",
                    cursor: "pointer"
                  }}
                >
                  Change Offer
                </button>
                <button
                  onClick={() => setOffer(null)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1.5px solid #d32f2f",
                    color: "#d32f2f",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: "800",
                    cursor: "pointer"
                  }}
                >
                  Remove Offer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Coupon Form */}
        <CouponForm
          ticketSubtotal={ticketBase}
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          onApply={handleCouponApplyAttempt}
        />

        <hr className="bk-divider" />

        {/* Customer details */}
        <CustomerForm
          customer={customer}
          onChange={(key, val) => setCustomer({ [key]: val })}
          errors={errors}
        />

        <div className="bk-cust__grid" style={{ marginTop: 8 }}>
          <div className="bk-field">
            <label className="bk-field__label">Visit Date</label>
            <input className="bk-field__input" readOnly value={visitDate || ""} />
          </div>
        </div>

        <hr className="bk-divider" />

        {/* Summary */}
        <BookingSummary
          ticketQty={ticketQty}
          mealQty={mealQty}
          offer={selectedOffer}
          couponCode={couponCode}
          visitDate={visitDate}
        />

        {/* T&C */}
        <div className="bk-terms">
          <p className="bk-terms__note">
            T&amp;C: No cancellation/postponement after booking · Entry free for children below 90 cm ·
            Senior citizens 60+ and students must carry valid ID.
          </p>
          <label className="bk-terms__label">
            <input
              type="checkbox"
              className="bk-terms__chk"
              checked={agreedToTerms}
              onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: undefined })); }}
              id="terms-chk"
            />
            <span>
              I have read and agree to the VGP Universal Kingdom{" "}
              <a href="/terms" className="bk-terms__link">Terms &amp; Conditions</a>,
              Privacy Policy, and cancellation &amp; refund policy.
              I understand that approved refunds may take 15 to 30 days to reflect in the
              original payment method.
            </span>
          </label>
          {errors.terms && <p className="bk-err" role="alert">{errors.terms}</p>}
        </div>

        {apiError && (
          <p className="bk-err" role="alert">
            {apiError}
          </p>
        )}
        
        <div className="bk-nav-btns">
          <button className="bk-btn-back" onClick={onBack} id="step4-back-btn">← Back</button>
          <button
            className="cta-big cta-red"
            onClick={handlePay}
            disabled={submitting}
            id="step4-pay-btn"
          >
            {submitting ? "Processing…" : "Pay & Get Tickets 🎟"}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showCouponConfirm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="bk-panel" style={{
            maxWidth: "460px",
            padding: "30px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            textAlign: "center"
          }}>
            <h3 style={{ color: "var(--purple-deep)", fontSize: "1.35rem", marginBottom: "12px", fontWeight: "900" }}>
              Promotion Already Applied
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--ink)", marginBottom: "24px", lineHeight: "1.5", fontWeight: "600" }}>
              <strong>{selectedOffer?.name || selectedOffer?.title}</strong> is currently applied. <br />
              Only ONE promotional offer or coupon can be used per booking. <br /><br />
              Applying this coupon will remove the selected offer. Continue?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                className="bk-btn-back"
                onClick={() => {
                  setPendingCoupon(null);
                  setShowCouponConfirm(false);
                }}
                style={{ margin: 0, padding: "8px 24px", height: "45px" }}
              >
                Cancel
              </button>
              <button
                className="cta-big cta-red"
                onClick={confirmCouponApply}
                style={{ padding: "8px 24px", fontSize: "0.9rem", height: "45px" }}
              >
                Apply Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
