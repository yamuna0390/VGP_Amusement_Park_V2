"use client";

import { Minus, Plus } from "lucide-react";
import { fmt } from "@/utils/bookingCalc";

export default function TicketCard({
  ticket,
  qty = 0,
  onChange,
  bookingType = "regular",
}) {
  const isOffer = bookingType === "offer";

  /*
   * Regular ticket:
   *   name
   *   price
   *
   * Offer ticket:
   *   displayName
   *   displaySubname
   *   offerPrice
   *   instruction
   */
  const displayName = isOffer
    ? ticket.displayName || ticket.name || "Offer"
    : ticket.name || ticket.displayName || "Ticket";

  const displaySubname = isOffer
    ? ticket.displaySubname || ""
    : "";

  const displayPrice = isOffer
    ? Number(ticket.offerPrice ?? ticket.price ?? 0)
    : Number(ticket.price ?? ticket.onlinePrice ?? 0);

  const instruction = isOffer
    ? ticket.instruction || ""
    : "";

  const isSelected = Number(qty) > 0;

  const handleDecrease = () => {
    const nextQty = Math.max(0, Number(qty) - 1);
    onChange(nextQty);
  };

  const handleIncrease = () => {
    onChange(Number(qty) + 1);
  };

  return (
    <div
      className={`booking-ticket-card ${
        isSelected ? "booking-ticket-card--selected" : ""
      } ${isOffer ? "booking-ticket-card--offer" : ""}`}
    >
      <div className="booking-ticket-card__info">

        {/* Display Name */}
        <h3 className="booking-ticket-card__name">
          {displayName}
        </h3>

        {/* Display Subname — e.g. 10% OFF / BOGO */}
        {displaySubname && (
          <div className="booking-ticket-card__offer-subname">
            {displaySubname}
          </div>
        )}

        {/* Regular ticket description */}
        {!isOffer && ticket.description && (
          <p className="booking-ticket-card__desc">
            {ticket.description}
          </p>
        )}

        {/* Price */}
        <div className="booking-ticket-card__price">
          {displayPrice === 0 ? "FREE" : fmt(displayPrice)}
        </div>

        {/* Offer instruction */}
        {isOffer && instruction && (
          <div className="booking-ticket-card__instruction">
            {instruction}
          </div>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="booking-ticket-card__controls">
        <button
          type="button"
          className="booking-ticket-control booking-ticket-control--minus"
          onClick={handleDecrease}
          disabled={Number(qty) <= 0}
          aria-label={`Decrease ${displayName} quantity`}
        >
          <Minus className="w-4 h-4" />
        </button>

        <span
          className="booking-ticket-qty"
          aria-live="polite"
          aria-label={`${displayName} quantity`}
        >
          {qty}
        </span>

        <button
          type="button"
          className="booking-ticket-control booking-ticket-control--plus"
          onClick={handleIncrease}
          aria-label={`Increase ${displayName} quantity`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}