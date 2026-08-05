"use client";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { createBooking } from "@/services/bookingApi";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import BookingSummary from "@/components/booking/BookingSummary";
import CustomerForm from "@/components/booking/CustomerForm";
import { fmt } from "@/utils/bookingCalc";

function validateCustomer(c) {
  const errs = {};
  if (!c.name?.trim()) errs.name = "Name is required.";
  if (!c.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email))
    errs.email = "Valid email is required.";
  if (!c.mobile?.trim() || !/^[6-9]\d{9}$/.test(c.mobile.replace(/\D/g, "").slice(-10)))
    errs.mobile = "Valid 10-digit Indian mobile number required.";
  return errs;
}

export default function StepCheckout({ onBack }) {
  const {
    visitDate,
    offerQty,
    ticketQty,
    foodQty,
    masterData,
    couponCode,
    customer,
    setCustomer,
    agreedToTerms,
    setTerms,
    setStep,
    setBookingResult,
  } = useBooking();

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setCustomer({
        name: user.fullName || "",
        email: user.email || "",
        mobile: user.phone || "",
      });
    }
  }, [user, setCustomer]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handlePay = async () => {
    const errs = validateCustomer(customer);

    if (!agreedToTerms) {
      errs.terms = "You must agree to the Terms & Conditions.";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setApiError("");
    setSubmitting(true);

    try {
      const tickets = Object.entries(ticketQty || {})
        .filter(([, quantity]) => quantity > 0)
        .map(([ticketType, quantity]) => {
          const ticket = (masterData.regularTickets || []).find((t) => (t.id === ticketType || t.code === ticketType || t.ticketId === ticketType));
          return {
            ticketTypeId: ticket ? (ticket.id || ticket.dbId || ticket.ticketTypeId) : null,
            quantity,
          };
        })
        .filter((t) => t.ticketTypeId !== null);

      const meals = Object.entries(foodQty || {})
        .filter(([, quantity]) => quantity > 0)
        .map(([foodType, quantity]) => {
          const foodItem = (masterData.foods || []).find((m) => (m.id === foodType || m.code === foodType || m.foodId === foodType));
          return {
            mealTypeId: foodItem ? (foodItem.id || foodItem.dbId || foodItem.mealTypeId) : null,
            quantity,
          };
        })
        .filter((m) => m.mealTypeId !== null);

      const payload = {
        visitDate,
        customer,
        couponCode: couponCode || null,
        offerCode: null,
        tickets,
        meals,
        agreedToTerms,
      };

      const bookingResult = await createBooking(payload);
      setBookingResult(bookingResult);
    } catch (error) {
      setApiError(error.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bk-step-content">
      <div className="bk-step-grid">
        
        {/* ── Left Card Panel: Review Booking Summary (Screenshot 4 Match) ── */}
        <div className="bk-panel" style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "28px 26px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0"
        }}>
          {/* Header row with back button + Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={onBack}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#FDDB00",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1E293B",
                fontWeight: "900",
                cursor: "pointer"
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <h2 style={{
              fontSize: "1.45rem",
              fontWeight: "900",
              color: "#1E293B",
              fontFamily: "var(--font-roboto-condensed), sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: 0
            }}>
              REVIEW YOUR BOOKING
            </h2>
          </div>

          <BookingSummary
            ticketQty={ticketQty}
            foodQty={foodQty}
            offerQty={offerQty}
            couponCode={couponCode}
            visitDate={visitDate}
          />
        </div>

        {/* ── Right Card Panel: Billing Information Form (Screenshot 4 Match) ── */}
        <div className="bk-panel" style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "28px 26px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0"
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1E293B", textTransform: "uppercase", marginBottom: "18px" }}>
            ADD YOUR BILLING INFORMATION
          </h3>

          <CustomerForm
            customer={customer}
            onChange={(key, val) => setCustomer({ [key]: val })}
            errors={errors}
          />

          {/* Terms & Conditions Checkbox */}
          <div className="bk-terms" style={{ marginTop: "20px" }}>
            <label className="bk-terms__label" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <input
                type="checkbox"
                className="bk-terms__chk"
                checked={agreedToTerms}
                onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: undefined })); }}
                id="terms-chk"
                style={{ marginTop: "3px" }}
              />
              <span style={{ fontSize: "0.85rem", color: "#475569", fontWeight: "600", lineHeight: "1.4" }}>
                I agree to the VGP Universal Kingdom{" "}
                <a href="/terms" className="bk-terms__link" style={{ color: "#2563EB", textDecoration: "underline" }}>Terms &amp; Conditions</a> and Privacy Policy.
              </span>
            </label>
            {errors.terms && <p className="bk-err" role="alert" style={{ color: "#DC2626", fontWeight: "700", marginTop: "6px" }}>{errors.terms}</p>}
          </div>

          {apiError && (
            <p className="bk-err" role="alert" style={{ color: "#DC2626", fontWeight: "700", marginTop: "10px" }}>
              {apiError}
            </p>
          )}

          <button
            className="cta-big cta-red"
            onClick={handlePay}
            disabled={submitting}
            id="step4-pay-btn"
            style={{ width: "100%", marginTop: "22px", padding: "14px 24px", fontSize: "1.05rem" }}
          >
            {submitting ? "Processing Booking…" : "Book Now 🎟"}
          </button>
        </div>
      </div>
    </div>
  );
}
