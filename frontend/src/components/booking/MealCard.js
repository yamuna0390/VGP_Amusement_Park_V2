"use client";
import Counter from "./Counter";

export default function MealCard({ meal, qty, onChange }) {
  return (
    <div className={`bk-meal ${qty > 0 ? "bk-meal--active" : ""}`}>
      {/* Image / emoji area */}
      <div
        className="bk-meal__img"
        style={{ background: meal.bgColor }}
        aria-hidden="true"
      >
        <span className="bk-meal__emoji">{meal.emoji}</span>
      </div>

      {/* Body */}
      <div className="bk-meal__body">
        <span className={`bk-meal__type ${meal.type === "nonveg" ? "bk-meal__type--nv" : ""}`}>
          {meal.type === "veg" ? "● Veg" : "● Non-veg"}
        </span>
        <h3 className="bk-meal__name">{meal.name}</h3>
        <p className="bk-meal__desc">{meal.description}</p>
        <div className="bk-meal__footer">
          <span className="bk-meal__price">₹{meal.price}</span>
          <Counter
            value={qty}
            onDecrement={() => onChange(qty - 1)}
            onIncrement={() => onChange(qty + 1)}
            min={0}
            max={10}
          />
        </div>
      </div>
    </div>
  );
}
