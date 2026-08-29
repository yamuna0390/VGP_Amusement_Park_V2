"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

import AddonCard from "@/components/booking/AddonCard";
import BookingSummary from "@/components/booking/BookingSummary";
import { updateBookingItems, generateBookingQuote, getMeals } from "@/services/bookingApi";

export default function StepAddons({ onNext, onBack }) {
  const {
    masterData,
    setMasterData,
    ticketQty = {},
    foodQty = {},
    setFoodQty,
    offerQty = {},
    setFinalReviewData,
  } = useBooking();

  const foods = masterData.foods || [];
  const regularTickets = masterData.regularTickets || [];

  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingMeals, setLoadingMeals] = useState(false);

  useEffect(() => {
    async function loadMeals() {
      if (masterData.foods && masterData.foods.length > 0) return; // already loaded by Step 1
      try {
        setLoadingMeals(true);
        const fetchedMeals = await getMeals();
        setMasterData(prev => ({ ...prev, foods: fetchedMeals }));
      } catch (error) {
        console.error("Failed to load addons:", error);
      } finally {
        setLoadingMeals(false);
      }
    }
    loadMeals();
  }, []);

  const handleAddonChange = (code, qty) => {
    setErr("");
    if (qty <= 0) {
      setFoodQty(code, 0);
    } else {
      setFoodQty(code, qty);
    }
  };

  const handleNext = async () => {
    setErr("");
    setSubmitting(true);
    try {
      const tickets = Object.entries(ticketQty || {})
        .filter(([, quantity]) => quantity > 0)
        .map(([ticketType, quantity]) => {
          const ticket = (regularTickets || []).find((t) => (
            String(t.id) === String(ticketType) || 
            String(t.code) === String(ticketType) || 
            String(t.ticketId) === String(ticketType)
          ));
          return {
            ticketTypeId: ticket ? (ticket.id || ticket.dbId || ticket.ticketTypeId) : null,
            quantity,
          };
        })
        .filter((t) => t.ticketTypeId !== null);

      const offerTicketsArray = Array.isArray(masterData.offerTickets)
        ? masterData.offerTickets.flatMap((offer) => offer.offerTickets || offer.offer_tickets || [])
        : [];

      const offerTickets = Object.entries(offerQty || {})
        .filter(([, quantity]) => quantity > 0)
        .map(([offerTicketId, quantity]) => ({
          offerTicketId: Number(offerTicketId),
          quantity,
        }));

      const addons = Object.entries(foodQty || {})
        .filter(([, quantity]) => quantity > 0)
        .map(([foodType, quantity]) => {
          const foodItem = (foods || []).find((m) => (
            String(m.id) === String(foodType) || 
            String(m.code) === String(foodType) || 
            String(m.foodId) === String(foodType)
          ));
          return {
            addonId: foodItem ? (foodItem.id || foodItem.dbId || foodItem.addonId) : null,
            quantity,
          };
        })
        .filter((m) => m.addonId !== null);

      await updateBookingItems({ tickets, offerTickets, addons });
      
      const quoteResponse = await generateBookingQuote();
      if (quoteResponse?.data) {
        setFinalReviewData(quoteResponse.data);
      }

      onNext();
    } catch (error) {
      setErr(error.message || "Failed to update items. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
              {loadingMeals ? (
                <div className="p-4 text-center text-sm text-gray-500 w-full">Loading addons...</div>
              ) : foods.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500 w-full">No addons available.</div>
              ) : (
                foods.map((addon) => {
                  const code = addon.id || addon.code;
                  const currentQty = foodQty[code] || 0;
                  return (
                    <AddonCard
                      key={code}
                      addon={addon}
                      qty={currentQty}
                      onChange={(qty) => handleAddonChange(code, qty)}
                    />
                  );
                })
              )}
            </div>
            
            <div className="booking-addons-navigation">
              <button className="booking-addons-navigation__back" onClick={onBack} disabled={submitting}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button className="booking-addons-navigation__next" onClick={handleNext} disabled={submitting}>
                {submitting ? "Saving..." : "Traveller Info"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* SUMMARY — 30% */}
        <div className="booking-summary-column">
          <BookingSummary
            onNext={handleNext}
            canProceed={!submitting}
          />
        </div>
      </div>
    </div>
  );
}
