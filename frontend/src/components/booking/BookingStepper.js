"use client";

import { Check } from "lucide-react";

const STEPS = [
  { num: 1, label: "Date & Offer" },
  { num: 2, label: "Tickets" },
  { num: 3, label: "Add-ons" },
  { num: 4, label: "Customer Info" },
  { num: 5, label: "Checkout" },
];

export default function BookingStepper({ currentStep }) {
  return (
    <div className="booking-stepper">
      <div className="booking-stepper__inner">
        {STEPS.map((s, i) => {
          const done = currentStep > s.num;
          const active = currentStep === s.num;
          const isLast = i === STEPS.length - 1;

          let stepClass = "booking-step";
          if (active) stepClass += " booking-step--active";
          if (done) stepClass += " booking-step--completed";
          if (!active && !done) stepClass += " booking-step--future";

          return (
            <div key={s.num} className="booking-stepper__item">
              <div className={stepClass}>
                <div className="booking-step__circle">
                  {done ? (
                    <Check className="booking-step__check" />
                  ) : (
                    <span>{s.num}</span>
                  )}
                </div>
                <span className="booking-step__label">{s.label}</span>
              </div>

              {!isLast && (
                <div
                  className={`booking-stepper__connector ${
                    done ? "booking-stepper__connector--done" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
