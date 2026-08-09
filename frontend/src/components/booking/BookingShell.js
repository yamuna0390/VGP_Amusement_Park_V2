"use client";

import { useEffect } from "react";
import { useBooking } from "@/context/BookingContext";
import { getBookingInit } from "@/services/bookingApi";
import bookingTickets from "@/data/bookingTickets";
import bookingAddons from "@/data/bookingAddons";
import "@/components/booking/booking.css";

import BookingHeader from "@/components/booking/BookingHeader";
import BookingStepper from "@/components/booking/BookingStepper";
import BookingFooter from "@/components/booking/BookingFooter";
import StepDateOffers from "@/components/booking/StepDateOffers";
import StepTickets from "@/components/booking/StepTickets";
import StepAddons from "@/components/booking/StepAddons";
import StepTraveller from "@/components/booking/StepTraveller";
import StepCheckout from "@/components/booking/StepCheckout";
import StepSuccess from "@/components/booking/StepSuccess";

export default function BookingShell() {
  const {
    step,
    setStep,
    setMasterData,
  } = useBooking();

  const goNext = () => setStep(Math.min(step + 1, 6));
  const goBack = () => setStep(Math.max(step - 1, 1));

  useEffect(() => {
    const loadBookingInit = async () => {
      try {
        // [PHASE 2] Temporarily disabled API call since backend is not ready
        // const result = await getBookingInit();
        // 
        // setMasterData({
        //   foods: result.data.meals,
        //   parkSettings: result.data.parkSettings,
        //   regularTickets: bookingTickets,
        // });
        // 
        // console.log("Booking Init Loaded:", result.data);

        // Use local data for Phase 2 UI testing
        setMasterData({
          foods: bookingAddons,
          parkSettings: {},
          regularTickets: bookingTickets,
        });

      } catch (error) {
        console.error("Failed to load booking initialization:", error);
      }
    };

    loadBookingInit();
  }, [setMasterData]);

  return (
    <div className="min-h-screen flex flex-col bk-premium-bg text-gray-800 font-sans">
      <BookingHeader />

      {/* Show stepper on steps 1-5 */}
      {step < 6 && (
        <BookingStepper currentStep={step} />
      )}

      <main className="flex-grow w-full relative z-10">
        <div
          className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 box-border booking-content-glow"
          key={step}
        >
          {step === 1 && <StepDateOffers onNext={goNext} />}

          {step === 2 && (
            <StepTickets
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 3 && (
            <StepAddons
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 4 && (
            <StepTraveller
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 5 && (
            <StepCheckout
              onBack={goBack}
            />
          )}

          {step === 6 && <StepSuccess />}
        </div>
      </main>

      <BookingFooter />
    </div>
  );
}
