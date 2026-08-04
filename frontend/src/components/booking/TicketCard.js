"use client";

import Counter from "./Counter";
import { fmt } from "@/utils/bookingCalc";

export default function TicketCard({ ticket, qty, onChange }) {
  const price = Number(ticket.price || 0);
  const isSelected = qty > 0;

  const placeholderText = ticket.name?.split(" ")[0] || "Ticket";
  let fallbackImage = null;
 const codeStr = String(ticket.code || "").toLowerCase();
  const nameStr = String(ticket.name || "").toLowerCase();
  if (codeStr  === "adult" || (nameStr.includes("adult") && !nameStr.includes("double") && !codeStr .includes("dfp"))) {
    fallbackImage = "/images/Thumbnail/Adult.png";
  } else if (codeStr === "child" || (nameStr.includes("child") && !nameStr.includes("double") && !codeStr.includes("dfp"))) {
    fallbackImage = "/images/Thumbnail/child.png";
  } else if (codeStr === "senior" || nameStr.includes("senior")) {
    fallbackImage = "/images/Thumbnail/senior.png";
  } else if (codeStr === "student" || nameStr.includes("student") || nameStr.includes("college")) {
    fallbackImage = "/images/Thumbnail/students.png";
  }

  const imageSrc =
    ticket.image ||
    fallbackImage ||
    `https://placehold.co/180x180/F8FAFC/64748B?text=${placeholderText}`;

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "16px",
        border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
        boxShadow: isSelected
          ? "0 4px 14px rgba(37,99,235,0.12)"
          : "0 2px 8px rgba(0,0,0,0.03)",
        transition: "all 0.2s ease",
        marginBottom: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* Image */}
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
            alt={ticket.name}
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
              fontFamily:
                "var(--font-roboto-condensed), Arial, sans-serif",
            }}
          >
            {ticket.name}
          </h4>

          <div style={{ marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "1.15rem",
                fontWeight: "900",
                color: "#1E293B",
              }}
            >
              {price === 0 ? "FREE" : fmt(price)}
            </span>
          </div>

          {ticket.description && (
            <p
              style={{
                fontSize: "0.8rem",
                color: "#64748B",
                fontWeight: "600",
                lineHeight: "1.4",
                margin: 0,
              }}
            >
              {ticket.description}
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
          {isSelected ? (
            <Counter
              value={qty}
              onDecrement={() => onChange(qty - 1)}
              onIncrement={() => onChange(qty + 1)}
              min={0}
              max={20}
            />
          ) : (
            <button
              onClick={() => onChange(1)}
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
              }}
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}