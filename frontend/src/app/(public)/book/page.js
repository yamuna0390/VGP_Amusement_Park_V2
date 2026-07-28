"use client";

import { useBooking } from "@/context/BookingContext";
import "@/components/booking/booking.css";

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
    <main className="bk-page" style={{ background: "#F4F5F7", minHeight: "100vh", paddingBottom: "60px" }}>
      {/* Hide stepper after successful booking */}
      {step < 5 && (
        <div style={{ background: "#ffffff", borderBottom: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
            <BookingStepper currentStep={step} />
          </div>
        </div>
      )}

      {/* Booking Steps Body */}
      <div className="bk-body" key={step} style={{ maxWidth: "1180px", margin: "0 auto", padding: "24px 16px" }}>
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