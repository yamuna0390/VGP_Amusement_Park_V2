"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Lock, Tag, AlertCircle, Calendar as CalendarIcon, X, ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingSummary from "@/components/booking/BookingSummary";
import { updateBookingSession } from "@/services/bookingApi";

function getDaysArray(startDateIso, daysCount) {
  const arr = [];
  const start = new Date(startDateIso);
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    arr.push({
      iso: d.toISOString().split("T")[0],
      dayName: d.toLocaleString("en-US", { weekday: "short" }),
      dayNumber: d.getDate(),
      isPast: d.toISOString().split("T")[0] < new Date().toISOString().split("T")[0],
    });
  }
  return arr;
}

export default function StepDateOffers({ onNext }) {
  const {
    visitDate,
    setDate,
    selectedOffer,
    setOffer,
    couponCode,
    bookingType,
    setBookingType,
    masterData,
    setMasterData,
  } = useBooking();

  const [err, setErr] = useState("");
  const [showOfferConfirm, setShowOfferConfirm] = useState(false);
  const [pendingOffer, setPendingOffer] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Available offers mock list or from masterData
  const availableOffers = masterData?.offerTickets?.length > 0
    ? masterData.offerTickets
    : [
        {
          id: "early_bird",
          offerTicketId: "early_bird",
          title: "Early Bird Offer",
          badge: "15% OFF",
          badgeColor: "booking-offer-badge--promo",
          desc: "Book at least 1 day in advance and save 15% on eligible tickets.",
          validity: "Valid through Aug 2026",
          advanceRequired: true,
        },
        {
          id: "birthday",
          offerTicketId: "birthday",
          title: "Birthday Offer",
          badge: "BOGO",
          badgeColor: "booking-offer-badge--promo",
          desc: "Celebrate your birthday month! Buy 1 ticket and get 1 free.",
          validity: "Valid during birth month with DOB ID",
          advanceRequired: false,
        },
        {
          id: "aadi",
          offerTicketId: "aadi",
          title: "Aadi Offer",
          badge: "B2G1",
          badgeColor: "booking-offer-badge--promo",
          desc: "Buy 2 tickets and get 1 ticket absolutely FREE during Aadi.",
          validity: "Valid for group bookings of 3+",
          advanceRequired: true,
        },
        {
          id: "friendship",
          offerTicketId: "friendship",
          title: "Friendship Day Offer",
          badge: "B2G1",
          badgeColor: "booking-offer-badge--promo",
          desc: "Two besties book, the third friend goes FREE! Plan now.",
          validity: "Special Friendship Day Offer",
          advanceRequired: false,
        },
      ];

  const todayIso = new Date().toISOString().split("T")[0];
  const isTodayDate = visitDate === todayIso;

  // Initialize rolling window start. If mounting with a future visitDate, use it if it's > 6 days away.
  const initialStripStart = useMemo(() => {
    if (visitDate && visitDate > todayIso) {
      const diffTime = Math.abs(new Date(visitDate) - new Date(todayIso));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 7) {
        return visitDate;
      }
    }
    return todayIso;
  }, [todayIso]); 
  // We specifically don't want this to re-evaluate on every visitDate change, 
  // we just need it for initial state. (Safe to ignore react-hooks/exhaustive-deps warning for this pattern, or just use useState initializer).

  const [stripStartIso, setStripStartIso] = useState(() => {
    let start = todayIso;
    if (visitDate && visitDate > todayIso) {
      const diffDays = Math.ceil(Math.abs(new Date(visitDate) - new Date(todayIso)) / (1000 * 60 * 60 * 24));
      if (diffDays >= 7) start = visitDate;
    }
    return start;
  });

  // Determine strip dates (Rolling 7-day window)
  const stripDays = useMemo(() => {
    return getDaysArray(stripStartIso, 7);
  }, [stripStartIso]);

  const handleDateSelect = async (d) => {
    setDate(d);
    setErr("");
    setShowCalendarModal(false);

    // Shift the rolling 7-day window if the selected date is outside the currently visible range
    const selectedDateObj = new Date(d);
    const stripStartObj = new Date(stripStartIso);
    const stripEndObj = new Date(stripStartIso);
    stripEndObj.setDate(stripStartObj.getDate() + 6);
    
    if (selectedDateObj < stripStartObj || selectedDateObj > stripEndObj) {
      setStripStartIso(d);
    }

    try {
      const result = await updateBookingSession({
        visitDate: d,
        bookingType: "REGULAR"
      });

      const updatedOffers = result.data?.offers || masterData.offerTickets || [];

      // Stale offer protection
      if (selectedOffer) {
        const newOfferStatus = updatedOffers.find(o => o.id === selectedOffer.id);
        if (!newOfferStatus || newOfferStatus.eligible === false) {
          setOffer(null);
          setBookingType("regular");
        }
      }

      setMasterData({
        allowOffers: result.data?.allowOffers ?? true,
        offerTickets: updatedOffers,
      });
    } catch (error) {
      console.error("Date validation error:", error);
      setErr(error.message || "Failed to update date");
    }
  };

  const handleSelectRegularBooking = () => {
    if (!visitDate) {
      setErr("Select a visit date");
      return;
    }
    setBookingType("regular");
    setOffer(null);
  };

  const handleSelectOffer = async (offer) => {
    if (!visitDate) {
      setErr("Select a visit date");
      return;
    }
    if (offer && couponCode) {
      setPendingOffer(offer);
      setShowOfferConfirm(true);
    } else {
      await applyOfferState(offer);
    }
  };

  const confirmApplyOffer = async () => {
    const offerToApply = pendingOffer;
    setPendingOffer(null);
    setShowOfferConfirm(false);
    
    if (offerToApply) {
      await applyOfferState(offerToApply);
    }
  };

  const applyOfferState = async (offer) => {
    try {
      const result = await updateBookingSession({
        visitDate,
        bookingType: "OFFER",
        offerId: offer.id
      });
      
      setBookingType("offer");
      
      const backendOffer = result.data?.offers?.find(o => o.id === offer.id) || offer;
      setOffer(backendOffer);
      setErr("");
    } catch (error) {
      console.error("Offer selection error:", error);
      setErr(error.message || "Failed to apply offer");
    }
  };

  const handleProceed = () => {
    if (!visitDate) {
      setErr("Please select a visit date to continue.");
      return;
    }
    setErr("");
    if (onNext) onNext();
  };

  return (
    <div className="booking-page">
      <div className="booking-layout">
        
        {/* MAIN CONTENT — 70% */}
        <div className="booking-main">
          
          {/* ROW 1: PAGE HEADING */}
          <div className="booking-page-heading">
            <h1 className="booking-page-heading__title">
              Choose Visit Date & <span className="booking-page-heading__accent">Royal Offer</span>
            </h1>
            <p className="booking-page-heading__subtitle">
              Select your visit date, then choose one applicable Royal Offer
              or continue with regular online tickets.
            </p>
          </div>

          {err && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{err}</span>
            </div>
          )}

          {/* ROW 2: DATE SELECTOR */}
          <div className="booking-date-selector">
            <div className="booking-date-selector__strip">
              {stripDays.map((day) => {
                const isSelected = visitDate === day.iso;
                const isToday = day.iso === todayIso;
                
                let dayClass = "booking-date-selector__day";
                if (isSelected) dayClass += " booking-date-selector__day--selected";
                if (isToday && !isSelected) dayClass += " booking-date-selector__day--today";
                if (day.isPast) dayClass += " booking-date-selector__day--disabled";

                return (
                  <div
                    key={day.iso}
                    onClick={() => !day.isPast && handleDateSelect(day.iso)}
                    className={dayClass}
                  >
                    <span className="booking-date-selector__day-name">{day.dayName}</span>
                    <span className="booking-date-selector__day-number">{day.dayNumber}</span>
                  </div>
                );
              })}
              
              <button 
                type="button" 
                className="booking-date-selector__calendar"
                onClick={() => setShowCalendarModal(true)}
                aria-label="Choose another date"
              >
                <CalendarIcon className="w-5 h-5 mb-1" />
                <span>More dates</span>
              </button>
            </div>
          </div>

          {/* ROW 3: BOOKING/OFFERS */}
          <div className="booking-offers-section">
            
            {/* Regular Booking */}
            <div 
              className={`booking-regular-card ${bookingType === "regular" && !selectedOffer ? "booking-regular-card--selected" : ""}`}
              onClick={handleSelectRegularBooking}
            >
              <div className={`booking-radio-indicator ${bookingType === "regular" && !selectedOffer ? "booking-radio-indicator--active" : ""}`}>
                <div className="booking-radio-indicator__dot" />
              </div>
              <div className="booking-regular-card__content">
                <div className="booking-regular-card__header">
                  <h3 className="booking-regular-card__title">Regular Booking</h3>
                  <span className="booking-offer-badge booking-offer-badge--green">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Available Every Day
                  </span>
                </div>
                <p className="booking-regular-card__desc">Standard online pricing. No promotional offer applied.</p>
              </div>
            </div>

            {/* Available Offers Grid */}
            <div className="booking-offers">
              <div className="booking-offers-header">
                <h2 className="booking-offers-header__title">
                  <Tag className="booking-offers-header__icon" />
                  Available Offers
                </h2>
                <p className="booking-offers-header__subtitle">Promotional offers available for your visit date.</p>
              </div>

              <div className="booking-offers-grid">
                {availableOffers.map((offer) => {
                  const isSelected = !!selectedOffer && (
                    selectedOffer.id === offer.id || 
                    (selectedOffer.offerTicketId && selectedOffer.offerTicketId === offer.offerTicketId)
                  );
                  const isAdvanceConstrained = isTodayDate && (offer.minAdvanceDays !== undefined ? offer.minAdvanceDays >= 1 : offer.advanceRequired);
                  const isDisabled = isAdvanceConstrained || offer.eligible === false;

                  let cardClass = "booking-offer-card";
                  if (isSelected) cardClass += " booking-offer-card--selected";
                  if (isDisabled) cardClass += " booking-offer-card--disabled";

                  return (
                    <div
                      key={offer.id || offer.offerTicketId}
                      onClick={() => !isDisabled && handleSelectOffer(offer)}
                      className={cardClass}
                    >
                      <div className="booking-offer-card__header">
                        <div className="booking-offer-card__title-group">
                          <div className={`booking-radio-indicator ${isSelected ? "booking-radio-indicator--active" : ""}`}>
                            <div className="booking-radio-indicator__dot" />
                          </div>
                          <h4 className="booking-offer-card__title"> {offer.offerName || offer.title || offer.displayName || offer.name}</h4>
                        </div>
                        {offer.badge && (
                          <span className={`booking-offer-badge ${offer.badgeColor || "booking-offer-badge--promo"}`}>
                            {offer.badge}
                          </span>
                        )}
                      </div>
                      
                      <p className="booking-offer-card__desc">
                        {offer.desc || offer.instruction || offer.shortDescription}
                      </p>

                      <div className="booking-offer-card__footer">
                        <span className="booking-offer-validity">
                          📅 {offer.validity || "Valid through Aug 2026"}
                        </span>
                        {isDisabled && (
                          <span className="booking-offer-notice">This offer is not available for selected date.</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="booking-offers-cta"
                onClick={handleProceed}
                disabled={!Boolean(visitDate)}
              >
                Choose Tickets
                <ArrowRight className="booking-offers-cta__icon" />
              </button>

              <div className="booking-promo-notice">
                <Lock className="w-4 h-4 text-[#681B81] inline-block mb-1 mr-2" />
                Promotional offers are available when you book at least 1 day before your visit. 
                <br />
                <strong>Regular Booking is available for today.</strong>
              </div>

            </div>
          </div>
        </div>

        {/* SUMMARY — 30% */}
        <div className="booking-summary-column">
          <BookingSummary
            onNext={handleProceed}
            canProceed={Boolean(visitDate)}
          />
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className="booking-calendar-modal-backdrop">
          <div className="booking-calendar-modal-content">
            <button 
              className="booking-calendar-modal-close"
              onClick={() => setShowCalendarModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <BookingCalendar
              selectedDate={visitDate}
              onSelectDate={handleDateSelect}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal when switching Offer over Coupon */}
      {showOfferConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-xl border border-purple-100">
            <h3 className="text-lg font-black text-gray-900 mb-2">
              Coupon Already Applied
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
              Coupon <strong>{couponCode}</strong> is currently applied. Applying this offer will remove the coupon.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  setPendingOffer(null);
                  setShowOfferConfirm(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs sm:text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmApplyOffer}
                className="px-5 py-2.5 rounded-xl bg-[#681B81] text-white font-bold text-xs sm:text-sm hover:bg-[#5A257F] shadow-sm"
              >
                Apply Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
