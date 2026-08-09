"use client";

import { Minus, Plus } from "lucide-react";
import { fmt } from "@/utils/bookingCalc";

export default function AddonCard({ addon, qty, onChange }) {
  const price = Number(addon.price || 0);
  const isSelected = qty > 0;

  return (
    <div className={`booking-addon-card ${isSelected ? "booking-addon-card--selected" : ""}`}>
      <div className="booking-addon-card__info">
        <h3 className="booking-addon-card__name">{addon.name}</h3>
        {addon.description && (
          <p className="booking-addon-card__desc">{addon.description}</p>
        )}
        <div className="booking-addon-card__price">
          {price === 0 ? "FREE" : fmt(price)}
        </div>
      </div>
      <div className="booking-addon-card__controls">
        <button 
          className="booking-addon-control booking-addon-control--minus"
          onClick={() => onChange(qty - 1)}
          disabled={qty <= 0}
          aria-label={`Decrease ${addon.name} quantity`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="booking-addon-qty" aria-live="polite">
          {qty}
        </span>
        <button 
          className="booking-addon-control booking-addon-control--plus"
          onClick={() => onChange(qty + 1)}
          aria-label={`Increase ${addon.name} quantity`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
