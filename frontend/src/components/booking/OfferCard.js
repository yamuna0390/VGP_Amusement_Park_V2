"use client";

import { Check, Calendar } from "lucide-react";

const OFFER_INDEX_MAP = {
  "EARLYBIRD15": "01",
  "CAMPUS20": "02",
  "DOUBLE_DHAMAKA": "03",
  "AADI_B2G1": "04",
  "FRIENDSHIP_B2G1": "05",
  "LITTLELEGEND_B1G2": "06",
  "BIRTHDAY_BOGO": "07"
};

const OFFER_VALIDITY_MAP = {
  "EARLYBIRD15": "Book 1 Day in Advance",
  "CAMPUS20": "Valid Student ID Required",
  "DOUBLE_DHAMAKA": "2-in-1 Combo Pass",
  "AADI_B2G1": "Min 3 Tickets Required",
  "FRIENDSHIP_B2G1": "Valid for Groups 3+",
  "LITTLELEGEND_B1G2": "Kids under 140cm",
  "BIRTHDAY_BOGO": "Birth Month Special"
};

export default function OfferCard({ offer, isSelected, onSelect, index }) {
  const numBadge = typeof index === "number" ? String(index + 1).padStart(2, "0") : (OFFER_INDEX_MAP[offer.id] || "01");
  const offerTitle = offer.title || offer.name || "Special Offer";
  const offerDesc = offer.description || offer.desc || "";
  const validityText = offer.validity || OFFER_VALIDITY_MAP[offer.id] || offer.terms || "Limited Deal";

  const handleApplyClick = (e) => {
    e.stopPropagation();
    onSelect(offer);
  };

  return (
    <div
      onClick={() => onSelect(offer)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => e.key === "Enter" && onSelect(offer)}
      style={{
        background: isSelected ? "#F0F9FF" : "#FFFFFF",
        borderRadius: "14px",
        padding: "12px 16px",
        border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
        borderLeft: isSelected ? "5px solid #16A34A" : "1px solid #E2E8F0",
        boxShadow: isSelected ? "0 4px 14px rgba(37, 99, 235, 0.12)" : "0 2px 8px rgba(0,0,0,0.03)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        position: "relative",
        margin: "0 0 10px 0"
      }}
      className={`bk-compact-offer-card ${isSelected ? "bk-compact-offer-card--selected" : ""}`}
    >
      {/* ── Top Row: Numbered Badge + Title + Badge Pill ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "4px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
          {/* Compact Numbered Badge (01, 02, 03...) */}
          <div style={{
            fontFamily: "var(--font-roboto-condensed), sans-serif",
            fontSize: "1.15rem",
            fontWeight: "900",
            color: isSelected ? "#2563EB" : "#94A3B8",
            background: isSelected ? "#DBEAFE" : "#F1F5F9",
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            lineHeight: "1"
          }}>
            {numBadge}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <h4 style={{
              fontSize: "1.02rem",
              fontWeight: "900",
              color: "#1E293B",
              margin: 0,
              fontFamily: "var(--font-roboto-condensed), Arial, sans-serif",
              lineHeight: "1.2",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {offerTitle}
            </h4>

            {/* Compact Validity Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              background: isSelected ? "#DCFCE7" : "#EFF6FF",
              color: isSelected ? "#15803D" : "#1D4ED8",
              fontSize: "0.72rem",
              fontWeight: "800",
              padding: "1px 6px",
              borderRadius: "6px",
              marginTop: "2px",
              whiteSpace: "nowrap"
            }}>
              <span>📅 {validityText}</span>
            </div>
          </div>
        </div>

        {/* Offer Discount Badge Pill */}
        {offer.badge && (
          <span style={{
            background: isSelected ? "#16A34A" : (offer.badgeColor || "#B11E63"),
            color: "#FFFFFF",
            fontSize: "0.72rem",
            fontWeight: "900",
            padding: "3px 8px",
            borderRadius: "8px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
          }}>
            {offer.badge}
          </span>
        )}

      </div>

      {/* ── Middle Row: 2-Line Clamped Description ── */}
      <p style={{
        fontSize: "0.84rem",
        color: "#475569",
        fontWeight: "600",
        lineHeight: "1.35",
        margin: "4px 0 8px 0",
        paddingLeft: "44px",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}>
        {offerDesc}
      </p>

      {/* ── Bottom Action Row: Eligibility Chips & Compact Apply Button ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        paddingLeft: "44px",
        flexWrap: "wrap"
      }}>
        
        {/* Eligibility Tags */}
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {offer.eligibility && offer.eligibility.length > 0 ? (
            offer.eligibility.map((tag, i) => (
              <span key={i} style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: "700" }}>
                ✓ {tag}
              </span>
            ))
          ) : (
            <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: "700" }}>
              ✓ All Visitors
            </span>
          )}
        </div>

        {/* Compact Apply Button (~38px height) */}
        <button
          type="button"
          onClick={handleApplyClick}
          style={{
            height: "38px",
            padding: "6px 14px",
            borderRadius: "10px",
            border: "none",
            background: isSelected ? "#16A34A" : "#FDDB00",
            color: isSelected ? "#FFFFFF" : "#1E293B",
            fontWeight: "900",
            fontSize: "0.82rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            boxShadow: isSelected ? "0 2px 8px rgba(22, 163, 74, 0.25)" : "0 2px 8px rgba(253, 219, 0, 0.3)",
            transition: "all 0.2s ease"
          }}
        >
          {isSelected ? (
            <>
              <Check size={15} />
              <span>Applied ✓</span>
            </>
          ) : (
            <>
              <span>Apply Offer ➔</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
