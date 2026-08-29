"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import BookingSummary from "@/components/booking/BookingSummary";
import { updateCustomerInfo, generateBookingQuote } from "@/services/bookingApi";

export default function StepTraveller({ onNext, onBack }) {
  const { customer, setCustomer, setFinalReviewData } = useBooking();
  const { user } = useAuth();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const isNameEmpty = !customer?.name || customer.name.trim() === "";
      const isEmailEmpty = !customer?.email || customer.email.trim() === "";
      const isMobileEmpty = !customer?.mobile || customer.mobile.trim() === "";

      if (isNameEmpty && isEmailEmpty && isMobileEmpty) {
        setCustomer({
          ...customer,
          name: user.fullName || "",
          email: user.email || "",
          mobile: user.phone || ""
        });
      }
    }
  }, [user, customer?.name, customer?.email, customer?.mobile, setCustomer]);

  const handleChange = (field, value) => {
    setCustomer({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNext = async () => {
    const errs = {};
    if (!customer?.name?.trim() || customer.name.trim().length < 2 || customer.name.trim().length > 150) {
      errs.name = "Lead traveller name must be between 2 and 150 characters.";
    }
    if (!customer?.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) || customer.email.length > 150) {
      errs.email = "Valid email under 150 characters is required.";
    }
    if (!customer?.mobile?.trim() || !/^[6-9]\d{9}$/.test(customer.mobile.replace(/\D/g, "").slice(-10))) {
      errs.mobile = "Valid 10-digit Indian mobile number is required.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const payload = {
        leadTravellerName: customer.name.trim(),
        email: customer.email.trim(),
        mobile: customer.mobile.replace(/\D/g, "").slice(-10),
        whatsappDelivery: customer.sendTicketByWhatsapp === true,
      };

      await updateCustomerInfo(payload);
      
      const quoteResult = await generateBookingQuote();
      if (quoteResult && quoteResult.data) {
        setFinalReviewData(quoteResult.data);
      }

      onNext();
    } catch (error) {
      setErrors({ submit: error.message || "Failed to generate quote. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-layout">
        
        {/* MAIN CONTENT — 70% */}
        <div className="booking-main">
          
          <div className="booking-step-header-container">
            <div className="booking-step-heading">
              <span className="booking-step-heading__number">04</span>
              <div className="booking-step-heading__content">
                <h2 className="booking-step-heading__title">TRAVELLER DETAILS</h2>
                <p className="booking-step-heading__subtitle">
                  Ticket-access links, invoice and itinerary are delivered to these details.
                </p>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2">
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="booking-traveller-panel">
            <div className="booking-traveller-form">
              
              {/* Name Field */}
              <div className="booking-field">
                <label className="booking-field__label" htmlFor="traveller-name">
                  Lead traveller name
                </label>
                <input
                  id="traveller-name"
                  type="text"
                  className={`booking-field__input ${errors.name ? 'booking-field__input--error' : ''}`}
                  placeholder="Arun Kumar"
                  value={customer?.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  minLength={2}
                  maxLength={150}
                />
                {errors.name && <span className="booking-field__error">{errors.name}</span>}
              </div>

              {/* Email and Mobile */}
              <div className="booking-traveller-fields">
                <div className="booking-field">
                  <label className="booking-field__label" htmlFor="traveller-email">
                    Email address
                  </label>
                  <input
                    id="traveller-email"
                    type="email"
                    className={`booking-field__input ${errors.email ? 'booking-field__input--error' : ''}`}
                    placeholder="arun@example.com"
                    value={customer?.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    maxLength={150}
                  />
                  {errors.email && <span className="booking-field__error">{errors.email}</span>}
                </div>

                <div className="booking-field">
                  <label className="booking-field__label" htmlFor="traveller-mobile">
                    Mobile / WhatsApp
                  </label>
                  <input
                    id="traveller-mobile"
                    type="tel"
                    className={`booking-field__input ${errors.mobile ? 'booking-field__input--error' : ''}`}
                    placeholder="+91 98765 43210"
                    value={customer?.mobile || ""}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    required
                  />
                  {errors.mobile && <span className="booking-field__error">{errors.mobile}</span>}
                </div>
              </div>

              {/* WhatsApp Checkbox */}
              <label className="booking-whatsapp-option">
                <input
                  type="checkbox"
                  className="booking-whatsapp-option__checkbox"
                  checked={customer?.sendTicketByWhatsapp || false}
                  onChange={(e) => handleChange("sendTicketByWhatsapp", e.target.checked)}
                />
                <span className="booking-whatsapp-option__label">
                  Send the Royal Scroll ticket PDF and invoice PDF by WhatsApp.
                </span>
              </label>

            </div>
            
            <div className="booking-traveller-navigation">
              <button className="booking-traveller-navigation__back" onClick={onBack} disabled={submitting}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button className="booking-traveller-navigation__next" onClick={handleNext} disabled={submitting}>
                {submitting ? "Saving..." : "Review & Pay"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* SUMMARY — 30% */}
        <div className="booking-summary-column">
          <BookingSummary
            onNext={handleNext}
            canProceed={!submitting}
          />
        </div>
      </div>
    </div>
  );
}
