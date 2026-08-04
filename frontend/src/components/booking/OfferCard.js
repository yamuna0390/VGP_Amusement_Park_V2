"use client";

import Counter from "./Counter";
import { fmt } from "@/utils/bookingCalc";

export default function OfferCard({
  offer,
  isSelected,
  onSelect,
}) {

  const handleSelect = () => {
    onSelect(offer);
  };

  const handleRemove = () => {
    onSelect(null);
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "18px",
        border: isSelected
          ? "2px solid #2563EB"
          : "1px solid #E2E8F0",
        boxShadow: isSelected
          ? "0 4px 14px rgba(37,99,235,.12)"
          : "0 2px 8px rgba(0,0,0,.03)",
        transition: "all .2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginBottom: "14px"
      }}
    >

      {/* Heading */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px"
        }}
      >
        <div style={{ flex: 1 }}>

          <h4
            style={{
              margin: 0,
              color: "#1E293B",
              fontWeight: 900,
              fontSize: "1.05rem"
            }}
          >
            {offer.displayName}
          </h4>

          <div
            style={{
              marginTop: "8px"
            }}
          >
            <span
              style={{
                background: "#16A34A",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: ".72rem"
              }}
            >
              {offer.offerLabel}
            </span>
          </div>

        </div>

        <div>

          {isSelected ? (

            <Counter
              value={1}
              min={0}
              max={1}
              onIncrement={() => {}}
              onDecrement={handleRemove}
            />

          ) : (

            <button
              onClick={handleSelect}
              style={{
                height: "36px",
                padding: "0 22px",
                borderRadius: "8px",
                border: "1px solid #2563EB",
                background: "#FFFFFF",
                color: "#2563EB",
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              ADD
            </button>

          )}

        </div>

      </div>

      {/* Price */}

      <div>

        <div
          style={{
            fontSize: "1.35rem",
            fontWeight: 900,
            color: "#1E293B"
          }}
        >
          {fmt(offer.unitPrice)}
          <span
            style={{
              fontSize: ".82rem",
              color: "#64748B",
              marginLeft: "6px",
              fontWeight: 700
            }}
          >
            each
          </span>
        </div>

      </div>

      {/* Initial Pay */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#F8FAFC",
          borderRadius: "10px",
          padding: "10px 12px"
        }}
      >

        <span
          style={{
            fontWeight: 700,
            color: "#475569"
          }}
        >
          Pay
        </span>

        <span
          style={{
            fontWeight: 900,
            color: "#1E293B",
            fontSize: "1rem"
          }}
        >
          {fmt(offer.initialPayAmount)}
        </span>

      </div>

      {/* Free Ticket */}

      {offer.freeQty > 0 && (

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <span
            style={{
              color: "#475569",
              fontWeight: 700
            }}
          >
            Free Tickets
          </span>

          <span
            style={{
              background: "#FEF3C7",
              color: "#92400E",
              padding: "5px 12px",
              borderRadius: "18px",
              fontWeight: 800,
              fontSize: ".75rem"
            }}
          >
            {offer.freeQty} FREE
          </span>

        </div>

      )}

      {/* Instruction */}

      {offer.instruction && (

        <div
          style={{
            borderTop: "1px solid #E2E8F0",
            paddingTop: "12px",
            color: "#64748B",
            fontSize: ".82rem",
            lineHeight: "1.5",
            fontWeight: 600
          }}
        >
          {offer.instruction}
        </div>

      )}

    </div>
  );
}