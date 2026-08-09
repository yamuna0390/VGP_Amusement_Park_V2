"use client";

import { useState } from "react";

import { useBooking } from "@/context/BookingContext";
import { fmt } from "@/utils/bookingCalc";
import {
  getTicketTotal,
  getFoodTotal,
  getGrandTotal,
  calculateTemporaryCouponUiDiscount,
} from "@/utils/bookingSummary";
import {
  CalendarDays,
  Tag,
  Ticket,
  Gift,
  Lock,
  ShieldCheck,
  QrCode,
  Mail,
  MessageSquare,
  Headphones,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function BookingSummary({
  ticketQty: propTicketQty,
  foodQty: propFoodQty,
  offerQty: propOfferQty,
  couponCode: propCouponCode,
  visitDate: propVisitDate,
  compact = false,
  onNext,
  canProceed = true,
}) {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  let booking = {};
  try {
    booking = useBooking() || {};
  } catch (e) {}

  const ticketQty = propTicketQty || booking.ticketQty || {};
  const foodQty = propFoodQty || booking.foodQty || {};
  const offerQty = propOfferQty || booking.offerQty || {};
  const masterData = booking.masterData || { regularTickets: [], offerTickets: [], foods: [], parkSettings: {} };
  const visitDate = propVisitDate !== undefined ? propVisitDate : booking.visitDate;
  const bookingType = booking.bookingType || "regular";

  const regularTickets = masterData.regularTickets || [];
  const offerTickets = masterData.offerTickets || [];
  const foods = masterData.foods || [];

  const ticketTotal = booking.ticketTotal !== undefined ? booking.ticketTotal : getTicketTotal(ticketQty, regularTickets, offerQty, offerTickets);
  const foodTotal = booking.foodTotal !== undefined ? booking.foodTotal : getFoodTotal(foodQty, foods);
  const unadjustedGrandTotal = getGrandTotal(ticketQty, regularTickets, offerQty, offerTickets, foodQty, foods);
  const calculatedCouponDiscount = booking.couponDiscount !== undefined
    ? booking.couponDiscount
    : calculateTemporaryCouponUiDiscount(ticketTotal, foodTotal, booking.appliedCoupon).discountAmount;

  const grandTotal = booking.grandTotal !== undefined
    ? booking.grandTotal
    : (booking.couponApplied ? parseFloat((unadjustedGrandTotal - calculatedCouponDiscount).toFixed(2)) : unadjustedGrandTotal);

  const selectedRegularTickets = regularTickets.filter(
    (tk) => Number(ticketQty[tk.id] || ticketQty[tk.code] || 0) > 0
  );

  const selectedOfferTickets = offerTickets.filter(
    (of) => Number(offerQty[of.offerTicketId] || of.id || 0) > 0
  );

  const selectedFoods = foods.filter(
    (f) => Number(foodQty[f.id] || foodQty[f.foodId] || foodQty[f.code] || 0) > 0
  );

  const ticketGstPct = Number(masterData.parkSettings?.ticketGstPercentage ?? 18);
  const foodGstPct = Number(masterData.parkSettings?.foodGstPercentage ?? 5);
  const convenienceFee = booking.finalReviewData?.convenienceFee !== undefined ? Number(booking.finalReviewData.convenienceFee) : ((ticketTotal > 0 || foodTotal > 0) ? Number(masterData.parkSettings?.convenienceFee ?? 40) : 0);

  const ticketGST = booking.finalReviewData?.ticketGST !== undefined ? Number(booking.finalReviewData.ticketGST) : parseFloat((ticketTotal * (ticketGstPct / 100)).toFixed(2));
  const foodGST = booking.finalReviewData?.foodGST !== undefined ? Number(booking.finalReviewData.foodGST) : parseFloat((foodTotal * (foodGstPct / 100)).toFixed(2));
  const totalPayable = booking.finalReviewData?.finalPayableAmount !== undefined ? Number(booking.finalReviewData.finalPayableAmount) : (booking.finalReviewData?.payableAmount !== undefined ? Number(booking.finalReviewData.payableAmount) : parseFloat((grandTotal + ticketGST + foodGST + convenienceFee).toFixed(2)));

  const totalTicketsCount = Object.values(ticketQty).reduce((a, b) => a + Number(b), 0) + Object.values(offerQty).reduce((a, b) => a + Number(b), 0);
  const totalFoodCount = Object.values(foodQty).reduce((a, b) => a + Number(b), 0);

  const summaryContent = (
    <>
    <div className="booking-summary-content">
      {/* Visit Date */}
      <div className="booking-summary-row">
        <div className="booking-summary-row__left">
          <CalendarDays className="booking-summary-row__icon booking-summary-row__icon--purple" />
          <div className="booking-summary-row__label-group">
            <span className="booking-summary-row__label">Visit Date</span>
            {!visitDate && <span className="booking-summary-row__subtext">Not Selected</span>}
          </div>
        </div>
        <div className="booking-summary-row__value">
          {visitDate ? visitDate : ""}
        </div>
      </div>
      
      <div className="booking-summary-row-separator" />

      {/* Booking Type */}
      <div className="booking-summary-row">
        <div className="booking-summary-row__left">
          <Tag className="booking-summary-row__icon booking-summary-row__icon--yellow" />
          <div className="booking-summary-row__label-group">
            <span className="booking-summary-row__label">Booking Type</span>
          </div>
        </div>
        <div className="booking-summary-row__value">
          {bookingType === "regular" ? "Regular Booking" : "Offer Booking"}
        </div>
      </div>

      <div className="booking-summary-row-separator" />

      {/* Tickets */}
      <div className="booking-summary-row">
        <div className="booking-summary-row__left">
          <Ticket className="booking-summary-row__icon booking-summary-row__icon--purple" />
          <div className="booking-summary-row__label-group">
            <span className="booking-summary-row__label">Tickets</span>
            <span className="booking-summary-row__subtext">
              {totalTicketsCount > 0 ? `${totalTicketsCount} Ticket${totalTicketsCount > 1 ? "s" : ""}` : "No tickets selected"}
            </span>
          </div>
        </div>
        <div className="booking-summary-row__value">
          {ticketTotal > 0 && fmt(ticketTotal)}
        </div>
      </div>

      {/* Item Breakdown */}
      {selectedRegularTickets.map((tk) => {
        const id = tk.id || tk.code;
        const qty = Number(ticketQty[id] || ticketQty[tk.code] || 0);
        const price = Number(tk.price !== undefined ? tk.price : (tk.discountPrice !== null ? tk.discountPrice : tk.originalPrice) || 0);
        return (
          <div key={id} className="booking-summary-breakdown-row">
            <span>{tk.name} × {qty}</span>
            <span>{fmt(price * qty)}</span>
          </div>
        );
      })}

      {selectedOfferTickets.map((of) => {
        const id = of.offerTicketId || of.id;
        const qty = Number(offerQty[id] || 0);
        const price = Number(of.unitPrice !== undefined ? of.unitPrice : (of.price || of.originalPrice || 0));
        return (
          <div key={id} className="booking-summary-breakdown-row">
            <span>{of.title || of.displayName || of.name || "Offer"} × {qty}</span>
            <span>{fmt(price * qty)}</span>
          </div>
        );
      })}

      <div className="booking-summary-row-separator" />

      {/* Add-ons */}
      <div className="booking-summary-row">
        <div className="booking-summary-row__left">
          <Gift className="booking-summary-row__icon booking-summary-row__icon--purple" />
          <div className="booking-summary-row__label-group">
            <span className="booking-summary-row__label">Add-ons</span>
            <span className="booking-summary-row__subtext">
              {totalFoodCount > 0 ? `${totalFoodCount} Item${totalFoodCount > 1 ? "s" : ""}` : "None"}
            </span>
          </div>
        </div>
      </div>

      {selectedFoods.map((addon) => {
        const id = addon.id || addon.foodId || addon.code;
        const qty = Number(foodQty[id] || 0);
        const price = Number(addon.price || addon.unitPrice || 0);
        return (
          <div key={id} className="booking-summary-breakdown-row">
            <span>{addon.name || addon.title} × {qty}</span>
            <span>{fmt(price * qty)}</span>
          </div>
        );
      })}

      {/* Coupon Discount */}
      {booking.couponApplied && (booking.appliedCoupon || booking.finalReviewData) && (
        <div className="booking-summary-coupon">
          <span>🎟 Coupon ({booking.appliedCoupon?.couponCode || booking.finalReviewData?.couponCode || booking.couponCode})</span>
          <span>-{fmt(booking.finalReviewData?.discountAmount !== undefined ? booking.finalReviewData.discountAmount : calculatedCouponDiscount)}</span>
        </div>
      )}

      {/* Taxes & Fees */}
      {(ticketGST > 0 || foodGST > 0 || convenienceFee > 0) && (
        <div className="booking-summary-taxes">
          {ticketGST > 0 && (
            <div className="booking-summary-taxes__row">
              <span>GST on tickets ({ticketGstPct}%)</span>
              <span>+{fmt(ticketGST)}</span>
            </div>
          )}
          {foodGST > 0 && (
            <div className="booking-summary-taxes__row">
              <span>GST on food ({foodGstPct}%)</span>
              <span>+{fmt(foodGST)}</span>
            </div>
          )}
          {convenienceFee > 0 && (
            <div className="booking-summary-taxes__row">
              <span>Convenience Fee</span>
              <span>+{fmt(convenienceFee)}</span>
            </div>
          )}
        </div>
      )}

      {/* Grand Total Box */}
      <div className="booking-summary-total">
        <span className="booking-summary-total__label">GRAND TOTAL</span>
        <span className="booking-summary-total__amount">{fmt(totalPayable)}</span>
      </div>
    </div>

    {/* Trust Badges */}
    <div className="bg-purple-50/50 p-3.5 border-t border-purple-100 mt-auto">
      <div className="grid grid-cols-6 gap-1 text-center">
        <TrustIcon Icon={Lock} label="Secure" color="text-amber-600" />
        <TrustIcon Icon={ShieldCheck} label="PCI DSS" color="text-blue-600" />
        <TrustIcon Icon={QrCode} label="QR Ticket" color="text-purple-600" />
        <TrustIcon Icon={Mail} label="Email" color="text-indigo-600" />
        <TrustIcon Icon={MessageSquare} label="WhatsApp" color="text-green-600" />
        <TrustIcon Icon={Headphones} label="24/7" color="text-[#681B81]" />
      </div>
    </div>
    </>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:flex flex-col bg-white border border-[rgba(109,40,217,0.14)] rounded-[20px] shadow-[0_5px_12px_rgba(45,20,70,0.05),0_15px_35px_rgba(45,20,70,0.10),0_30px_65px_rgba(45,20,70,0.08)] overflow-hidden sticky top-24">
        {/* Header */}
        <div className="booking-summary-hero">
          <div className="booking-summary-hero__inner">
            <div className="booking-summary-hero__eyebrow">YOUR ROYAL BOOKING</div>
            <div className="booking-summary-hero__title">LIVE SUMMARY</div>
          </div>
        </div>
        {summaryContent}
      </div>

      {/* Mobile Bottom Sheet Drawer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E6D7EA] rounded-t-[20px] shadow-[0_-8px_24px_rgba(75,15,97,0.15)] flex flex-col transition-transform duration-300 transform">
        
        {/* Expanded Content Area */}
        {isMobileExpanded && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="bg-gray-50 flex items-center justify-center py-2 cursor-pointer border-b border-gray-100" onClick={() => setIsMobileExpanded(false)}>
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="booking-summary-hero">
              <div className="booking-summary-hero__inner">
                <div className="booking-summary-hero__eyebrow">YOUR ROYAL BOOKING</div>
                <div className="booking-summary-hero__title">LIVE SUMMARY</div>
              </div>
            </div>
            {summaryContent}
          </div>
        )}

        {/* Collapsed Bar / Action Area */}
        {!isMobileExpanded && (
          <div 
            className="pt-2 pb-4 px-4 bg-white rounded-t-[20px] cursor-pointer flex flex-col items-center justify-center"
            onClick={() => setIsMobileExpanded(true)}
          >
            <div className="booking-mobile-summary__handle" />
            <div className="font-extrabold text-[#681B81] text-[11px] sm:text-xs tracking-wider uppercase mt-3 mb-0.5">
              View Booking Summary
            </div>
            <div className="text-gray-900 font-black text-lg sm:text-xl">
              {fmt(totalPayable)}
            </div>
          </div>
        )}
      </div>

      {/* Spacer to prevent content from hiding behind the mobile bottom bar */}
      <div className="md:hidden h-24 w-full"></div>
    </>
  );
}

function TrustIcon({ Icon, label, color }) {
  return (
    <div className="flex flex-col items-center">
      <Icon className={`w-4 h-4 mb-0.5 ${color}`} />
      <span className="text-[9px] font-bold text-gray-500 leading-tight">
        {label}
      </span>
    </div>
  );
}
