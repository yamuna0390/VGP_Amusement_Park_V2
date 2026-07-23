"use client";
import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import TicketCard from "@/components/booking/TicketCard";
import { TICKETS } from "@/data/tickets";
import { calcTicketSubtotal, totalTicketCount, fmt } from "@/utils/bookingCalc";

export default function StepTickets({ onNext, onBack }) {
  const { ticketQty, setTicketQty, selectedOffer } = useBooking();
  const [err, setErr] = useState("");

  const total = totalTicketCount(ticketQty);
  const subtotal = calcTicketSubtotal(ticketQty);

  const handleNext = () => {
    if (total < 1) { setErr("Please select at least 1 ticket to continue."); return; }
    setErr("");
    onNext();
  };

  return (
    <div className="bk-step-content">
      <div className="bk-panel bk-panel--wide">
        <h2 className="bk-panel__title">🎟 Select Your Fun Passes</h2>
        <div className="bk-info-banner">
          All prices shown are <strong>before tax</strong>. GST is added at checkout —{" "}
          <strong>18%</strong> on theme-park tickets and <strong>5%</strong> on food.
        </div>

        <div className="bk-tickets-list">
          {TICKETS.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              qty={ticketQty[ticket.id] || 0}
              onChange={(qty) => { setTicketQty(ticket.id, qty); setErr(""); }}
            />
          ))}
        </div>

        {err && <p className="bk-err" role="alert">{err}</p>}

        {/* Sticky bottom bar */}
        {total > 0 && (
          <div className="bk-sticky-bar">
            {selectedOffer && (
              <span className="bk-sticky-bar__offer">
                🎁 {selectedOffer.title}
              </span>
            )}
            <span className="bk-sticky-bar__count">
              🎟 {total} ticket{total !== 1 ? "s" : ""} · Subtotal {fmt(subtotal)} (before tax)
            </span>
          </div>
        )}

        <div className="bk-nav-btns">
          <button className="bk-btn-back" onClick={onBack} id="step2-back-btn">← Back</button>
          <button className="cta-big cta-red" onClick={handleNext} id="step2-next-btn">
            Next: Food →
          </button>
        </div>
      </div>
    </div>
  );
}
