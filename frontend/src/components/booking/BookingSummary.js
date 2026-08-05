"use client";
import { useBooking } from "@/context/BookingContext";
import { fmt } from "@/utils/bookingCalc";
import {
  getTicketTotal,
  getFoodTotal,
  getGrandTotal,
  calculateTemporaryCouponUiDiscount,
} from "@/utils/bookingSummary";

export default function BookingSummary({
  ticketQty: propTicketQty,
  foodQty: propFoodQty,
  offerQty: propOfferQty,
  couponCode: propCouponCode,
  visitDate: propVisitDate,
  compact = false,
}) {
  let booking = {};
  try {
    booking = useBooking() || {};
  } catch (e) {}

  const ticketQty = propTicketQty || booking.ticketQty || {};
  const foodQty = propFoodQty || booking.foodQty || {};
  const offerQty = propOfferQty || booking.offerQty || {};
  const masterData = booking.masterData || { regularTickets: [], offerTickets: [], foods: [], parkSettings: {} };
  const visitDate = propVisitDate !== undefined ? propVisitDate : booking.visitDate;

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
    (of) => Number(offerQty[of.offerTicketId] || offerQty[of.id] || 0) > 0
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

  return (
    <div className={`bk-summary ${compact ? "bk-summary--compact" : ""}`}>
      {visitDate && (
        <div className="bk-summary__row bk-summary__date">
          <span>📅 Visit Date</span>
          <strong>{visitDate}</strong>
        </div>
      )}

      {selectedRegularTickets.map((tk) => {
        const id = tk.id || tk.code;
        const qty = Number(ticketQty[id] || ticketQty[tk.code] || 0);
        const price = Number(tk.price !== undefined ? tk.price : (tk.discountPrice !== null ? tk.discountPrice : tk.originalPrice) || 0);
        return (
          <div key={id} className="bk-summary__row">
            <span>
              {tk.name} × {qty}
            </span>
            <span>{fmt(price * qty)}</span>
          </div>
        );
      })}

      {selectedOfferTickets.map((of) => {
        const id = of.offerTicketId || of.id;
        const qty = Number(offerQty[id] || 0);
        const price = Number(of.unitPrice !== undefined ? of.unitPrice : (of.price || of.originalPrice || 0));
        return (
          <div key={id} className="bk-summary__row">
            <span>
              {of.title || of.displayName || of.name || "Offer"} × {qty}
            </span>
            <span>{fmt(price * qty)}</span>
          </div>
        );
      })}

      {selectedFoods.map((m) => {
        const id = m.id || m.foodId || m.code;
        const qty = Number(foodQty[id] || 0);
        const price = Number(m.price || m.unitPrice || 0);
        return (
          <div key={id} className="bk-summary__row">
            <span>
              {m.name} × {qty}
            </span>
            <span>{fmt(price * qty)}</span>
          </div>
        );
      })}

      {booking.couponApplied && (booking.appliedCoupon || booking.finalReviewData) && (
        <div className="bk-summary__row" style={{ color: "#2e7d32", fontWeight: "700" }}>
          <span>🎟 Coupon Discount ({booking.appliedCoupon?.couponCode || booking.finalReviewData?.couponCode || booking.couponCode})</span>
          <span>-{fmt(booking.finalReviewData?.discountAmount !== undefined ? booking.finalReviewData.discountAmount : calculatedCouponDiscount)}</span>
        </div>
      )}

      <div className="bk-summary__row">
        <span>GST on tickets ({ticketGstPct}%)</span>
        <span>+{fmt(ticketGST)}</span>
      </div>
      <div className="bk-summary__row">
        <span>GST on food ({foodGstPct}%)</span>
        <span>+{fmt(foodGST)}</span>
      </div>
      <div className="bk-summary__row">
        <span>Convenience fee (min ₹{convenienceFee})</span>
        <span>+{fmt(convenienceFee)}</span>
      </div>

      <div className="bk-summary__total">
        <span>Total Payable</span>
        <strong>{fmt(totalPayable)}</strong>
      </div>
    </div>
  );
}
