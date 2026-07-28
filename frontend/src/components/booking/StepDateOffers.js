"use client";
import { useState } from "react";
import { Clock, Calendar, ChevronLeft, MapPin } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import BookingCalendar from "@/components/booking/BookingCalendar";
import OfferCard from "@/components/booking/OfferCard";
import { BOOKING_OFFERS } from "@/data/bookingOffers";

export default function StepDateOffers({ onNext }) {
  const { 
    visitDate, 
    setDate, 
    selectedOffer, 
    setOffer, 
    couponCode 
  } = useBooking();
  
  const [err, setErr] = useState("");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showOfferConfirm, setShowOfferConfirm] = useState(false);
  const [pendingOffer, setPendingOffer] = useState(null);

  const handleOfferSelectAttempt = (offer) => {
    if (offer && couponCode) {
      setPendingOffer(offer);
      setShowOfferConfirm(true);
    } else {
      setOffer(offer);
      setShowCalendarModal(true);
    }
  };

  const confirmApplyOffer = () => {
    if (pendingOffer) {
      setOffer(pendingOffer);
    }
    setPendingOffer(null);
    setShowOfferConfirm(false);
    setShowCalendarModal(true);
  };

  const handleConfirmDateAndProceed = () => {
    if (!visitDate) { 
      setErr("Please select a visit date to continue."); 
      return; 
    }
    setErr("");
    setShowCalendarModal(false);
    onNext();
  };

  return (
    <div className="bk-step-content">
      <div className="bk-step1-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* ── Left Card Panel: Plan Your Adventure & Timings (Screenshot 1 Match) ── */}
        <div className="bk-panel" style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "28px 26px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0"
        }}>
          {/* Header row with back icon + Title & Chennai pill badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#FDDB00",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1E293B",
                fontWeight: "900"
              }}>
                <ChevronLeft size={22} />
              </div>
              <h2 style={{
                fontSize: "1.45rem",
                fontWeight: "900",
                color: "#1E293B",
                fontFamily: "var(--font-roboto-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: 0
              }}>
                PLAN YOUR ADVENTURE
              </h2>
            </div>

            <span style={{
              background: "#FDDB00",
              color: "#1E293B",
              fontWeight: "800",
              fontSize: "0.82rem",
              padding: "5px 18px",
              borderRadius: "20px",
              letterSpacing: "0.5px"
            }}>
              Chennai
            </span>
          </div>

          <p style={{ fontSize: "0.92rem", color: "#64748B", fontWeight: "600", marginBottom: "24px" }}>
            7 hours of non-stop thrills, twists, and unforgettable excitement!
          </p>

          {/* Timings Section */}
          <div style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "20px 22px",
            marginBottom: "20px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#1E293B",
              fontWeight: "800",
              fontSize: "0.92rem",
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              <Clock size={18} color="#3B82F6" />
              <span>PARK TIMINGS / WATER TIMINGS</span>
            </div>

            <table style={{ width: "100%", fontSize: "0.88rem", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E2E8F0", textAlign: "left", color: "#64748B" }}>
                  <th style={{ paddingBottom: "10px", fontWeight: "700", width: "35%" }}></th>
                  <th style={{ paddingBottom: "10px", fontWeight: "700" }}>Park Timings</th>
                  <th style={{ paddingBottom: "10px", fontWeight: "700" }}>Water Timings</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "12px 0", fontWeight: "800", color: "#1E293B" }}>Weekdays</td>
                  <td style={{ padding: "12px 0", fontWeight: "600", color: "#475569" }}>11:00 AM to 6:00 PM</td>
                  <td style={{ padding: "12px 0", fontWeight: "600", color: "#475569" }}>12:00 PM to 6:00 PM</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px 0 0", fontWeight: "800", color: "#1E293B" }}>Weekends</td>
                  <td style={{ padding: "12px 0 0", fontWeight: "600", color: "#475569" }}>11:00 AM to 7:00 PM</td>
                  <td style={{ padding: "12px 0 0", fontWeight: "600", color: "#475569" }}>12:00 PM to 6:00 PM</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 365 Days Holiday Notice Box */}
          <div style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "18px 20px"
          }}>
            <h4 style={{ fontSize: "0.95rem", color: "#1E293B", fontWeight: "800", margin: "0 0 4px 0" }}>
              Upcoming Holidays Perfect For A VGP Trip
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#475569", fontWeight: "700", margin: "0 0 14px 0" }}>
              We Are Open All 365 Days!
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700", display: "block" }}>Aug 14</span>
                <span style={{ fontSize: "0.85rem", color: "#1E293B", fontWeight: "800" }}>Take Leave</span>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700", display: "block" }}>Aug 15</span>
                <span style={{ fontSize: "0.85rem", color: "#1E293B", fontWeight: "800" }}>Independence Day</span>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700", display: "block" }}>Aug 16</span>
                <span style={{ fontSize: "0.85rem", color: "#1E293B", fontWeight: "800" }}>Week Off</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Card Panel: Offers List (Screenshot 1 Match) ── */}
        <div className="bk-panel" style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "28px 26px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#1E293B", margin: 0 }}>
              Exclusive Passes &amp; Offers
            </h3>
            {visitDate && (
              <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#2563EB", background: "#EFF6FF", padding: "4px 12px", borderRadius: "12px" }}>
                Date: {visitDate}
              </span>
            )}
          </div>

          <div className="bk-offers-list bk-offers-scroll" style={{ maxHeight: "500px", overflowY: "auto", paddingRight: "6px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {BOOKING_OFFERS.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isSelected={selectedOffer?.id === offer.id}
                onSelect={handleOfferSelectAttempt}
              />
            ))}
          </div>

          <button
            className="cta-big cta-red"
            onClick={() => setShowCalendarModal(true)}
            style={{ width: "100%", marginTop: "18px" }}
          >
            📅 {visitDate ? `Change Visit Date (${visitDate})` : "Select Date & Book Now →"}
          </button>
        </div>
      </div>

      {/* ── Date Selection Calendar Popup Modal ── */}
      {showCalendarModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="bk-panel" style={{
            maxWidth: "500px",
            width: "100%",
            padding: "28px 24px",
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            position: "relative"
          }}>
            <button
              onClick={() => setShowCalendarModal(false)}
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                background: "#F1F5F9",
                border: "none",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                fontSize: "1.1rem",
                fontWeight: "800",
                color: "#64748B",
                cursor: "pointer"
              }}
            >
              ✕
            </button>

            <h3 style={{ color: "#1E293B", fontSize: "1.35rem", marginBottom: "4px", fontWeight: "900", textAlign: "center" }}>
              📅 Select Your Visit Date
            </h3>

            {selectedOffer ? (
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <span className="bk-offer__badge" style={{ background: selectedOffer.badgeColor || "#2563EB", padding: "4px 12px", borderRadius: "14px" }}>
                  {selectedOffer.badge}
                </span>
                <p style={{ fontSize: "0.9rem", color: "#1E293B", fontWeight: "800", marginTop: "6px" }}>
                  Selected: {selectedOffer.title}
                </p>
              </div>
            ) : (
              <p style={{ fontSize: "0.88rem", color: "#64748B", textAlign: "center", marginBottom: "16px", fontWeight: "600" }}>
                Select a visit date to confirm ticket availability.
              </p>
            )}

            <BookingCalendar
              selectedDate={visitDate}
              onSelectDate={(d) => { setDate(d); setErr(""); }}
            />

            {err && <p className="bk-err" role="alert" style={{ textAlign: "center", marginTop: "10px", color: "#DC2626", fontWeight: "700" }}>{err}</p>}

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button
                className="bk-btn-back"
                onClick={() => setShowCalendarModal(false)}
                style={{ flex: 1, margin: 0 }}
              >
                Cancel
              </button>
              <button
                className="cta-big cta-red"
                onClick={handleConfirmDateAndProceed}
                style={{ flex: 2, padding: "10px 16px", fontSize: "0.95rem" }}
              >
                Confirm Date &amp; Proceed →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reverse Rule Modal ── */}
      {showOfferConfirm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="bk-panel" style={{
            maxWidth: "460px",
            padding: "30px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#1E293B", fontSize: "1.35rem", marginBottom: "12px", fontWeight: "900" }}>
              Coupon Already Applied
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#475569", marginBottom: "24px", lineHeight: "1.5", fontWeight: "600" }}>
              Coupon <strong>{couponCode}</strong> is currently applied. <br />
              Applying this Offer will remove the coupon. <br /><br />
              Continue?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                className="bk-btn-back"
                onClick={() => {
                  setPendingOffer(null);
                  setShowOfferConfirm(false);
                }}
                style={{ margin: 0, padding: "8px 24px", height: "45px" }}
              >
                Cancel
              </button>
              <button
                className="cta-big cta-red"
                onClick={confirmApplyOffer}
                style={{ padding: "8px 24px", fontSize: "0.9rem", height: "45px" }}
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
