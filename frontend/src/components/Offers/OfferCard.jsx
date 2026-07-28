"use client";

import React from "react";
import { Check } from "lucide-react";
import "./OfferCard.css";

const OFFER_INDEX_MAP = {
  "early-bird": "01",
  "student-discount": "02",
  "double-dhamaka": "03",
  "aadi-offer": "04",
  "friendship-day": "05",
  "little-legend": "06",
  "birthday-offer": "07",
  "EARLYBIRD15": "01",
  "CAMPUS20": "02",
  "DOUBLE_DHAMAKA": "03",
  "AADI_B2G1": "04",
  "FRIENDSHIP_B2G1": "05",
  "LITTLELEGEND_B1G2": "06",
  "BIRTHDAY_BOGO": "07"
};

export default function OfferCard({ offer, isSelected, onSelect, index }) {
  const numBadge = typeof index === "number" ? String(index + 1).padStart(2, "0") : (OFFER_INDEX_MAP[offer.id] || "01");
  const offerTitle = offer.title || offer.name || "Special Offer";
  const offerDesc = offer.description || offer.desc || "";
  const validityText = offer.validity || offer.terms || "Limited Deal";

  const handleApply = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(offer);
    }
  };

  return (
    <div
      className={`bk-compact-offer-card ${isSelected ? "bk-compact-offer-card--selected" : ""}`}
      onClick={handleApply}
      role="button"
      tabIndex={0}
    >
      <div className="bk-compact-offer-top">
        <div className="bk-compact-offer-header">
          <div className="bk-compact-offer-num">{numBadge}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h4 className="bk-compact-offer-title">{offerTitle}</h4>
            <span className="bk-compact-offer-validity">📅 {validityText}</span>
          </div>
        </div>

        {offer.badge && (
          <span className="bk-compact-offer-badge">{offer.badge}</span>
        )}
      </div>

      <p className="bk-compact-offer-desc">{offerDesc}</p>

      <div className="bk-compact-offer-footer">
        <div className="bk-compact-offer-tags">
          {offer.applicableFor ? (
            offer.applicableFor.map((tag, i) => (
              <span key={i} className="bk-compact-offer-tag">✓ {tag}</span>
            ))
          ) : offer.eligibility ? (
            offer.eligibility.map((tag, i) => (
              <span key={i} className="bk-compact-offer-tag">✓ {tag}</span>
            ))
          ) : (
            <span className="bk-compact-offer-tag">✓ All Visitors</span>
          )}
        </div>

        <button
          type="button"
          className={`bk-compact-offer-btn ${isSelected ? "bk-compact-offer-btn--applied" : ""}`}
          onClick={handleApply}
        >
          {isSelected ? (
            <>
              <Check size={15} />
              <span>Applied ✓</span>
            </>
          ) : (
            <span>Apply Offer ➔</span>
          )}
        </button>
      </div>
    </div>
  );
}
