"use client";

const STEPS = [
  { num: 1, label: "Date" },
  { num: 2, label: "Tickets" },
  { num: 3, label: "Food" },
  { num: 4, label: "Checkout" },
  { num: 5, label: "Done" },
];

export default function BookingStepper({ currentStep }) {
  return (
    <div className="bk-stepper" role="navigation" aria-label="Booking progress">
      {STEPS.map((s, i) => {
        const done = currentStep > s.num;
        const active = currentStep === s.num;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={s.num} className="bk-step-wrap">
            <div className={`bk-step ${active ? "bk-step--active" : ""} ${done ? "bk-step--done" : ""}`}>
              <div className="bk-step__circle">
                {done ? "✓" : active ? "●" : ""}
              </div>
              <span className="bk-step__label">{s.label}</span>
            </div>
            {!isLast && (
              <div className={`bk-step__line ${done ? "bk-step__line--done" : ""}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
