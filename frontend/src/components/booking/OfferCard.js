"use client";

import Counter from "./Counter";
import { fmt } from "@/utils/bookingCalc";

export default function OfferCard({
  offer,
  quantity = 0,
  onQuantityChange,
  isSelected,
  onSelect,
  disabled = false,
}) {
  const initialQty = Number(offer.initialQty) || 1;
  const qty = quantity || initialQty;

  const unitPrice = Number(offer.unitPrice) || 0;
  const buyQty = Number(offer.buyQty) || 0;
  const freeQty = Number(offer.freeQty) || 0;

  const totalPay = qty * unitPrice;

  const freeTickets =
    buyQty > 0 && freeQty > 0
      ? Math.floor(qty / buyQty) * freeQty
      : 0;

  const freeText =
    freeTickets === 1
      ? "1 FREE TICKET"
      : `${freeTickets} FREE TICKETS`;

  const isCardSelected =
    isSelected !== undefined
      ? isSelected
      : quantity > 0;

  const handleAdd = () => {
    if (disabled) return;
    if (onQuantityChange) {
      onQuantityChange(initialQty);
    } else if (onSelect) {
      onSelect(offer);
    }
  };

  const handleIncrement = () => {
    if (disabled) return;
    if (onQuantityChange) {
      onQuantityChange(qty + 1);
    }
  };

  const handleDecrement = () => {
    if (disabled || !onQuantityChange) return;
    if (qty > initialQty) {
      onQuantityChange(qty - 1);
    } else if (qty <= initialQty) {
      onQuantityChange(0);
    }
  };

  const placeholderText = offer.displayName?.split(" ")[0] || "Offer";
  let fallbackImage = null;
  const nameStr = String(offer.displayName || offer.offerName || "").toLowerCase();
  const codeStr = String(offer.code || offer.offerTicketId || "").toLowerCase();

  if (
    nameStr.includes("student") ||
    nameStr.includes("campus") ||
    nameStr.includes("college") ||
    codeStr.includes("campus") ||
    codeStr.includes("student")
  ) {
    fallbackImage = "/images/Thumbnail/students.png";
  } else if (
    nameStr.includes("child") ||
    codeStr.includes("child") ||
    nameStr.includes("legend") ||
    nameStr.includes("little")
  ) {
    fallbackImage = "/images/Thumbnail/child.png";
  } else if (nameStr.includes("senior") || codeStr.includes("senior")) {
    fallbackImage = "/images/Thumbnail/senior.png";
  } else if (
    nameStr.includes("adult") ||
    nameStr.includes("early") ||
    nameStr.includes("birthday") ||
    nameStr.includes("aadi") ||
    nameStr.includes("friendship") ||
    codeStr.includes("early") ||
    codeStr.includes("birthday") ||
    codeStr.includes("aadi") ||
    codeStr.includes("friendship")
  ) {
    fallbackImage = "/images/Thumbnail/Adult.png";
  } else {
    fallbackImage = "/images/Thumbnail/Adult.png";
  }

  const imageSrc =
    offer.image ||
    fallbackImage ||
    `https://placehold.co/180x180/F8FAFC/64748B?text=${placeholderText}`;

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "16px",
        border: isCardSelected
          ? "2px solid #2563EB"
          : "1px solid #E2E8F0",
        boxShadow: isCardSelected
          ? "0 4px 14px rgba(37,99,235,0.12)"
          : "0 2px 8px rgba(0,0,0,0.03)",
        transition: "all 0.2s ease",
        marginBottom: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Top Layout Matching TicketCard */}
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* Thumbnail Image */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "12px",
            overflow: "hidden",
            flexShrink: 0,
            background: "#F1F5F9",
          }}
        >
          <img
            src={imageSrc}
            alt={offer.displayName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: "1.05rem",
              fontWeight: "800",
              color: "#1E293B",
              margin: "0 0 6px 0",
              fontFamily: "var(--font-roboto-condensed), Arial, sans-serif",
            }}
          >
            {offer.displayName}
          </h4>

          <div style={{ marginBottom: "6px" }}>
            <span
              style={{
                fontSize: "1.15rem",
                fontWeight: "900",
                color: "#1E293B",
              }}
            >
              {fmt(totalPay)}
            </span>
          </div>

          {offer.instruction && (
            <p
              style={{
                fontSize: "0.8rem",
                color: "#64748B",
                fontWeight: "600",
                lineHeight: "1.4",
                margin: 0,
              }}
            >
              {offer.instruction}
            </p>
          )}
        </div>

        {/* Controls */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {quantity > 0 ? (
            <Counter
              value={quantity}
              min={0}
              max={99}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              disabled={disabled}
            />
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={disabled}
              style={{
                height: "36px",
                padding: "0 24px",
                borderRadius: "8px",
                border: disabled ? "1px solid #CBD5E1" : "1px solid #2563EB",
                background: disabled ? "#F8FAFC" : "#FFFFFF",
                color: disabled ? "#94A3B8" : "#2563EB",
                fontWeight: "800",
                fontSize: "0.85rem",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
              }}
            >
              ADD
            </button>
          )}
        </div>
      </div>

      {/* Compact Details Section with Thin Divider */}
      <div
        style={{
          borderTop: "1px solid #F1F5F9",
          paddingTop: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {/* Paid Tickets Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.82rem",
            lineHeight: "1.4",
          }}
        >
          <span style={{ color: "#64748B", fontWeight: "600" }}>
            Paid Tickets
          </span>
          <span style={{ color: "#1E293B", fontWeight: "700" }}>
            {qty} {qty === 1 ? "Ticket" : "Tickets"}
          </span>
        </div>

        {/* Offer Label Row */}
        {offer.offerLabel && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.82rem",
              lineHeight: "1.4",
            }}
          >
            <span style={{ color: "#64748B", fontWeight: "600" }}>
              Offer
            </span>
            <span
              style={{
                background: "#16A34A",
                color: "#FFFFFF",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: "700",
                fontSize: "0.72rem",
              }}
            >
              {offer.offerLabel}
            </span>
          </div>
        )}

        {/* Free Tickets Row */}
        {freeTickets > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.82rem",
              lineHeight: "1.4",
            }}
          >
            <span style={{ color: "#64748B", fontWeight: "600" }}>
              Free Tickets
            </span>
            <span
              style={{
                background: "#FEF3C7",
                color: "#92400E",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: "700",
                fontSize: "0.72rem",
              }}
            >
              {freeText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}