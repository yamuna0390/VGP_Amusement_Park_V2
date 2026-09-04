"use client";

import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { fmt } from "@/utils/bookingCalc";
import {
  CalendarDays,
  Ticket,
  Gift,
  Lock,
  ShieldCheck,
  QrCode,
  Mail,
  MessageSquare,
  Headphones,
  Tag,
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
  } catch (e) {
    booking = {};
  }

  const ticketQty = propTicketQty || booking.ticketQty || {};
  const foodQty = propFoodQty || booking.foodQty || {};
  const offerQty = propOfferQty || booking.offerQty || {};

  const masterData = booking.masterData || {
    regularTickets: [],
    offerTickets: [],
    foods: [],
    parkSettings: {},
  };

  const visitDate =
    propVisitDate !== undefined ? propVisitDate : booking.visitDate;

  const regularTickets = Array.isArray(masterData.regularTickets)
    ? masterData.regularTickets
    : [];

  const offerTickets = Array.isArray(masterData.offerTickets)
    ? masterData.offerTickets.flatMap((offer) => offer.offerTickets || offer.offer_tickets || [])
    : [];

  const foods = Array.isArray(masterData.foods)
    ? masterData.foods
    : [];

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Helpers
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function getRegularTicketId(ticket) {
    return ticket.id ?? ticket.ticketId ?? ticket.code;
  }

  function getOfferId(offer) {
    return offer.offerTicketId ?? offer.id ?? offer.code;
  }

  function getFoodId(food) {
    return food.foodId ?? food.id ?? food.code;
  }

  function getQuantity(quantityMap, id) {
    if (id === undefined || id === null) return 0;

    return Number(
      quantityMap[id] ??
      quantityMap[String(id)] ??
      0
    );
  }

  function getRegularPrice(ticket) {
    return Number(
      ticket.price ??
      ticket.onlinePrice ??
      ticket.originalFare ??
      0
    );
  }

  /*
   * New offer structure:
   *
   * {
   *   id,
   *   displayName,
   *   displaySubname,
   *   offerPrice,
   *   instruction
   * }
   *
   * Keep fallbacks for compatibility with existing backend data.
   */
  function getOfferPrice(offer) {
    return Number(
      offer.offerPrice ??
      offer.unitPrice ??
      offer.price ??
      0
    );
  }

  function getFoodPrice(food) {
    return Number(
      food.price ??
      food.unitPrice ??
      0
    );
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Selected items
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const isFinal = Boolean(booking?.finalReviewData?.purchaseSummary);
  const finalSummary = booking?.finalReviewData?.purchaseSummary;
  const finalQuote = booking?.finalReviewData?.quote;

  let selectedRegularTickets = [];
  let selectedOfferTickets = [];
  let selectedFoods = [];

  let regularTicketTotal = 0;
  let offerTicketTotal = 0;
  let regularTicketCount = 0;
  let offerTicketCount = 0;

  let foodTotal = 0;
  let totalFoodCount = 0;

  if (isFinal) {
    const finalTickets = finalSummary.tickets || [];
    selectedRegularTickets = finalTickets.filter((t) => t.pricingType !== "OFFER");
    selectedOfferTickets = finalTickets.filter((t) => t.pricingType === "OFFER");
    selectedFoods = finalSummary.addons || [];

    regularTicketTotal = selectedRegularTickets.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    regularTicketCount = selectedRegularTickets.reduce((sum, t) => sum + Number(t.quantity || 0), 0);

    offerTicketTotal = selectedOfferTickets.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    offerTicketCount = selectedOfferTickets.reduce((sum, t) => sum + Number(t.quantity || 0), 0);

    foodTotal = selectedFoods.reduce((sum, a) => sum + Number(a.amount || 0), 0);
    totalFoodCount = selectedFoods.reduce((sum, a) => sum + Number(a.quantity || 0), 0);
  } else {
    selectedRegularTickets = regularTickets.filter((ticket) => {
      const id = getRegularTicketId(ticket);
      return getQuantity(ticketQty, id) > 0;
    });

    selectedOfferTickets = offerTickets.filter((offer) => {
      const id = getOfferId(offer);
      return getQuantity(offerQty, id) > 0;
    });

    selectedFoods = foods.filter((food) => {
      const id = getFoodId(food);
      return getQuantity(foodQty, id) > 0;
    });

    regularTicketTotal = selectedRegularTickets.reduce((total, ticket) => {
      const id = getRegularTicketId(ticket);
      const qty = getQuantity(ticketQty, id);
      const price = getRegularPrice(ticket);
      return total + qty * price;
    }, 0);

    offerTicketTotal = selectedOfferTickets.reduce((total, offer) => {
      const id = getOfferId(offer);
      const qty = getQuantity(offerQty, id);
      const price = getOfferPrice(offer);
      return total + qty * price;
    }, 0);

    regularTicketCount = selectedRegularTickets.reduce((total, ticket) => {
      const id = getRegularTicketId(ticket);
      return total + getQuantity(ticketQty, id);
    }, 0);

    offerTicketCount = selectedOfferTickets.reduce((total, offer) => {
      const id = getOfferId(offer);
      return total + getQuantity(offerQty, id);
    }, 0);

    foodTotal = selectedFoods.reduce((total, food) => {
      const id = getFoodId(food);
      const qty = getQuantity(foodQty, id);
      const price = getFoodPrice(food);
      return total + qty * price;
    }, 0);

    totalFoodCount = selectedFoods.reduce((total, food) => {
      const id = getFoodId(food);
      return total + getQuantity(foodQty, id);
    }, 0);
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Subtotal
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const ticketTotal = regularTicketTotal + offerTicketTotal;
  const subtotal = isFinal ? Number(finalQuote?.subtotal || 0) : (ticketTotal + foodTotal);

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Coupon
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const couponDiscount = isFinal
    ? Number(finalQuote?.couponDiscount || 0)
    : Number(booking.couponDiscount || 0);

  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Taxes / fees
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const ticketGstPct = Number(masterData.parkSettings?.ticketGstPercentage ?? 18);
  const foodGstPct = Number(masterData.parkSettings?.foodGstPercentage ?? 5);

  let convenienceFee = 0;
  let ticketGST = 0;
  let foodGST = 0;
  let totalPayable = 0;

  if (isFinal) {
    convenienceFee = Number(finalQuote?.convenienceFee || 0);
    ticketGST = Number(finalQuote?.ticketTax || 0);
    foodGST = Number(finalQuote?.addonTax || 0);
    totalPayable = Number(finalQuote?.grandTotal || 0);
  } else {
    convenienceFee = subtotal > 0 ? Number(masterData.parkSettings?.convenienceFee ?? 40) : 0;
    ticketGST = Number((regularTicketTotal * (ticketGstPct / 100)).toFixed(2));
    foodGST = Number((foodTotal * (foodGstPct / 100)).toFixed(2));
    
    // Override if finalReviewData partials exist (legacy handling)
    if (booking.finalReviewData?.convenienceFee !== undefined) convenienceFee = Number(booking.finalReviewData.convenienceFee);
    if (booking.finalReviewData?.ticketGST !== undefined) ticketGST = Number(booking.finalReviewData.ticketGST);
    if (booking.finalReviewData?.foodGST !== undefined) foodGST = Number(booking.finalReviewData.foodGST);
    
    totalPayable = Number((discountedSubtotal + ticketGST + foodGST + convenienceFee).toFixed(2));
    if (booking.finalReviewData?.payableAmount !== undefined) totalPayable = Number(booking.finalReviewData.payableAmount);
    if (booking.finalReviewData?.finalPayableAmount !== undefined) totalPayable = Number(booking.finalReviewData.finalPayableAmount);
  }

  const totalTicketsCount = regularTicketCount + offerTicketCount;

  const fmtTotalPayable = (amount) =>
    `₹${Math.floor(Number(amount || 0)).toLocaleString("en-IN")}`;

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Summary Content
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const summaryContent = (
    <>
      <div className="booking-summary-content">

        {/* Visit Date */}
        <div className="booking-summary-row">
          <div className="booking-summary-row__left">
            <CalendarDays className="booking-summary-row__icon booking-summary-row__icon--purple" />

            <div className="booking-summary-row__label-group">
              <span className="booking-summary-row__label">
                Visit Date
              </span>

              {!visitDate && (
                <span className="booking-summary-row__subtext">
                  Not Selected
                </span>
              )}
            </div>
          </div>

          <div className="booking-summary-row__value">
            {visitDate || ""}
          </div>
        </div>

        <div className="booking-summary-row-separator" />

        {/* Regular Tickets */}
        <div className="booking-summary-row">
          <div className="booking-summary-row__left">
            <Ticket className="booking-summary-row__icon booking-summary-row__icon--purple" />

            <div className="booking-summary-row__label-group">
              <span className="booking-summary-row__label">
                Regular Tickets
              </span>

              <span className="booking-summary-row__subtext">
                {regularTicketCount > 0
                  ? `${regularTicketCount} Ticket${regularTicketCount > 1 ? "s" : ""}`
                  : "None selected"}
              </span>
            </div>
          </div>

          <div className="booking-summary-row__value">
            {regularTicketTotal > 0
              ? fmt(regularTicketTotal)
              : ""}
          </div>
        </div>

        {/* Regular Ticket Breakdown */}
        {selectedRegularTickets.map((ticket, idx) => {
          let id, qty, price, name, amount;
          if (isFinal) {
            id = ticket.ticketTypeId || idx;
            qty = ticket.quantity;
            price = ticket.unitPrice;
            name = ticket.name;
            amount = ticket.amount;
          } else {
            id = getRegularTicketId(ticket);
            qty = getQuantity(ticketQty, id);
            price = getRegularPrice(ticket);
            name = ticket.name || ticket.displayName || "Ticket";
            amount = price * qty;
          }

          return (
            <div
              key={`regular-${id}`}
              className="booking-summary-breakdown-row"
            >
              <span>
                {name} &times; {qty}
              </span>

              <span>
                {fmt(amount)}
              </span>
            </div>
          );
        })}

        {/* Offer Tickets */}
        {selectedOfferTickets.length > 0 && (
          <>
            <div className="booking-summary-row-separator" />

            <div className="booking-summary-row">
              <div className="booking-summary-row__left">
                <Tag className="booking-summary-row__icon booking-summary-row__icon--yellow" />

                <div className="booking-summary-row__label-group">
                  <span className="booking-summary-row__label">
                    Offer Tickets
                  </span>

                  <span className="booking-summary-row__subtext">
                    {offerTicketCount} Ticket
                    {offerTicketCount > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="booking-summary-row__value">
                {offerTicketTotal > 0
                  ? fmt(offerTicketTotal)
                  : ""}
              </div>
            </div>

            {/* Offer Breakdown */}
            {selectedOfferTickets.map((offer, idx) => {
              let id, qty, price, displayName, amount;
              let composition = null;

              if (isFinal) {
                id = offer.ticketTypeId || idx;
                qty = offer.quantity;
                price = offer.unitPrice;
                displayName = offer.name;
                amount = offer.amount;

                if (offer.components && offer.components.length > 0) {
                  composition = (
                    <div className="text-[11px] text-gray-500 font-medium mt-1 leading-tight">
                      {offer.components.map((comp, cIdx) => {
                        const compType = comp.componentType === 'BUY' ? 'BUY:' : 'FREE:';
                        return (
                          <div key={cIdx}>
                            {compType} {comp.name} &times;{comp.quantity}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              } else {
                id = getOfferId(offer);
                qty = getQuantity(offerQty, id);
                price = getOfferPrice(offer);
                displayName = offer.displayName || offer.title || offer.name || "Offer";
                amount = price * qty;

                if (offer.buyQuantity > 0 && offer.buyTicketId) {
                  const buyTicket = regularTickets.find((t) => t.id === offer.buyTicketId);
                  const buyName = buyTicket ? (buyTicket.name || "ticket").toLowerCase() : "ticket";
                  const totalBuyQty = offer.buyQuantity * qty;
                  
                  const freeTicket = offer.freeTicketId ? regularTickets.find((t) => t.id === offer.freeTicketId) : null;
                  const totalFreeQty = offer.freeQuantity ? (offer.freeQuantity * qty) : 0;
                  
                  if (totalFreeQty > 0 && freeTicket) {
                    const freeName = (freeTicket.name || "ticket").toLowerCase();
                    composition = (
                      <div className="text-[11px] text-gray-500 font-medium mt-1 leading-tight">
                        <div>{totalBuyQty} &times; {buyName}</div>
                        <div>{totalFreeQty} &times; {freeName}</div>
                      </div>
                    );
                  } else if (offer.buyQuantity > 1 || !offer.freeTicketId) {
                    composition = (
                      <div className="text-[11px] text-gray-500 font-medium mt-1 leading-tight">
                        <div>{totalBuyQty} &times; {buyName}</div>
                      </div>
                    );
                  }
                }
              }

              return (
                <div
                  key={`offer-${id}`}
                  className="booking-summary-breakdown-row-container"
                >
                  <div className="booking-summary-breakdown-row">
                    <span>
                      {displayName} &times; {qty}
                    </span>

                    <span>
                      {fmt(amount)}
                    </span>
                  </div>

                  {composition}
                </div>
              );
            })}
          </>
        )}

        {/* Add-ons */}
        <div className="booking-summary-row-separator" />

        <div className="booking-summary-row">
          <div className="booking-summary-row__left">
            <Gift className="booking-summary-row__icon booking-summary-row__icon--purple" />

            <div className="booking-summary-row__label-group">
              <span className="booking-summary-row__label">
                Add-ons
              </span>

              <span className="booking-summary-row__subtext">
                {totalFoodCount > 0
                  ? `${totalFoodCount} Item${totalFoodCount > 1 ? "s" : ""}`
                  : "None"}
              </span>
            </div>
          </div>

          <div className="booking-summary-row__value">
            {foodTotal > 0
              ? fmt(foodTotal)
              : ""}
          </div>
        </div>

        {/* Add-on Breakdown */}
        {selectedFoods.map((food, idx) => {
          let id, qty, price, name, amount;
          if (isFinal) {
            id = food.addonId || idx;
            qty = food.quantity;
            price = food.unitPrice;
            name = food.name;
            amount = food.amount;
          } else {
            id = getFoodId(food);
            qty = getQuantity(foodQty, id);
            price = getFoodPrice(food);
            name = food.name || food.title || "Add-on";
            amount = price * qty;
          }

          return (
            <div
              key={`food-${id}`}
              className="booking-summary-breakdown-row"
            >
              <span>
                {name} &times; {qty}
              </span>

              <span>
                {fmt(amount)}
              </span>
            </div>
          );
        })}

        {/* Coupon */}
        {booking.couponApplied && (
          <div className="booking-summary-coupon">
            <span>
              ðŸŽŸ Coupon (
              {booking.appliedCoupon?.couponCode ||
                booking.finalReviewData?.couponCode ||
                propCouponCode ||
                booking.couponCode}
              )
            </span>

            <span>
              -{fmt(couponDiscount)}
            </span>
          </div>
        )}

        {/* Subtotal */}
        {subtotal > 0 && (
          <div className="booking-summary-taxes">
            <div className="booking-summary-taxes__row">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="booking-summary-taxes__row">
                <span>Discount</span>
                <span>-{fmt(couponDiscount)}</span>
              </div>
            )}
          </div>
        )}

        {/* Taxes & Fees */}
        {(ticketGST > 0 ||
          foodGST > 0 ||
          convenienceFee > 0) && (
          <div className="booking-summary-taxes">

            {ticketGST > 0 && (
              <div className="booking-summary-taxes__row">
                <span>
                  GST on tickets ({ticketGstPct}%)
                </span>

                <span>
                  +{fmt(ticketGST)}
                </span>
              </div>
            )}

            {foodGST > 0 && (
              <div className="booking-summary-taxes__row">
                <span>
                  GST on add-ons ({foodGstPct}%)
                </span>

                <span>
                  +{fmt(foodGST)}
                </span>
              </div>
            )}

            {convenienceFee > 0 && (
              <div className="booking-summary-taxes__row">
                <span>
                  Convenience Fee
                </span>

                <span>
                  +{fmt(convenienceFee)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Grand Total */}
        <div className="booking-summary-total">
          <span className="booking-summary-total__label">
            GRAND TOTAL
          </span>

          <span className="booking-summary-total__amount">
            {fmtTotalPayable(totalPayable)}
          </span>
        </div>

      </div>

      {/* Trust Badges */}
      <div className="bg-purple-50/50 p-3.5 border-t border-purple-100 mt-auto">
        <div className="grid grid-cols-6 gap-1 text-center">

          <TrustIcon
            Icon={Lock}
            label="Secure"
            color="text-amber-600"
          />

          <TrustIcon
            Icon={ShieldCheck}
            label="PCI DSS"
            color="text-blue-600"
          />

          <TrustIcon
            Icon={QrCode}
            label="QR Ticket"
            color="text-purple-600"
          />

          <TrustIcon
            Icon={Mail}
            label="Email"
            color="text-indigo-600"
          />

          <TrustIcon
            Icon={MessageSquare}
            label="WhatsApp"
            color="text-green-600"
          />

          <TrustIcon
            Icon={Headphones}
            label="24/7"
            color="text-[#681B81]"
          />

        </div>
      </div>
    </>
  );

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Render
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden md:flex flex-col bg-white border border-[rgba(109,40,217,0.14)] rounded-[20px] shadow-[0_5px_12px_rgba(45,20,70,0.05),0_15px_35px_rgba(45,20,70,0.10),0_30px_65px_rgba(45,20,70,0.08)] overflow-hidden sticky top-24">

        <div className="booking-summary-hero">
          <div className="booking-summary-hero__inner">
            <div className="booking-summary-hero__eyebrow">
              YOUR ROYAL BOOKING
            </div>

            <div className="booking-summary-hero__title">
              LIVE SUMMARY
            </div>
          </div>
        </div>

        {summaryContent}
      </div>

      {/* Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E6D7EA] rounded-t-[20px] shadow-[0_-8px_24px_rgba(75,15,97,0.15)] flex flex-col">

        {isMobileExpanded && (
          <div className="flex-1 overflow-hidden flex flex-col">

            <div
              className="bg-gray-50 flex items-center justify-center py-2 cursor-pointer border-b border-gray-100"
              onClick={() => setIsMobileExpanded(false)}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            <div className="booking-summary-hero">
              <div className="booking-summary-hero__inner">
                <div className="booking-summary-hero__eyebrow">
                  YOUR ROYAL BOOKING
                </div>

                <div className="booking-summary-hero__title">
                  LIVE SUMMARY
                </div>
              </div>
            </div>

            {summaryContent}
          </div>
        )}

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
              {fmtTotalPayable(totalPayable)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom spacer */}
      <div className="md:hidden h-24 w-full" />
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

