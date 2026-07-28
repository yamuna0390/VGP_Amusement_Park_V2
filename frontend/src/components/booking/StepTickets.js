"use client";
import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import TicketCard from "@/components/booking/TicketCard";
import { TICKETS } from "@/data/tickets";
import { calcTicketSubtotal, totalTicketCount, effectivePrice, fmt } from "@/utils/bookingCalc";

export default function StepTickets({ onNext, onBack }) {
  const { ticketQty, setTicketQty, selectedOffer } = useBooking();
  const [err, setErr] = useState("");

  const total = totalTicketCount(ticketQty);
  const subtotal = calcTicketSubtotal(ticketQty);

  let freeTicketsCount = 0;
  let savings = 0;

  if (selectedOffer) {
    const code = selectedOffer.code || selectedOffer.id;
    if (code === "BIRTHDAYBOGO" || code === "BIRTHDAY" || selectedOffer.offer_rule === "BOGO" || selectedOffer.discountType === "bogo") {
      TICKETS.forEach((tk) => {
        if (["adult", "child", "senior", "student"].includes(tk.id)) {
          const qty = ticketQty[tk.id] || 0;
          freeTicketsCount += qty;
          savings += qty * (tk.discountPrice !== null ? tk.discountPrice : tk.originalPrice);
        }
      });
    } else if (code === "ADITHALUBADI" || code === "FRIENDTRIO" || selectedOffer.offer_rule === "B2G1") {
      TICKETS.forEach((tk) => {
        if (["adult", "child", "senior", "student"].includes(tk.id)) {
          const qty = ticketQty[tk.id] || 0;
          const free = Math.floor(qty / 2);
          freeTicketsCount += free;
          savings += free * (tk.discountPrice !== null ? tk.discountPrice : tk.originalPrice);
        }
      });
    } else if (code === "CAMPUS20") {
      const studentTk = TICKETS.find((tk) => tk.id === "student");
      if (studentTk) {
        const qty = ticketQty[studentTk.id] || 0;
        savings = qty * effectivePrice(studentTk) * 0.2;
      }
    } else if (code === "FREEDOM800") {
      const adultTk = TICKETS.find((tk) => tk.id === "adult");
      if (adultTk) {
        const qty = ticketQty[adultTk.id] || 0;
        savings = qty * 175.00;
      }
    }
  }

  const visitorCount = total + freeTicketsCount;

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
              <div className="bk-sticky-bar__offer" style={{ color: "var(--red)", fontWeight: "800", marginBottom: "4px" }}>
                🎁 {selectedOffer.name || selectedOffer.title} Applied
              </div>
            )}
            <div className="bk-sticky-bar__count" style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.95rem" }}>
              <span>🎟 Paid Tickets: <strong>{total}</strong></span>
              {freeTicketsCount > 0 && (
                <span style={{ color: "green", fontWeight: "700" }}>
                  🎁 Free Tickets: <strong>+{freeTicketsCount}</strong>
                </span>
              )}
              <span>👥 Total Visitors: <strong>{visitorCount}</strong></span>
              {savings > 0 && (
                <span style={{ color: "var(--purple-deep)", fontWeight: "800" }}>
                  💰 Savings: {fmt(savings)}
                </span>
              )}
              <span>· Subtotal: {fmt(subtotal)} (before tax)</span>
            </div>
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
