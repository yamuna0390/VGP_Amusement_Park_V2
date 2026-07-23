"use client";
import Counter from "./Counter";
import { effectivePrice, fmt } from "@/utils/bookingCalc";

export default function TicketCard({ ticket, qty, onChange }) {
  const price = effectivePrice(ticket);
  const hasDiscount = ticket.discountPrice !== null && ticket.discountPrice < ticket.originalPrice;

  return (
    <div className={`bk-ticket ${qty > 0 ? "bk-ticket--active" : ""}`}>
      <div className="bk-ticket__info">
        <h3 className="bk-ticket__name">{ticket.name}</h3>
        <p className="bk-ticket__desc">
          {ticket.description}
          {ticket.ageRule ? ` · ` : ""}
          {ticket.ageRule && (
            <span className="bk-ticket__rule">{ticket.ageRule}</span>
          )}
        </p>
        <div className="bk-ticket__price">
          {hasDiscount && (
            <span className="bk-ticket__original">
              ₹{ticket.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          <span className="bk-ticket__final">
            {price === 0 ? "FREE" : fmt(price)}
          </span>
        </div>
      </div>
      <Counter
        value={qty}
        onDecrement={() => onChange(qty - 1)}
        onIncrement={() => onChange(qty + 1)}
        min={0}
        max={20}
      />
    </div>
  );
}
