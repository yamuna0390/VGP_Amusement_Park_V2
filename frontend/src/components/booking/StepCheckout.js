"use client";
import { useState, useEffect } from "react";
import { createBooking } from "@/services/bookingApi";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import CouponForm from "@/components/booking/CouponForm";
import CustomerForm from "@/components/booking/CustomerForm";
import BookingSummary from "@/components/booking/BookingSummary";
import { calcTicketSubtotal } from "@/utils/bookingCalc";

function validateCustomer(c) {
  const errs = {};
  if (!c.name?.trim()) errs.name = "Name is required.";
  if (!c.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email))
    errs.email = "Valid email is required.";
  if (!c.mobile?.trim() || !/^[6-9]\d{9}$/.test(c.mobile.replace(/\D/g, "").slice(-10)))
    errs.mobile = "Valid 10-digit Indian mobile number required.";
  return errs;
}

export default function StepCheckout({ onBack, onConfirm }) {
const {
  visitDate,
  selectedOffer,

  ticketQty,
  mealQty,

  couponCode,
  appliedCoupon,
  setCoupon,

  customer,
  setCustomer,

  agreedToTerms,
  setTerms,

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

  const ticketBase = calcTicketSubtotal(ticketQty);

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

    const tickets = Object.entries(ticketQty)
      .filter(([, quantity]) => quantity > 0)
      .map(([ticketType, quantity]) => ({
        ticketType,
        quantity,
      }));

    const meals = Object.entries(mealQty)
      .filter(([, quantity]) => quantity > 0)
      .map(([mealType, quantity]) => ({
        mealType,
        quantity,
      }));
const payload = {
  visitDate,
  customer,
  couponCode,
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
      <div className="bk-panel bk-panel--wide">
        {/* Coupon */}
        <CouponForm
          ticketSubtotal={ticketBase}
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          onApply={(code, coupon) => setCoupon(code, coupon)}
        />

        <hr className="bk-divider" />

        {/* Customer details */}
        <CustomerForm
          customer={customer}
          onChange={(key, val) => setCustomer({ [key]: val })}
          errors={errors}
        />

        <div className="bk-cust__grid" style={{ marginTop: 8 }}>
          <div className="bk-field">
            <label className="bk-field__label">Visit Date</label>
            <input className="bk-field__input" readOnly value={visitDate || ""} />
          </div>
        </div>

        <hr className="bk-divider" />

        {/* Summary */}
        <BookingSummary
          ticketQty={ticketQty}
          mealQty={mealQty}
          offer={selectedOffer}
          couponCode={couponCode}
          visitDate={visitDate}
        />

        {/* T&C */}
        <div className="bk-terms">
          <p className="bk-terms__note">
            T&amp;C: No cancellation/postponement after booking · Entry free for children below 90 cm ·
            Senior citizens 60+ and students must carry valid ID.
          </p>
          <label className="bk-terms__label">
            <input
              type="checkbox"
              className="bk-terms__chk"
              checked={agreedToTerms}
              onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: undefined })); }}
              id="terms-chk"
            />
            <span>
              I have read and agree to the VGP Universal Kingdom{" "}
              <a href="/terms" className="bk-terms__link">Terms &amp; Conditions</a>,
              Privacy Policy, and cancellation &amp; refund policy.
              I understand that approved refunds may take 15 to 30 days to reflect in the
              original payment method.
            </span>
          </label>
          {errors.terms && <p className="bk-err" role="alert">{errors.terms}</p>}
        </div>
{apiError && (
  <p className="bk-err" role="alert">
    {apiError}
  </p>
)}
        <div className="bk-nav-btns">
          <button className="bk-btn-back" onClick={onBack} id="step4-back-btn">← Back</button>
          <button
            className="cta-big cta-red"
            onClick={handlePay}
            disabled={submitting}
            id="step4-pay-btn"
          >
            {submitting ? "Processing…" : "Pay & Get Tickets 🎟"}
          </button>
        </div>
      </div>
    </div>
  );
}
