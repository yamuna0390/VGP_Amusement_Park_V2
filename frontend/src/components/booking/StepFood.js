"use client";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { getBookingFinalReview } from "@/services/bookingApi";
import MealCard from "@/components/booking/MealCard";
import { fmt } from "@/utils/bookingCalc";

export default function StepFood({ onNext, onBack }) {
  const { 
    foodQty = {}, 
    setFoodQty, 
    ticketTotal = 0, 
    foodTotal = 0, 
    grandTotal = 0,
    masterData = {},
    visitDate,
    ticketQty = {},
    offerQty = {},
    couponCode = "",
    couponApplied,
    setFinalReviewData
  } = useBooking();
  const foods = masterData.foods || [];
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    setLoading(true);
    try {
      const regularTickets = Object.entries(ticketQty || {})
        .filter(([, q]) => Number(q) > 0)
        .map(([id, quantity]) => ({ ticketId: id, quantity }));
        
      const offerTickets = Object.entries(offerQty || {})
        .filter(([, q]) => Number(q) > 0)
        .map(([id, quantity]) => ({ offerTicketId: id, quantity }));
        
      const foodsSelected = Object.entries(foodQty || {})
        .filter(([, q]) => Number(q) > 0)
        .map(([id, quantity]) => ({ foodId: id, quantity }));
        
      const payload = {
        visitDate,
        regularTickets,
        offerTickets,
        foods: foodsSelected,
        couponCode: couponApplied ? (couponCode || null) : null,
      };

      if (typeof setFinalReviewData === "function") {
        try {
          const reviewResult = await getBookingFinalReview(payload);
          setFinalReviewData(reviewResult);
        } catch (err) {
          console.error("Final review calculation failed:", err);
        }
      }

      onNext();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bk-step-content">
      <div className="bk-step-grid">
        
        {/* ── Left Card Panel: Header & Dining Illustration (Screenshot 3 Match) ── */}
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
                ONLINE ONLY MEAL DEALS
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

          <p style={{ fontSize: "0.88rem", color: "#64748B", fontWeight: "600", lineHeight: "1.5", marginBottom: "24px" }}>
            VGP Universal Kingdom offers a delightful array of mouth-watering food dishes. Pre-book your meals online to skip long queues and enjoy seamless park dining!
          </p>

          {/* Dining illustration graphic */}
          <div style={{
            background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
            borderRadius: "20px",
            padding: "30px 20px",
            textAlign: "center",
            border: "1px solid #E2E8F0"
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "8px" }}>🏰 🎡 🍱</div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1E293B", margin: "0 0 6px 0" }}>
              Kutti Raja&apos;s Royal Kitchen
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: "600", margin: 0 }}>
              Unlimited Royal Buffet with 20+ items, Live Counters &amp; Veg/Non-Veg Delights.
            </p>
          </div>
        </div>

        {/* ── Right Card Panel: Meals Selector List (Screenshot 3 Match) ── */}
        <div className="bk-panel" style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "28px 26px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0"
        }}>
          <p style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: "600", margin: "0 0 8px 0" }}>
            Can manage to stand in a long queue later?
          </p>
          <div style={{
            background: "#2563EB",
            color: "#FFFFFF",
            fontWeight: "800",
            fontSize: "0.95rem",
            padding: "10px",
            borderRadius: "14px",
            textAlign: "center",
            marginBottom: "18px"
          }}>
            Meals &amp; Buffet Combos
          </div>

          {/* Scrollable list of meal cards */}
          <div className="bk-meals-scroll" style={{ maxHeight: "380px", overflowY: "auto", paddingRight: "6px", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "18px" }}>
            {foods.map((food) => {
              const foodId = food.id || food.foodId || food.code;
              return (
                <MealCard
                  key={foodId}
                  meal={food}
                  qty={foodQty[foodId] || 0}
                  onChange={(qty) => setFoodQty(foodId, qty)}
                />
              );
            })}
          </div>

          {/* Bottom Action Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", paddingTop: "14px", borderTop: "2px solid #F1F5F9" }}>
            <div>
              <span style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1E293B", display: "block" }}>
                {fmt(grandTotal)}
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94A3B8", letterSpacing: "0.5px" }}>
                TAXES EXTRA
              </span>
            </div>

            <button
              className="cta-big cta-red"
              onClick={handleProceed}
              disabled={loading}
              style={{ flex: 1, padding: "12px 24px", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Calculating…" : "Proceed to Review →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
