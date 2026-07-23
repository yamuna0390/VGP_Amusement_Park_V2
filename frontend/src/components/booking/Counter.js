"use client";

export default function Counter({ value, onDecrement, onIncrement, min = 0, max = 99 }) {
  return (
    <div className="bk-counter" role="group" aria-label="Quantity selector">
      <button
        className="bk-counter__btn bk-counter__btn--minus"
        onClick={onDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="bk-counter__val" aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        className="bk-counter__btn bk-counter__btn--plus"
        onClick={onIncrement}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
