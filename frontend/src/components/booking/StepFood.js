"use client";
import { useBooking } from "@/context/BookingContext";
import MealCard from "@/components/booking/MealCard";
import { MEALS } from "@/data/meals";
import { calcTicketSubtotal, calcFoodSubtotal, totalTicketCount, fmt } from "@/utils/bookingCalc";

export default function StepFood({ onNext, onBack }) {
  const { mealQty, setMealQty, ticketQty, selectedOffer } = useBooking();

  const ticketTotal = calcTicketSubtotal(ticketQty);
  const foodTotal   = calcFoodSubtotal(mealQty);
  const ticketCount = totalTicketCount(ticketQty);
  const mealCount   = Object.values(mealQty).reduce((s, v) => s + v, 0);

  return (
    <div className="bk-step-content">
      <div className="bk-panel bk-panel--wide">
        <h2 className="bk-panel__title">
          🍽 Add Meals &amp; Combos <span className="bk-optional">(Optional)</span>
        </h2>
        <div className="bk-info-banner">
          Pre-book meals from Kutti Raja&apos;s Royal Kitchen — served hot, skip the queue.{" "}
          Outside food is <strong>not allowed</strong> inside the park.
        </div>

        <div className="bk-meals-grid">
          {MEALS.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              qty={mealQty[meal.id] || 0}
              onChange={(qty) => setMealQty(meal.id, qty)}
            />
          ))}
        </div>

        {/* Sticky summary bar */}
        <div className="bk-sticky-bar">
          {selectedOffer && (
            <span className="bk-sticky-bar__offer">🎁 {selectedOffer.title}</span>
          )}
          <span className="bk-sticky-bar__count">
            🎟 {ticketCount} ticket{ticketCount !== 1 ? "s" : ""} · Subtotal{" "}
            {fmt(ticketTotal + foodTotal)} (before tax)
          </span>
        </div>

        <div className="bk-nav-btns">
          <button className="bk-btn-back" onClick={onBack} id="step3-back-btn">← Back</button>
          <button className="cta-big cta-red" onClick={onNext} id="step3-next-btn">
            Next: Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
