"use client";
import { calcTotals, fmt } from "@/utils/bookingCalc";
import { TICKETS } from "@/data/tickets";
import { MEALS } from "@/data/meals";

export default function BookingSummary({
  ticketQty,
  mealQty,
  offer,
  couponCode,
  visitDate,
  compact = false,
}) {
  const t = calcTotals(ticketQty, mealQty, offer, couponCode);

  const selectedTickets = TICKETS.filter((tk) => (ticketQty[tk.id] || 0) > 0);
  const selectedMeals   = MEALS.filter((m) => (mealQty[m.id] || 0) > 0);

  return (
    <div className={`bk-summary ${compact ? "bk-summary--compact" : ""}`}>
      {visitDate && (
        <div className="bk-summary__row bk-summary__date">
          <span>📅 Visit Date</span>
          <strong>{visitDate}</strong>
        </div>
      )}

      {offer && (
        <div className="bk-summary__row bk-summary__offer">
          <span>🎁 {offer.title}</span>
          <strong className="bk-summary__discount">−{fmt(t.offerDiscount)}</strong>
        </div>
      )}

      {selectedTickets.map((tk) => (
        <div key={tk.id} className="bk-summary__row">
          <span>
            {tk.name} × {ticketQty[tk.id]}
          </span>
          <span>
            {fmt(
              (tk.discountPrice !== null ? tk.discountPrice : tk.originalPrice) *
                ticketQty[tk.id]
            )}
          </span>
        </div>
      ))}

      {selectedMeals.map((m) => (
        <div key={m.id} className="bk-summary__row">
          <span>
            {m.name} × {mealQty[m.id]}
          </span>
          <span>{fmt(m.price * mealQty[m.id])}</span>
        </div>
      ))}

      {t.couponDiscount > 0 && (
        <div className="bk-summary__row bk-summary__discount">
          <span>🎟 Coupon ({couponCode})</span>
          <strong>−{fmt(t.couponDiscount)}</strong>
        </div>
      )}

      <div className="bk-summary__row">
        <span>GST on tickets (18%)</span>
        <span>+{fmt(t.ticketGST)}</span>
      </div>
      <div className="bk-summary__row">
        <span>GST on food (5%)</span>
        <span>+{fmt(t.foodGST)}</span>
      </div>
      <div className="bk-summary__row">
        <span>Convenience fee (min ₹{t.convenienceFee})</span>
        <span>+{fmt(t.convenienceFee)}</span>
      </div>

      <div className="bk-summary__total">
        <span>Total Payable</span>
        <strong>{fmt(t.grandTotal)}</strong>
      </div>
    </div>
  );
}
