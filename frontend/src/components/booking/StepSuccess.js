"use client";
import { useBooking } from "@/context/BookingContext";
import Invoice from "@/components/booking/Invoice";
import Link from "next/link";

export default function StepSuccess() {
  const booking = useBooking();
  const { bookingId, resetBooking } = booking;

  return (
    <div className="bk-step-content">
      {/* Success banner */}
      <div className="bk-success-banner">
        <div className="bk-success-icon">✅</div>
        <h2 className="bk-success-title">Booking Confirmed!</h2>
        <p className="bk-success-sub">
          Your booking ID is <strong>{bookingId}</strong>. Show the QR code at the gate.
        </p>
      </div>

      {/* Invoice */}
      <Invoice booking={booking} />

      {/* Action buttons */}
      <div className="bk-success-actions no-print">
        <button
          className="bk-btn-back"
          onClick={resetBooking}
          id="step5-book-again-btn"
        >
          🔄 Book Again
        </button>
        <Link href="/" className="cta-big cta-red" id="step5-home-btn">
          🏰 Back to Home
        </Link>
      </div>
    </div>
  );
}
