"use client";

export default function OfferBadge({ label, color }) {
  return (
    <span
      style={{
        background: color || "#16A34A",
        color: "#FFFFFF",
        fontSize: "0.72rem",
        fontWeight: "900",
        padding: "3px 10px",
        borderRadius: "12px",
        whiteSpace: "nowrap",
        letterSpacing: "0.5px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        textTransform: "uppercase"
      }}
    >
      {label}
    </span>
  );
}
