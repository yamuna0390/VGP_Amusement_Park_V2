"use client";

import { Minus, Plus } from "lucide-react";
import { fmt } from "@/utils/bookingCalc";

export default function TicketCard({ ticket, qty, onChange, bookingType }) {
  const isOffer = bookingType === 'offer';
  const displayPrice = isOffer && ticket.offerFare !== undefined ? ticket.offerFare : (ticket.originalFare || ticket.price || 0);
  const showStruckThrough = isOffer && ticket.offerFare !== undefined && ticket.originalFare !== undefined && ticket.offerFare < ticket.originalFare;

  const isSelected = qty > 0;

  return (
    <div className={`booking-ticket-card ${isSelected ? "booking-ticket-card--selected" : ""}`}>
      <div className="booking-ticket-card__info">
        <h3 className="booking-ticket-card__name">{ticket.name}</h3>
        {ticket.badge && (
          <span className="booking-ticket-card__badge">{ticket.badge}</span>
        )}
        {ticket.description && (
          <p className="booking-ticket-card__desc">{ticket.description}</p>
        )}
        <div className="booking-ticket-card__price">
          {showStruckThrough && (
            <span className="booking-ticket-card__price-original">
              {fmt(ticket.originalFare)}
            </span>
          )}
          {displayPrice === 0 ? "FREE" : fmt(displayPrice)}
        </div>
        {ticket.buyXGetY && (
          <div className="mt-2.5 px-3 py-2 bg-green-50 border border-green-200 rounded-lg flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[0.8rem] text-green-800 font-bold">✓ Offer Applied</span>
            <span className="text-[0.8rem] text-green-600/60 hidden sm:inline">·</span>
            <span className="text-[0.8rem] text-green-700 font-medium">
               Buy {ticket.buyXGetY.minQty} → Get {ticket.buyXGetY.freeQty} Free
            </span>
          </div>
        )}
      </div>
      <div className="booking-ticket-card__controls">
        <button 
          className="booking-ticket-control booking-ticket-control--minus"
          onClick={() => onChange(qty - 1)}
          disabled={qty <= 0}
          aria-label={`Decrease ${ticket.name} quantity`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="booking-ticket-qty" aria-live="polite">
          {qty}
        </span>
        <button 
          className="booking-ticket-control booking-ticket-control--plus"
          onClick={() => onChange(qty + 1)}
          aria-label={`Increase ${ticket.name} quantity`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}