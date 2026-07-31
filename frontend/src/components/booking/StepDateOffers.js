"use client";
import { useState } from "react";
import { Clock, Calendar, ChevronLeft, MapPin, Users, BadgePercent, Info } from "lucide-react";
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
    couponCode,
    setBookingType
  } = useBooking();
  
  const [err, setErr] = useState("");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showOfferConfirm, setShowOfferConfirm] = useState(false);
  const [pendingOffer, setPendingOffer] = useState(null);
  
  // Track which flow the user selected (regular or offer)
  const [selectedFlow, setSelectedFlow] = useState(null);

  const handleCardClick = (flowType) => {
    setSelectedFlow(flowType);
    setShowCalendarModal(true);
  };

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
    
    if (selectedFlow === 'regular') {
      setOffer(null); // Clear any offer if they chose regular
    }
    
    if (selectedFlow) {
      setBookingType(selectedFlow);
    }
    
    onNext();
  };

  return (
    <div className="bk-step-content">
      <div className="bk-step1-grid">
        
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
                  <td style={{ padding: "12px 0", fontWeight: "600", color: "#475569" }}>10:00 AM to 6:00 PM</td>
                  <td style={{ padding: "12px 0", fontWeight: "600", color: "#475569" }}>12:00 PM to 6:00 PM</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px 0 0", fontWeight: "800", color: "#1E293B" }}>Weekends</td>
                  <td style={{ padding: "12px 0 0", fontWeight: "600", color: "#475569" }}>09:30 AM to 6:00 PM</td>
                  <td style={{ padding: "12px 0 0", fontWeight: "600", color: "#475569" }}>12:00 PM to 6:00 PM</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 365 Days Holiday Notice Box */}
          <div style={{
            background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
            border: "1px solid #FDE68A",
            borderRadius: "18px",
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 2px 10px rgba(245, 158, 11, 0.08)"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#FDDB00",
              color: "#1E293B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(253, 219, 0, 0.4)"
            }}>
              🎡
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                <h4 style={{ fontSize: "1.02rem", color: "#1E293B", fontWeight: "900", margin: 0 }}>
                  Upcoming Holidays Perfect For A VGP Trip
                </h4>
                <span style={{ background: "#B11E63", color: "#FFF", fontSize: "0.72rem", fontWeight: "800", padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase" }}>
                  Open Always
                </span>
              </div>
              <p style={{ fontSize: "0.88rem", color: "#92400E", fontWeight: "700", margin: 0, lineHeight: "1.4" }}>
                We Are Open All 365 Days of the Year! Plan your thrilling family adventure anytime.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right Card Panel: Ticket Selection Cards ── */}
        <div className="bk-panel" style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "100%",
          justifyContent: "center"
        }}>
          {/* Regular Tickets Card */}
          <div 
            onClick={() => handleCardClick('regular')}
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              border: "1px solid #E2E8F0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
            }}
          >
            <div style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "#EEF2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Users size={32} color="#1E293B" />
            </div>
            <div>
              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: "900",
                color: "#1E293B",
                fontFamily: "var(--font-roboto-condensed), sans-serif",
                margin: "0 0 4px 0",
                letterSpacing: "0.5px"
              }}>
                REGULAR TICKETS
              </h3>
              <p style={{
                fontSize: "0.95rem",
                color: "#475569",
                fontWeight: "600",
                margin: 0,
                lineHeight: "1.4"
              }}>
                Unlimited Access to Land Rides Till 10 PM <br/>
                <span style={{ color: "#64748B" }}>+ Water Rides Till 6 PM</span>
              </p>
            </div>
          </div>

          {/* Offer Tickets Card */}
          <div 
            onClick={() => handleCardClick('offer')}
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              border: "1px solid #E2E8F0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
            }}
          >
            <div style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: "#2563EB",
            }}>
              <BadgePercent size={36} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: "900",
                color: "#1E293B",
                fontFamily: "var(--font-roboto-condensed), sans-serif",
                margin: "0 0 4px 0",
                letterSpacing: "0.5px"
              }}>
                OFFER TICKETS
              </h3>
              <p style={{
                fontSize: "0.95rem",
                color: "#475569",
                fontWeight: "600",
                margin: 0,
                lineHeight: "1.4"
              }}>
                Limited-Time Deals. Book Before They're Gone
              </p>
            </div>
          </div>

          {/* Info Text Banner */}
          <div style={{
            background: "#F5F3FF",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "8px"
          }}>
            <Info size={18} color="#7C3AED" />
            <p style={{
              fontSize: "0.9rem",
              color: "#5B21B6",
              fontWeight: "600",
              margin: 0
            }}>
              Select a ticket type above to choose your visit date.
            </p>
          </div>
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
