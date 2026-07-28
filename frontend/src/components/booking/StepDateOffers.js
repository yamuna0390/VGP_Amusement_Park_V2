"use client";
import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import BookingCalendar from "@/components/booking/BookingCalendar";
import OfferCard from "@/components/booking/OfferCard";
import { BOOKING_OFFERS } from "@/data/bookingOffers";

export default function StepDateOffers({ onNext }) {
  const { 
    visitDate, 
    setDate, 
    selectedOffer, 
    setOffer, 
    couponCode, 
    appliedCoupon 
  } = useBooking();
  
  const [err, setErr] = useState("");

  // Reverse rule modal states
  const [showOfferConfirm, setShowOfferConfirm] = useState(false);
  const [pendingOffer, setPendingOffer] = useState(null);

  const handleOfferSelectAttempt = (offer) => {
    // If selecting an offer, and a coupon is currently applied, show popup
    if (offer && couponCode) {
      setPendingOffer(offer);
      setShowOfferConfirm(true);
    } else {
      setOffer(offer);
    }
  };

  const confirmApplyOffer = () => {
    if (pendingOffer) {
      setOffer(pendingOffer);
    }
    setPendingOffer(null);
    setShowOfferConfirm(false);
  };

  const handleNext = () => {
    if (!visitDate) { setErr("Please select a visit date to continue."); return; }
    setErr("");
    onNext();
  };

  return (
    <div className="bk-step-content">
      <div className="bk-step1-grid">
        {/* Left — Offers */}
        <div className="bk-panel">
          <h2 className="bk-panel__title">
            🎁 Pick an Offer <span className="bk-optional">(Optional)</span>
          </h2>
          {visitDate && (
            <p className="bk-panel__sub">Offers available for {visitDate}</p>
          )}
          <div className="bk-offers-list">
            {BOOKING_OFFERS.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isSelected={selectedOffer?.id === offer.id}
                onSelect={handleOfferSelectAttempt}
              />
            ))}
          </div>
        </div>

        {/* Right — Calendar */}
        <div className="bk-panel">
          <h2 className="bk-panel__title">📅 Choose Your Visit Date</h2>
          <p className="bk-panel__sub">
            7 hours of non-stop thrills — open all 365 days, 24×7!
          </p>
          <BookingCalendar
            selectedDate={visitDate}
            onSelectDate={(d) => { setDate(d); setErr(""); }}
          />
          {err && <p className="bk-err" role="alert">{err}</p>}
          <button
            className="cta-big cta-red bk-proceed"
            onClick={handleNext}
            id="step1-proceed-btn"
          >
            Proceed to Tickets →
          </button>
        </div>
      </div>

      {/* Reverse Rule Modal */}
      {showOfferConfirm && (
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
              Coupon Already Applied
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--ink)", marginBottom: "24px", lineHeight: "1.5", fontWeight: "600" }}>
              Coupon <strong>{couponCode}</strong> is currently applied. <br />
              Applying this Offer will remove the coupon. <br /><br />
              Continue?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                className="bk-btn-back"
                onClick={() => {
                  setPendingOffer(null);
                  setShowOfferConfirm(false);
                }}
                style={{ margin: 0, padding: "8px 24px", height: "45px" }}
              >
                Cancel
              </button>
              <button
                className="cta-big cta-red"
                onClick={confirmApplyOffer}
                style={{ padding: "8px 24px", fontSize: "0.9rem", height: "45px" }}
              >
                Apply Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
