"use client";

import { useEffect } from "react";

import { useBooking } from "@/context/BookingContext";
import { getBookingInit } from "@/services/bookingApi";

import "@/components/booking/booking.css";

import StepDateOffers from "@/components/booking/StepDateOffers";
import StepTickets from "@/components/booking/StepTickets";
import StepFood from "@/components/booking/StepFood";
import StepCheckout from "@/components/booking/StepCheckout";
import StepSuccess from "@/components/booking/StepSuccess";

export default function BookPage() {
  const {
    step,
    setStep,
    setMasterData,
  } = useBooking();

  const goNext = () => setStep(Math.min(step + 1, 5));
  const goBack = () => setStep(Math.max(step - 1, 1));

  useEffect(() => {
    const loadBookingInit = async () => {
      try {
        const data = await getBookingInit();

        setMasterData({
          tickets: data.tickets,
          meals: data.meals,
          parkSettings: data.parkSettings,
        });

        console.log("Booking Init Loaded:", data);
      } catch (error) {
        console.error("Failed to load booking initialization:", error);
      }
    };

    loadBookingInit();
  }, [setMasterData]);

  return (
    <main
      className="bk-page"
      style={{
        background: "#F4F5F7",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}
    >
      {/* Booking Steps Body */}
      <div
        className="bk-body"
        key={step}
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "24px 16px",
        }}
      >
        {step === 1 && <StepDateOffers onNext={goNext} />}

        {step === 2 && (
          <StepTickets
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 3 && (
          <StepFood
            onNext={goNext}
            onBack={goBack}
          />
        )}

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