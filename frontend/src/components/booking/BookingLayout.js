"use client";

import { useBooking } from "@/context/BookingContext";

import BookingStepper from "./BookingStepper";
import BookingSummary from "./BookingSummary";

import StepDateOffers from "./StepDateOffers";
import StepTickets from "./StepTickets";
import StepFood from "./StepFood";
import StepCheckout from "./StepCheckout";
import StepSuccess from "./StepSuccess";

export default function BookingLayout() {
  const { step } = useBooking();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepDateOffers />;

      case 2:
        return <StepTickets />;

      case 3:
        return <StepFood />;

      case 4:
        return <StepCheckout />;

      case 5:
        return <StepSuccess />;

      default:
        return <StepDateOffers />;
    }
  };

  return (
    <section className="booking-page">
      <div className="container">

        {/* Page Header */}
        <div className="booking-header">

          <span className="booking-badge">
            VGP Universal Kingdom
          </span>

          <h1 className="booking-title">
            Book Your Visit
          </h1>

          <p className="booking-subtitle">
            Plan your perfect day with exciting rides, attractions,
            delicious food and unforgettable memories.
          </p>

        </div>

        {/* Progress */}
        <BookingStepper />

        {/* Main Layout */}
        <div className="booking-layout">

          {/* Left Content */}
          <div className="booking-content">

            {renderStep()}

          </div>

          {/* Right Summary */}
          <aside className="booking-sidebar">

            <BookingSummary />

          </aside>

        </div>

      </div>
    </section>
  );
}