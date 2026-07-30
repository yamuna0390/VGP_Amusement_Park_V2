"use client";

import Link from "next/link";
import Image from "next/image";
import { useBooking } from "@/context/BookingContext";
import BookingStepper from "@/components/booking/BookingStepper";
import "@/components/booking/booking.css";

export default function BookingHeader() {
  const { step } = useBooking();

  return (
    <header className="bk-header">
      <div className="bk-header-inner">
        <Link href="/" className="bk-logo" aria-label="Return to homepage">
          <Image
            src="/assets/ukd_logo_t.png"
            alt="VGP Universal Kingdom Logo"
            width={180}
            height={60}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>
        {/* Hide stepper after successful booking (step 5) */}
        {step < 5 && (
          <div className="bk-stepper-container">
            <BookingStepper currentStep={step} />
          </div>
        )}
      </div>
    </header>
  );
}
