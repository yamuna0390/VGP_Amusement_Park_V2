"use client";
import Counter from "./Counter";

export default function MealCard({ meal, qty, onChange }) {
  return (
    <div
      className={`bk-meal-row ${qty > 0 ? "bk-meal-row--active" : ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        background: qty > 0 ? "#FAFAFA" : "#FFFFFF",
        borderRadius: "14px",
        border: `2px solid ${qty > 0 ? "#7C3AED" : "transparent"}`,
        boxShadow: qty > 0 ? "0 4px 12px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease",
        gap: "16px",
        cursor: "pointer"
      }}
      onClick={() => {
        if (qty === 0) onChange(1);
      }}
    >
      {/* Thumbnail */}
      <div
        className="bk-meal-row__img"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "10px",
          overflow: "hidden",
          flexShrink: 0,
          background: meal.bgColor || "#F1F5F9",
          position: "relative"
        }}
      >
        {meal.image ? (
          <img
            src={meal.image}
            alt={meal.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading="lazy"
          />
        ) : (
          <span style={{ fontSize: "2rem", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            {meal.emoji}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="bk-meal-row__body" style={{ flexGrow: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "800",
              color: "#1E293B",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {meal.name}
          </h3>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: "800",
              padding: "2px 6px",
              borderRadius: "10px",
              background: meal.type === "veg" ? "#E6F4EA" : "#FCE8E8",
              color: meal.type === "veg" ? "#1E8E3E" : "#D93025",
              flexShrink: 0
            }}
          >
            {meal.type === "veg" ? "VEG" : "NON-VEG"}
          </span>
        </div>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#64748B",
            margin: "0 0 6px 0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: "600"
          }}
        >
          {meal.description}
        </p>
        <div style={{ fontSize: "1rem", fontWeight: "800", color: "#E11D48" }}>
          ₹{meal.price}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="bk-meal-row__actions" style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        <Counter
          value={qty}
          onDecrement={() => onChange(qty - 1)}
          onIncrement={() => onChange(qty + 1)}
          min={0}
          max={10}
        />
      </div>
    </div>
  );
}
