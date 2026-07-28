"use client";
import { useState } from "react";
import { ChevronLeft, Info } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import TicketCard from "@/components/booking/TicketCard";
import CouponForm from "@/components/booking/CouponForm";
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
    if (code === "BIRTHDAY_BOGO" || code === "BIRTHDAYBOGO" || selectedOffer.discountType === "bogo") {
      TICKETS.forEach((tk) => {
        if (["adult", "child", "senior", "student"].includes(tk.id)) {
          const qty = ticketQty[tk.id] || 0;
          freeTicketsCount += qty;
          savings += qty * (tk.discountPrice !== null ? tk.discountPrice : tk.originalPrice);
        }
      });
    } else if (code === "AADI_B2G1" || code === "FRIENDSHIP_B2G1" || selectedOffer.discountType === "b2g1") {
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
    } else if (code === "EARLYBIRD15") {
      TICKETS.forEach((tk) => {
        const qty = ticketQty[tk.id] || 0;
        savings += qty * effectivePrice(tk) * 0.15;
      });
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
      <div className="bk-step-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* ── Left Card Panel: Header & Important Information (Screenshot 2 Match) ── */}
        <div className="bk-panel" style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "28px 26px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0"
        }}>
          {/* Header row with back button + Title & Chennai pill badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={onBack}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#FDDB00",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1E293B",
                  fontWeight: "900",
                  cursor: "pointer"
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <h2 style={{
                fontSize: "1.45rem",
                fontWeight: "900",
                color: "#1E293B",
                fontFamily: "var(--font-roboto-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: 0
              }}>
                GRAB YOUR TICKETS
              </h2>
            </div>

            <span style={{
              background: "#FDDB00",
              color: "#1E293B",
              fontWeight: "800",
              fontSize: "0.82rem",
              padding: "5px 18px",
              borderRadius: "20px",
              letterSpacing: "0.5px"
            }}>
              Chennai
            </span>
          </div>

          <p style={{ fontSize: "0.88rem", color: "#64748B", fontWeight: "600", lineHeight: "1.5", marginBottom: "22px" }}>
            VGP Universal Kingdom provides regular tickets, fast track tickets for queue skipping, and Special Offer tickets designed exclusively for students, Birthday Celebrations, and families.
          </p>

          {/* Important Information Box */}
          <div style={{
            background: "#F8FAFC",
            border: "1px solid #CBD5E1",
            borderRadius: "16px",
            padding: "18px 20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2563EB", fontWeight: "800", fontSize: "0.95rem", marginBottom: "12px" }}>
              <Info size={18} />
              <span>Important Information</span>
            </div>

            <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#475569", fontWeight: "600", display: "flex", flexDirection: "column", gap: "10px", lineHeight: "1.5" }}>
              <li>Free entry for children under 85 cm in height.</li>
              <li>Offer tickets are available only online on the website, and tickets purchased after 9 AM cannot be redeemed on the same day.</li>
              <li>Only 100% nylon or polyester attire is permitted for water rides.</li>
              <li>Height restrictions apply to all rides, and weight restrictions apply to select rides for safety reasons.</li>
              <li>Outside food, beverages, and snacks are not permitted inside park premises.</li>
            </ul>
          </div>
        </div>

        {/* ── Right Card Panel: Ticket Selector List & Summary (Screenshot 2 Match) ── */}
        <div className="bk-panel" style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "28px 26px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0"
        }}>
          <div style={{ borderBottom: "2px solid #F1F5F9", paddingBottom: "12px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1E293B", textTransform: "uppercase", margin: 0 }}>
              👥 REGULAR TICKET <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: "600", textTransform: "none" }}>— Unlimited access to all rides</span>
            </h3>
          </div>

          {/* Scrollable list of ticket options */}
          <div className="bk-tickets-list bk-tickets-scroll" style={{ maxHeight: "380px", overflowY: "auto", paddingRight: "6px", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
            {TICKETS.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                qty={ticketQty[ticket.id] || 0}
                onChange={(qty) => { setTicketQty(ticket.id, qty); setErr(""); }}
              />
            ))}
          </div>

          {/* Coupon Code Section */}
          <div style={{ marginBottom: "18px" }}>
            <CouponForm />
          </div>

          {err && <p className="bk-err" role="alert" style={{ marginBottom: "12px", color: "#DC2626", fontWeight: "700" }}>{err}</p>}

          {/* Bottom Sticky Action Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", paddingTop: "14px", borderTop: "2px solid #F1F5F9" }}>
            <div>
              <span style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1E293B", display: "block" }}>
                {fmt(subtotal)}
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94A3B8", letterSpacing: "0.5px" }}>
                TAXES EXTRA
              </span>
            </div>

            <button
              className="cta-big cta-red"
              onClick={handleNext}
              style={{ flex: 1, padding: "12px 24px", fontSize: "1rem" }}
            >
              Confirm &amp; Proceed →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
