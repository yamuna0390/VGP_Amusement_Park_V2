"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import bookingAddons from "@/data/bookingAddons";
import AddonCard from "@/components/booking/AddonCard";
import BookingSummary from "@/components/booking/BookingSummary";

export default function StepAddons({ onNext, onBack }) {
  const {
    foodQty = {},
    setFoodQty,
  } = useBooking();

  const [err, setErr] = useState("");

  const handleAddonChange = (code, qty) => {
    setErr("");
    if (qty <= 0) {
      setFoodQty(code, 0);
    } else {
      setFoodQty(code, qty);
    }
  };

  const handleNext = () => {
    setErr("");
    onNext();
  };

  return (
    <div className="booking-page">
      <div className="booking-layout">
        
        {/* MAIN CONTENT — 70% */}
        <div className="booking-main">
          
          <div className="booking-step-header-container">
            <div className="booking-step-heading">
              <span className="booking-step-heading__number">03</span>
              <div className="booking-step-heading__content">
                <h2 className="booking-step-heading__title">CHOOSE OPTIONAL ADD-ONS</h2>
                <p className="booking-step-heading__subtitle">
                  Personalise the visit with optional extras. Your selected offer remains applied to eligible tickets.
                </p>
              </div>
            </div>
          </div>

          {err && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2">
              <span>{err}</span>
            </div>
          )}

          <div className="booking-addons-panel">
            <div className="booking-addons-panel__header">
              <span className="booking-addons-panel__number">02</span>
              <div className="booking-addons-panel__content">
                <h3 className="booking-addons-panel__title">Optional extras</h3>
                <p className="booking-addons-panel__subtitle">
                  Add meal vouchers, lockers or parking.
                </p>
              </div>
            </div>

            <div className="booking-addons-grid">
              {bookingAddons
                .filter((addon) => addon.active)
                .map((addon) => {
                  const code = addon.id;
                  const currentQty = foodQty[code] || 0;
                  return (
                    <AddonCard
                      key={code}
                      addon={addon}
                      qty={currentQty}
                      onChange={(qty) => handleAddonChange(code, qty)}
                    />
                  );
              })}
            </div>
            
            <div className="booking-addons-navigation">
              <button className="booking-addons-navigation__back" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button className="booking-addons-navigation__next" onClick={handleNext}>
                Traveller Info <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* SUMMARY — 30% */}
        <div className="booking-summary-column">
          <BookingSummary
            onNext={handleNext}
            canProceed={true}
          />
        </div>
      </div>
    </div>
  );
}
