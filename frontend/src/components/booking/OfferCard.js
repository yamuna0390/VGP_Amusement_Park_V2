"use client";

import { Check, Calendar } from "lucide-react";
import Counter from "./Counter";

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

export default function OfferCard({ offer, isSelected, onSelect }) {
  const offerTitle = offer.title || offer.name || "Special Offer";
  const offerDesc = offer.description || offer.desc || "";
  const validityText = offer.validity || offer.terms || "Limited Deal";

  // Simulate pricing if present in data, otherwise just show the badge
  const hasPrice = offer.price !== undefined || offer.adultPrice !== undefined;
  const currentPrice = offer.price || offer.adultPrice || 0;
  const originalPrice = currentPrice + (offer.saving || offer.adultSaving || 0);
  const hasDiscount = originalPrice > currentPrice;

  // Determine if this offer includes free tickets
  const includesFree = offer.discountType === "bogo" || offer.discountType === "combo" || offer.discountType === "b2g1" || offer.id === "BIRTHDAY_BOGO" || offer.id === "LITTLELEGEND_B1G2";
  
  const handleQtyChange = (newQty) => {
    if (newQty > 0) {
      onSelect(offer);
    } else {
      onSelect(null);
    }
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "16px",
        border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
        boxShadow: isSelected ? "0 4px 14px rgba(37, 99, 235, 0.12)" : "0 2px 8px rgba(0,0,0,0.03)",
        transition: "all 0.2s ease",
        marginBottom: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
    >
      {/* ── Main Ticket Area ── */}
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        
        {/* Left Image */}
        {offer.image && (
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "12px",
            overflow: "hidden",
            flexShrink: 0,
            background: "#F1F5F9"
          }}>
            <img 
              src={offer.image} 
              alt={offerTitle} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
        )}

        {/* Center Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{
            fontSize: "1.05rem",
            fontWeight: "800",
            color: "#1E293B",
            margin: "0 0 6px 0",
            fontFamily: "var(--font-roboto-condensed), Arial, sans-serif",
            lineHeight: "1.2"
          }}>
            {offerTitle}
          </h4>

          {/* Pricing Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            {hasPrice && (
              <>
                <span style={{ fontSize: "1.15rem", fontWeight: "900", color: "#1E293B" }}>
                  ₹{currentPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span style={{ fontSize: "0.85rem", color: "#94A3B8", textDecoration: "line-through", fontWeight: "600" }}>
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </>
            )}
            
            {/* Discount Badge */}
            {offer.badge && (
              <span style={{
                background: "#16A34A",
                color: "#FFFFFF",
                fontSize: "0.72rem",
                fontWeight: "900",
                padding: "2px 8px",
                borderRadius: "6px",
                whiteSpace: "nowrap"
              }}>
                {offer.badge}
              </span>
            )}
          </div>

          <p style={{
            fontSize: "0.8rem",
            color: "#64748B",
            fontWeight: "600",
            lineHeight: "1.4",
            margin: 0
          }}>
            ({validityText})
          </p>
        </div>

        {/* Right Controls */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          {isSelected ? (
            <Counter
              value={1}
              onDecrement={() => handleQtyChange(0)}
              onIncrement={() => {}}
              min={0}
              max={1}
            />
          ) : (
            <button
              onClick={() => handleQtyChange(1)}
              style={{
                height: "36px",
                padding: "0 24px",
                borderRadius: "8px",
                border: "1px solid #2563EB",
                background: "#FFFFFF",
                color: "#2563EB",
                fontWeight: "800",
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#EFF6FF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; }}
            >
              ADD
            </button>
          )}
        </div>
      </div>

      {/* ── Free Ticket Display ── */}
      {includesFree && (
        <div style={{
          borderTop: "1px solid #F1F5F9",
          paddingTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1E293B", margin: 0 }}>
              {offer.title ? offer.title + " - Free" : "Free Ticket"}
            </h4>
            <span style={{ background: "#FBBF24", color: "#78350F", fontSize: "0.7rem", fontWeight: "900", padding: "2px 6px", borderRadius: "12px" }}>
              Free
            </span>
          </div>
          
          <div>
            {isSelected ? (
              <span style={{
                background: "#16A34A",
                color: "#FFFFFF",
                fontSize: "0.75rem",
                fontWeight: "800",
                padding: "4px 10px",
                borderRadius: "6px"
              }}>
                Free Ticket Added
              </span>
            ) : (
              <span style={{
                background: "#F1F5F9",
                color: "#94A3B8",
                fontSize: "0.75rem",
                fontWeight: "800",
                padding: "4px 10px",
                borderRadius: "6px"
              }}>
                0
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
