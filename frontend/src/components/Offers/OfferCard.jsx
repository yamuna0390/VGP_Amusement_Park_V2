"use client";

import React from "react";
import { Check } from "lucide-react";
import "./OfferCard.css";

export default function OfferCard({
  offer,
  isSelected,
  onSelect,
  index,
}) {
  const numBadge = String(index + 1).padStart(2, "0");

  let badge = "";

  switch (offer.offerRule) {
    case "PERCENTAGE":
      badge = `${offer.discountValue}% OFF`;
      break;

    case "FLAT":
      badge = `₹${offer.discountValue} OFF`;
      break;

    case "BOGO":
      badge = "BUY 1 GET 1";
      break;

    case "B2G1":
      badge = "BUY 2 GET 1";
      break;

    default:
      badge = offer.offerRule;
  }

  const applicable =
    offer.applicableTickets?.includes("all")
      ? "All Ticket Types"
      : offer.applicableTickets?.join(", ");

  const handleApply = (e) => {
    e.stopPropagation();
    onSelect?.(offer);
  };

  return (
    <div
      className={`bk-compact-offer-card ${
        isSelected ? "bk-compact-offer-card--selected" : ""
      }`}
      onClick={handleApply}
    >
      <div className="bk-compact-offer-top">
        <div className="bk-compact-offer-header">
          <div className="bk-compact-offer-num">
            {numBadge}
          </div>

          <div style={{ flex: 1 }}>
            <h4 className="bk-compact-offer-title">
              {offer.offerName}
            </h4>

            <span className="bk-compact-offer-validity">
              {badge}
            </span>
          </div>
        </div>

        <span className="bk-compact-offer-badge">
          {badge}
        </span>
      </div>

      {offer.description && (
        <p className="bk-compact-offer-desc">
          {offer.description}
        </p>
      )}

      <div className="bk-compact-offer-footer">
        <div className="bk-compact-offer-tags">
          <span className="bk-compact-offer-tag">
            ✓ {applicable}
          </span>
        </div>

        <button
          type="button"
          className={`bk-compact-offer-btn ${
            isSelected
              ? "bk-compact-offer-btn--applied"
              : ""
          }`}
          onClick={handleApply}
        >
          {isSelected ? (
            <>
              <Check size={15} />
              <span>Applied</span>
            </>
          ) : (
            <span>Apply Offer</span>
          )}
        </button>
      </div>

      {/* Footer Arrow Action */}
      <div className="bk-compact-offer-footer-action">
        <button
          type="button"
          className="bk-compact-offer-arrow"
          aria-label={`Select ${offer.offerName}`}
          onClick={handleApply}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}