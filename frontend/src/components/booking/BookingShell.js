"use client";

import { useEffect, useRef } from "react";
import { useBooking } from "@/context/BookingContext";
import { createBookingSession } from "@/services/bookingApi";
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

export default function BookingShell({ initialOfferId }) {
  if (initialOfferId) {
    console.log("BookingShell received initial intent for offer ID:", initialOfferId);
  }

  const {
    step,
    setStep,
    setMasterData,
  } = useBooking();
  
  const hasInitialized = useRef(false);

  const goNext = () => setStep(Math.min(step + 1, 5));
  const goBack = () => setStep(Math.max(step - 1, 1));

  // useEffect(() => {
  //   if (hasInitialized.current) return;
  //   hasInitialized.current = true;

  //   const loadBookingInit = async () => {
  //     try {
  //       const result = await createBookingSession();
        
  //       setMasterData({
  //         foods: result.data.addons || [],
  //         parkSettings: {},
  //         regularTickets: result.data.tickets || result.data.ticketTypes || [],
  //         offerTickets: result.data.offers || [],
  //       });
        
  //       console.log("Booking Init Loaded:", result.data);
  //     } catch (error) {
  //       console.error("Failed to load booking initialization:", error);
  //     }
  //   };

  //   loadBookingInit();
  // }, [setMasterData]);
useEffect(() => {
  console.log("🔥 BookingShell mounted");

  if (hasInitialized.current) {
    console.log("⏭️ Booking initialization already attempted");
    return;
  }

  hasInitialized.current = true;

  console.log("🚀 Creating booking session");

  const loadBookingInit = async () => {
    try {
      const result = await createBookingSession();

      console.log("✅ Booking session created:", result);

      setMasterData({
        foods: result.data.addons || [],
        parkSettings: {},
        regularTickets: result.data.tickets || result.data.ticketTypes || [],
        offerTickets: result.data.offers || [],
      });

      console.log("📦 Booking Init Loaded:", result.data);
    } catch (error) {
      console.error("❌ Failed to load booking initialization:", error);
    }
  };

  loadBookingInit();
}, [setMasterData]);
  return (
    <div className="min-h-screen flex flex-col bk-premium-bg text-gray-800 font-sans">
      <BookingHeader />

      {/* Show stepper on steps 1-5 */}
      {step < 5 && (
        <BookingStepper currentStep={step} />
      )}

      <main className="flex-grow w-full relative z-10">
        <div
          className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 box-border booking-content-glow"
          key={step}
        >
          {step === 1 && <StepDateOffers onNext={goNext} initialOfferId={initialOfferId} />}

          {step === 2 && (
            <StepAddons
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 3 && (
            <StepTraveller
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

      <BookingFooter />
    </div>
  );
}
