"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import TicketCard from "@/components/booking/TicketCard";
import { getEffectiveTicketPrice } from "@/utils/bookingSummary";
import BookingSummary from "@/components/booking/BookingSummary";
import { updateBookingItems } from "@/services/bookingApi";

export default function StepTickets({ onNext, onBack }) {
  const {
    masterData,
    ticketQty = {},
    setTicketQty,
    visitDate,
    bookingType,
    selectedOffer,
  } = useBooking();

  const regularTickets = masterData.regularTickets || [];
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleTicketChange = (code, qty) => {
    setErr("");
    if (qty <= 0) {
      setTicketQty(code, 0);
    } else {
      setTicketQty(code, qty);
    }
  };

  const handleNext = async () => {
    const hasTickets = Object.values(ticketQty).some((q) => Number(q) > 0);
    if (!hasTickets) {
      setErr("Please select at least 1 ticket to continue.");
      return;
    }
    setErr("");
    
    setSubmitting(true);
    try {
      const tickets = Object.entries(ticketQty || {})
        .filter(([, quantity]) => quantity > 0)
        .map(([ticketType, quantity]) => {
          const ticket = (masterData.regularTickets || []).find((t) => (
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

      await updateBookingItems({ tickets, addons: [] });
      onNext();
    } catch (error) {
      setErr(error.message || "Failed to update tickets. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const hasTickets = Object.values(ticketQty).some((q) => Number(q) > 0);

  return (
    <div className="booking-page">
      <div className="booking-layout">
        
        {/* MAIN CONTENT — 70% */}
        <div className="booking-main">
          
          <div className="booking-step-header-container">
            <button className="booking-step-back" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" /> Back to Date & Offer
            </button>
            
            <div className="booking-step-heading">
              <span className="booking-step-heading__number">02</span>
              <div className="booking-step-heading__content">
                <h2 className="booking-step-heading__title">CHOOSE YOUR TICKETS</h2>
                <p className="booking-step-heading__subtitle">
                  Build your party. Final pricing and eligibility are checked on the server.
                </p>
              </div>
            </div>
          </div>

          {err && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2">
              <span>{err}</span>
            </div>
          )}

          <div className="booking-tickets-panel">
            <div className="booking-tickets-grid">
              {regularTickets.map((ticket) => {
                const code = ticket.code || ticket.id;
                const currentQty = ticketQty[code] || 0;
                
                let cardBookingType = "regular";
                let displayTicket = { ...ticket };

                if (bookingType === "offer" && selectedOffer && selectedOffer.ticketMappings) {
                  const mapping = selectedOffer.ticketMappings.find(m => {
                    const mapId = typeof m === 'object' ? m.ticketTypeId || m.id || m.ticketTypeCode : m;
                    return mapId === ticket.id || mapId === ticket.code;
                  });
                  if (mapping) {
                    cardBookingType = "offer";
                    
                    if (selectedOffer.promotionType === "BUY_X_GET_Y") {
                      const minQty = mapping.minQty || 1; // fallback to 1 to prevent division by 0
                      const freeQty = mapping.freeQty || 0;
                      const freeTickets = Math.floor(currentQty / minQty) * freeQty;
                      
                      displayTicket.buyXGetY = {
                        minQty,
                        freeQty,
                        earnedFreeTickets: freeTickets
                      };
                    }
                  }
                }
                
                const originalPrice = ticket.price || 0;
                const effectivePrice = getEffectiveTicketPrice(ticket, bookingType, selectedOffer);
                if (effectivePrice !== originalPrice) {
                  displayTicket.originalFare = originalPrice;
                  displayTicket.offerFare = effectivePrice;
                }

                return (
                  <TicketCard
                    key={ticket.id || code}
                    ticket={displayTicket}
                    qty={currentQty}
                    onChange={(qty) => handleTicketChange(code, qty)}
                    bookingType={cardBookingType}
                  />
                );
              })}
            </div>
            
            <div className="booking-ticket-navigation">
              <button className="booking-ticket-navigation__back" onClick={onBack} disabled={submitting}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button className="booking-ticket-navigation__next" onClick={handleNext} disabled={submitting || !hasTickets}>
                {submitting ? "Saving..." : "Add-ons"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="booking-ticket-notice">
              You may mix regular and offer-eligible ticket categories. The selected offer applies only to qualifying tickets; all other tickets retain the regular online price.
            </div>
          </div>

        </div>

        {/* SUMMARY — 30% */}
        <div className="booking-summary-column">
          <BookingSummary
            onNext={handleNext}
            canProceed={hasTickets && !submitting}
          />
        </div>
      </div>
    </div>
  );
}
