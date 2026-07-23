"use client";

const STEPS = [
  { num: 1, label: "Date & Offers" },
  { num: 2, label: "Tickets" },
  { num: 3, label: "Food" },
  { num: 4, label: "Checkout" },
];

export default function BookingStepper({ currentStep }) {
  return (
    <div className="bk-stepper" role="navigation" aria-label="Booking steps">
      {STEPS.map((s, i) => {
        const done    = currentStep > s.num;
        const active  = currentStep === s.num;
        return (
          <div key={s.num} className="bk-step-wrap">
            <div className={`bk-step ${active ? "bk-step--active" : ""} ${done ? "bk-step--done" : ""}`}>
              <span className="bk-step__num">
                {done ? "✓" : s.num}
              </span>
              <span className="bk-step__label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <span className={`bk-step__arrow ${done ? "bk-step__arrow--done" : ""}`} aria-hidden="true">
                →
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
