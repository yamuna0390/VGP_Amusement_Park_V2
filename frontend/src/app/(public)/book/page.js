"use client";

import { useBooking } from "@/context/BookingContext";

import BookingStepper from "@/components/booking/BookingStepper";
import StepDateOffers from "@/components/booking/StepDateOffers";
import StepTickets from "@/components/booking/StepTickets";
import StepFood from "@/components/booking/StepFood";
import StepCheckout from "@/components/booking/StepCheckout";
import StepSuccess from "@/components/booking/StepSuccess";

export default function BookPage() {
  const { step, setStep } = useBooking();

  const goNext = () => setStep(Math.min(step + 1, 5));
  const goBack = () => setStep(Math.max(step - 1, 1));

  return (
    <main className="bk-page">
      {/* Page heading */}
      <div className="bk-page__head">
        <p className="bk-page__kicker">Your day, planned</p>
        <h1 className="bk-page__title">Book Now</h1>
      </div>

      {/* Greek zigzag divider */}
      <div className="greek" aria-hidden="true" />

      {/* Hide stepper after successful booking */}
      {step < 5 && <BookingStepper currentStep={step} />}

      {/* Booking Steps */}
      <div className="bk-body" key={step}>
        {step === 1 && <StepDateOffers onNext={goNext} />}
        {step === 2 && <StepTickets onNext={goNext} onBack={goBack} />}
        {step === 3 && <StepFood onNext={goNext} onBack={goBack} />}

        {step === 4 && (
          <StepCheckout
            onBack={goBack}
          />
        )}

        {step === 5 && <StepSuccess />}
      </div>
    </main>
  );
}