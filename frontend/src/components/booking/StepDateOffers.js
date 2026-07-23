"use client";
import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import BookingCalendar from "@/components/booking/BookingCalendar";
import OfferCard from "@/components/booking/OfferCard";
import { BOOKING_OFFERS } from "@/data/bookingOffers";

export default function StepDateOffers({ onNext }) {
  const { visitDate, setDate, selectedOffer, setOffer } = useBooking();
  const [err, setErr] = useState("");

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
                onSelect={setOffer}
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
    </div>
  );
}
