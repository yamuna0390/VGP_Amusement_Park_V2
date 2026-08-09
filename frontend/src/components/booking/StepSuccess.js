"use client";
import { useEffect, useState } from "react";
import { useBooking } from "@/context/BookingContext";
import Invoice from "@/components/booking/Invoice";
import QrTicket from "@/components/booking/QrTicket";
import Link from "next/link";
// import { confirmPayment } from "@/services/bookingApi";

export default function StepSuccess() {
  const booking = useBooking();
  const { bookingId, bookingResult, resetBooking } = booking;
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Auto-confirm payment on success page load (simulated payment gateway callback)
  useEffect(() => {
    if (bookingResult?.bookingId && !paymentConfirmed) {
      confirmPayment(bookingResult.bookingId)
        .then(() => setPaymentConfirmed(true))
        .catch((err) => {
          // Non-fatal: booking is still created, just status not updated
          console.warn("Payment confirmation warning:", err.message);
          setPaymentConfirmed(true); // allow page to proceed
        });
    }
  }, [bookingResult?.bookingId]);

  // Build the booking object for QrTicket from the context state
  const qrData = bookingResult ? {
    bookingNumber: booking.bookingId,
    visitDate: booking.visitDate,
    customer: booking.customer,
    customer_name: booking.customer?.name,
    customer_mobile: booking.customer?.mobile,
    offer_name: booking.offer_name,
    coupon_code: booking.couponCode || null,
    visitor_count: bookingResult.visitorCount || 1,
    tickets: booking.tickets || [],
  } : null;

  return (
    <div className="bk-step-content">
      {/* Success banner */}
      <div className="bk-success-banner">
        <div className="bk-success-icon">✅</div>
        <h2 className="bk-success-title">Booking Confirmed!</h2>
        <p className="bk-success-sub">
          Your booking ID is <strong>{bookingId}</strong>. Show the QR code at the gate.
        </p>
        {paymentError && (
          <p style={{ color: "var(--red)", fontSize: "0.85rem", marginTop: "8px", fontWeight: "700" }}>
            {paymentError}
          </p>
        )}
      </div>

      {/* QR Ticket */}
      {qrData && <QrTicket booking={qrData} />}

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
