"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Gift,
  Lock,
  Ticket as TicketIcon,
} from "lucide-react";

import { useBooking } from "@/context/BookingContext";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingSummary from "@/components/booking/BookingSummary";
import {
  updateBookingSession,
  updateBookingItems,
  generateBookingQuote,
  getMeals,
  getOffersByDate,
} from "@/services/bookingApi";
import { fetchNearestOfferDate } from "@/services/offerApi";
import { API_BASE_URL } from "@/constants/api";

function getDaysArray(startDateIso, daysCount) {
  const arr = [];
  const start = new Date(startDateIso);

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    arr.push({
      iso: d.toISOString().split("T")[0],
      dayName: d.toLocaleString("en-US", {
        weekday: "short",
      }),
      dayNumber: d.getDate(),
      isPast:
        d.toISOString().split("T")[0] <
        new Date().toISOString().split("T")[0],
    });
  }

  return arr;
}

function getTicketId(ticket) {
  return (
    ticket?.ticketId ??
    ticket?.id ??
    ticket?.dbId ??
    ticket?.ticketTypeId ??
    ticket?.code
  );
}

function getOfferId(offer) {
  return offer?.offerTicketId ?? offer?.id ?? offer?.offerId;
}

function getTicketName(ticket) {
  return (
    ticket?.name ||
    ticket?.displayName ||
    ticket?.ticketName ||
    ticket?.ticket_name ||
    "Ticket"
  );
}

function getOfferName(offer) {
  return (
    offer?.offerName ||
    offer?.displayName ||
    offer?.title ||
    offer?.name ||
    "Offer"
  );
}

function getOfferPrice(offer) {
  return Number(
    offer?.offerPrice ??
      offer?.unitPrice ??
      offer?.price ??
      offer?.offer_price ??
      0
  );
}

function getOfferBadge(offer) {
  if (offer?.badge) return offer.badge;

  const promotionType = String(
    offer?.promotionType || offer?.promotion_type || ""
  ).toUpperCase();

  if (promotionType === "BUY_X_GET_Y") {
    const minQty = offer?.minQty ?? offer?.min_qty;
    const freeQty = offer?.freeQty ?? offer?.free_qty;

    if (minQty && freeQty) {
      return `BUY ${minQty} GET ${freeQty}`;
    }

    return "BOGO";
  }

  const discountValue = Number(
    offer?.discountValue ?? offer?.discount_value ?? 0
  );

  if (discountValue > 0) {
    return `${discountValue}% OFF`;
  }

  return "";
}

function getOfferInstruction(offer) {
  return (
    offer?.instruction ||
    offer?.description ||
    offer?.desc ||
    offer?.shortDescription ||
    ""
  );
}
function getOfferTicketMappings(offer) {
  const mappings =
    offer?.offerTickets ??
    offer?.offer_tickets ??
    offer?.tickets ??
    offer?.ticketMappings ??
    offer?.ticket_mappings;

  return Array.isArray(mappings) ? mappings : [];
}

function getOfferTicketId(ticket) {
  return (
    ticket?.offerTicketId ??
    ticket?.offer_ticket_id ??
    ticket?.mappingId ??
    ticket?.mapping_id ??
    ticket?.id ??
    ticket?.ticketId ??
    ticket?.ticket_id ??
    ticket?.ticketTypeId ??
    ticket?.ticket_type_id ??
    ticket?.code
  );
}

function getMappedTicketName(ticket) {
  return (
    ticket?.displayName ||
    ticket?.display_name ||
    ticket?.ticketName ||
    ticket?.ticket_name ||
    ticket?.name ||
    "Ticket"
  );
}

function getMappedTicketSubname(ticket) {
  return (
    ticket?.displaySubname ||
    ticket?.display_subname ||
    ticket?.badge ||
    ticket?.offerLabel ||
    ticket?.offer_label ||
    ""
  );
}

function getMappedTicketPrice(ticket) {
  return Math.round(
    Number(
      ticket?.offerPrice ??
        ticket?.offer_price ??
        ticket?.unitPrice ??
        ticket?.unit_price ??
        ticket?.price ??
        0
    )
  );
}
/**
 * Loads the existing customer ticket catalogue.
 *
 * GET /api/tickets
 *
 * The booking-session endpoint currently returns addons/offers,
 * but regular tickets come from the existing ticket API.
 */
async function fetchRegularTickets() {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    throw new Error("Unable to read ticket information from the server.");
  }

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.message || "Failed to load regular tickets."
    );
  }

  return Array.isArray(data?.data) ? data.data : [];
}

export default function StepDateOffers({ onNext, initialOfferId }) {
  const {
    visitDate,
    setDate,
    masterData,
    setMasterData,
    ticketQty,
    setTicketQty,
    offerQty,
    setOfferQty,
    setFinalReviewData,
    setOffer,
    setBookingType,
  } = useBooking();

  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingRegularTickets, setLoadingRegularTickets] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState(false);
  // Both sections are expandable.
  const [expandedSection, setExpandedSection] = useState("regular");

  const todayIso = new Date().toISOString().split("T")[0];

  const [stripStartIso, setStripStartIso] = useState(() => {
    if (visitDate && visitDate > todayIso) {
      const diffDays = Math.ceil(
        Math.abs(new Date(visitDate) - new Date(todayIso)) /
          (1000 * 60 * 60 * 24)
      );

      if (diffDays >= 7) {
        return visitDate;
      }
    }

    return todayIso;
  });

  const stripDays = useMemo(
    () => getDaysArray(stripStartIso, 7),
    [stripStartIso]
  );

  const regularTickets = Array.isArray(masterData?.regularTickets)
    ? masterData.regularTickets
    : [];

  const availableOffers = Array.isArray(masterData?.offerTickets)
    ? masterData.offerTickets
    : [];

  /*
   * Date selection:
   *
   * 1. Update the booking session with the selected date.
   * 2. Load the existing regular ticket catalogue from GET /api/tickets.
   * 3. Keep offers returned by the booking-session API.
   */
  const handleDateSelect = async (date) => {
    setErr("");

    // 1. Validate the date using existing validation rules
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setErr("Invalid date format selected.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (date < todayStr) {
      setErr("The selected visit date cannot be in the past.");
      return;
    }

    setLoadingRegularTickets(true);
    setLoadingOffers(true);
    setDate(date);

    // Move rolling strip when selecting a date outside the current range.
    const selectedDate = new Date(date);
    const startDate = new Date(stripStartIso);
    const endDate = new Date(stripStartIso);
    endDate.setDate(startDate.getDate() + 6);
    if (selectedDate < startDate || selectedDate > endDate) {
      setStripStartIso(date);
    }

    try {
      // 2. Update the booking session with the selected date.
      const result = await updateBookingSession({ visitDate: date });
      const responseData = result?.data || {};

      const fetchedRegularTickets = await fetchRegularTickets();

      // 3. Fetch offers for that exact date
      const fetchedOffers = await getOffersByDate(date);

      // 5. Clear old offer selections
      setOffer(null);
      setBookingType("regular");

      // 4. Replace availableOffers in frontend state
      setMasterData({
        ...responseData,
        regularTickets: fetchedRegularTickets,
        offerTickets: fetchedOffers,
        allowOffers: responseData.allowOffers ?? true,
      });

      return fetchedOffers;
    } catch (error) {
      console.error("Date/ticket loading error:", error);
      setErr(
        error?.message ||
          "Failed to load tickets for the selected date. Please try again."
      );
      // Clear offers safely if it fails
      setMasterData({
        ...masterData,
        offerTickets: [],
      });
    } finally {
      setLoadingRegularTickets(false);
      setLoadingOffers(false);
    }
  };

  const handleRegularQtyChange = (ticket, nextQty) => {
    setErr("");

    const id = getTicketId(ticket);

    if (id === undefined || id === null) return;

    setTicketQty(id, Math.max(0, Number(nextQty)));
  };

  const handleOfferQtyChange = (offer, nextQty) => {
    setErr("");

    const id = getOfferTicketId(offer);

    if (id === undefined || id === null) return;

    setOfferQty(id, Math.max(0, Number(nextQty)), true);
  };

  const hasRegularTickets = Object.values(ticketQty).some(
    (qty) => Number(qty) > 0
  );

  const hasOfferTickets = Object.values(offerQty).some(
    (qty) => Number(qty) > 0
  );

  const hasAnyTickets = hasRegularTickets || hasOfferTickets;

  const initAttempted = useRef(false);

  useEffect(() => {
    if (!initialOfferId || initAttempted.current) return;
    
    initAttempted.current = true;

    const initBooking = async () => {
      try {
        setLoadingOffers(true);
        setErr("");
        
        // 1. Ask backend for the nearest valid date
        const nearestDate = await fetchNearestOfferDate(initialOfferId);
        
        // 2. Call existing handleDateSelect, which validates the date and fetches its offers
        const fetchedOffers = await handleDateSelect(nearestDate);
        
        if (fetchedOffers) {
          const validatedOffer = fetchedOffers.find(o => String(o.id) === String(initialOfferId));
          if (validatedOffer) {
            setOffer(validatedOffer);
            setBookingType("offer");
            setExpandedSection("offers");
            
            // Automatically select the offer exactly as if the user clicked '+'
            const mappings = getOfferTicketMappings(validatedOffer);
            const ticketMappings = mappings.length > 0 ? mappings : [validatedOffer];
            const targetTicket = ticketMappings.length > 0 ? ticketMappings[0] : null;
            
            if (targetTicket) {
              handleOfferQtyChange(targetTicket, 1);
            }
          } else {
            setErr("This offer is unavailable for the selected date.");
          }
        }
      } catch (err) {
        setErr(err.message || "This offer is no longer available for booking.");
      } finally {
        setLoadingOffers(false);
      }
    };

    initBooking();
  }, [initialOfferId]);

  const handleProceed = async () => {
    if (!visitDate) {
      setErr("Please select a visit date to continue.");
      return;
    }

    if (!hasAnyTickets) {
      setErr("Please select at least 1 ticket to continue.");
      return;
    }

    setErr("");
    setSubmitting(true);

    try {
      const tickets = regularTickets
        .map((ticket) => {
          const id = getTicketId(ticket);

          const quantity = Number(
            ticketQty[id] ?? ticketQty[String(id)] ?? 0
          );

          return {
            ticketTypeId:
              ticket?.id ??
              ticket?.dbId ??
              ticket?.ticketTypeId ??
              ticket?.ticketId ??
              null,
            quantity,
          };
        })
        .filter(
          (ticket) =>
            ticket.ticketTypeId !== null && ticket.quantity > 0
        );

      const selectedOfferTickets = availableOffers
        .flatMap((offer) => {
          const mappings = getOfferTicketMappings(offer);

          const ticketMappings =
            mappings.length > 0 ? mappings : [offer];

          return ticketMappings.map((offerTicket) => {
            const id = getOfferTicketId(offerTicket);

            const quantity = Number(
              offerQty[id] ??
                offerQty[String(id)] ??
                0
            );

            return {
              offerTicketId: id,
              quantity,
            };
          });
        })
        .filter(
          (offer) =>
            offer.offerTicketId !== undefined &&
            offer.offerTicketId !== null &&
            offer.quantity > 0
        );

      // 1. Update Booking Items (Regular & Offer tickets)
      await updateBookingItems({
        tickets,
        offerTickets: selectedOfferTickets,
        addons: [],
      });

      // 2. Generate Authoritative Backend Quote
      const quoteResponse = await generateBookingQuote();
      if (quoteResponse?.data) {
        setFinalReviewData(quoteResponse.data);
      }

      // 3. Fetch Add-ons
      const meals = await getMeals();
      setMasterData((prev) => ({
        ...prev,
        foods: meals,
      }));

      // 4. Navigate to Add-ons
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error("Booking transition error:", error);

      setErr(
        error?.message ||
          "Failed to process your ticket selection. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-layout">
        {/* MAIN BOOKING CONTENT */}
        <div className="booking-main">
          <div className="booking-page-heading">
            <h1 className="booking-page-heading__title">
              CHOOSE VISIT DATE &{" "}
              <span className="booking-page-heading__accent">
                TICKETS
              </span>
            </h1>

            <p className="booking-page-heading__subtitle">
              Select your visit date and build your ticket selection.
            </p>
          </div>

          {err && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{err}</span>
            </div>
          )}

          {/* DATE */}
          <div className="booking-selection-layout">
            <div className="booking-date-selector">
              <BookingCalendar
                selectedDate={visitDate}
                onSelectDate={handleDateSelect}
              />
            </div>

            {/* TICKET SECTIONS */}
            <div className="booking-offers-section">
              {/* ================= REGULAR TICKETS ================= */}
              <div className="booking-ticket-section">
                <button
                  type="button"
                  className={`booking-ticket-section__header ${
                    expandedSection === "regular"
                      ? "booking-ticket-section__header--expanded"
                      : ""
                  }`}
                  onClick={() =>
                    setExpandedSection((curr) => curr === "regular" ? null : "regular")
                  }
                  aria-expanded={expandedSection === "regular"}
                >
                  <div className="booking-ticket-section__heading">
                    <div className="booking-ticket-section__icon booking-ticket-section__icon--regular">
                      <TicketIcon className="w-6 h-6" />
                    </div>

                    <div>
                      <h2 className="booking-ticket-section__title">
                        REGULAR TICKETS
                      </h2>

                      <p className="booking-ticket-section__subtitle">
                        Standard online pricing
                      </p>
                    </div>
                  </div>

                  {expandedSection === "regular" ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </button>

                {expandedSection === "regular" && (
                  <div className="booking-ticket-section__content">
                    {!visitDate ? (
                      <div className="booking-ticket-section__empty">
                        Select a visit date to view regular tickets.
                      </div>
                    ) : loadingRegularTickets ? (
                      <div className="booking-ticket-section__empty">
                        Loading regular tickets...
                      </div>
                    ) : regularTickets.length === 0 ? (
                      <div className="booking-ticket-section__empty">
                        No regular tickets are available for this date.
                      </div>
                    ) : (
                      <div className="booking-ticket-cards-grid">
                        {regularTickets.map((ticket) => {
                          const id = getTicketId(ticket);

                          const qty = Number(
                            ticketQty[id] ??
                              ticketQty[String(id)] ??
                              0
                          );

                          const name = getTicketName(ticket);

                          /*
                           * API returns prices such as "975.00".
                           * Convert to Number so the UI displays:
                           *
                           * ₹975
                           * ₹763
                           * ₹1,313
                           */
                          const price = Math.round(
                            Number(
                              ticket?.price ??
                                ticket?.onlinePrice ??
                                ticket?.unitPrice ??
                                0
                            )
                          );

                          return (
                            <div
                              key={String(id)}
                              className={`booking-ticket-card ${
                                qty > 0
                                  ? "booking-ticket-card--selected"
                                  : ""
                              }`}
                            >
                              <div className="booking-ticket-card__info">
                                <h3 className="booking-ticket-card__name">
                                  {name}
                                </h3>

                                {ticket?.description && (
                                  <p className="booking-ticket-card__desc">
                                    {ticket.description}
                                  </p>
                                )}

                                <div className="booking-ticket-card__price">
                                  {price === 0
                                    ? "FREE"
                                    : `₹${price.toLocaleString(
                                        "en-IN"
                                      )}`}
                                </div>
                              </div>

                              <div className="booking-ticket-card__controls">
                                <button
                                  type="button"
                                  className="booking-ticket-control booking-ticket-control--minus"
                                  onClick={() =>
                                    handleRegularQtyChange(
                                      ticket,
                                      qty - 1
                                    )
                                  }
                                  disabled={qty <= 0}
                                  aria-label={`Decrease ${name} quantity`}
                                >
                                  −
                                </button>

                                <span
                                  className="booking-ticket-qty"
                                  aria-live="polite"
                                >
                                  {qty}
                                </span>

                                <button
                                  type="button"
                                  className="booking-ticket-control booking-ticket-control--plus"
                                  onClick={() =>
                                    handleRegularQtyChange(
                                      ticket,
                                      qty + 1
                                    )
                                  }
                                  aria-label={`Increase ${name} quantity`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ================= OFFER TICKETS ================= */}
              <div className="booking-ticket-section">
                <button
                  type="button"
                  className={`booking-ticket-section__header ${
                    expandedSection === "offer"
                      ? "booking-ticket-section__header--expanded"
                      : ""
                  }`}
                  onClick={() => setExpandedSection((curr) => curr === "offer" ? null : "offer")}
                  aria-expanded={expandedSection === "offer"}
                >
                  <div className="booking-ticket-section__heading">
                    <div className="booking-ticket-section__icon booking-ticket-section__icon--offer">
                      <Gift className="w-6 h-6" />
                    </div>

                    <div>
                      <h2 className="booking-ticket-section__title">
                        OFFER TICKETS
                      </h2>

                      <p className="booking-ticket-section__subtitle">
                        Promotional offers for your date
                      </p>
                    </div>
                  </div>

                  {expandedSection === "offer" ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </button>

                {expandedSection === "offer" && (
                  <div className="booking-ticket-section__content">
                    {!visitDate ? (
                      <div className="booking-ticket-section__empty">
                        Select a visit date to view available offers.
                      </div>
                    ) : loadingOffers ? (
                      <div className="booking-ticket-section__empty">
                        Loading available offers...
                      </div>
    ) : availableOffers.length === 0 ? (
        <div className="booking-ticket-section__empty">
          No promotional offers are available for this date.
        </div>
      ) : (
        <div className="booking-offer-groups">
          {availableOffers.map((offer, offerIndex) => {
            const offerId =
              getOfferId(offer) ?? `offer-${offerIndex}`;

            const offerName = getOfferName(offer);
            const offerBadge = getOfferBadge(offer);
            const offerInstruction =
              getOfferInstruction(offer);

            const mappings = getOfferTicketMappings(offer);

            const ticketMappings =
              mappings.length > 0 ? mappings : [offer];

            return (
              <div
                key={String(offerId)}
                className="booking-offer-group"
              >
                <div className="booking-offer-group__header">
                  <div className="booking-offer-group__heading">
                    <h3 className="booking-offer-group__title">
                      {offerName}
                    </h3>

                    {offerBadge && (
                      <span className="booking-ticket-card__offer-badge">
                        {offerBadge}
                      </span>
                    )}
                  </div>

                  {offerInstruction && (
                    <p className="booking-offer-group__instruction">
                      {offerInstruction}
                    </p>
                  )}
                </div>

                <div className="booking-ticket-cards-grid">
                  {ticketMappings.map(
                    (ticket, ticketIndex) => {
                      const ticketId =
                        getOfferTicketId(ticket) ??
                        `${offerId}-ticket-${ticketIndex}`;

                      const qty = Number(
                        offerQty[ticketId] ??
                          offerQty[String(ticketId)] ??
                          0
                      );

                      const ticketName =
                        getMappedTicketName(ticket);

                      const ticketSubname =
                        getMappedTicketSubname(ticket);

                      const ticketPrice =
                        getMappedTicketPrice(ticket);

                      const ticketInstruction =
                        ticket?.instruction ||
                        ticket?.displayInstruction ||
                        ticket?.display_instruction ||
                        "";

                      let composition = null;
                      if (ticket.buyQuantity > 0 && ticket.buyTicketId) {
                        const scale = Math.max(1, qty);
                        const buyTicket = regularTickets.find((t) => t.id === ticket.buyTicketId);
                        const buyName = buyTicket ? (buyTicket.name || "ticket").toLowerCase() : "ticket";
                        const totalBuyQty = ticket.buyQuantity * scale;
                        
                        const freeTicket = ticket.freeTicketId ? regularTickets.find((t) => t.id === ticket.freeTicketId) : null;
                        const totalFreeQty = ticket.freeQuantity ? (ticket.freeQuantity * scale) : 0;
                        
                        if (totalFreeQty > 0 && freeTicket) {
                          const freeName = (freeTicket.name || "ticket").toLowerCase();
                          composition = (
                            <div className="booking-ticket-card__instruction mt-1 font-medium leading-tight">
                              <div>{totalBuyQty} &times; {buyName}</div>
                              <div>{totalFreeQty} &times; {freeName}</div>
                            </div>
                          );
                        } else if (ticket.buyQuantity > 1 || !ticket.freeTicketId) {
                          composition = (
                            <div className="booking-ticket-card__instruction mt-1 font-medium leading-tight">
                              <div>{totalBuyQty} &times; {buyName}</div>
                            </div>
                          );
                        }
                      }

                      return (
                        <div
                          key={String(ticketId)}
                          className={`booking-ticket-card booking-ticket-card--offer ${
                            qty > 0
                              ? "booking-ticket-card--selected"
                              : ""
                          }`}
                        >
                          <div className="booking-ticket-card__info">
                            <h3 className="booking-ticket-card__name">
                              {ticketName}
                            </h3>

                            {ticketSubname && (
                              <div className="booking-ticket-card__offer-subname">
                                {ticketSubname}
                              </div>
                            )}

                            <div className="booking-ticket-card__price">
                              {ticketPrice === 0
                                ? "FREE"
                                : `₹${ticketPrice.toLocaleString(
                                    "en-IN"
                                  )}`}
                            </div>

                            {composition || (ticketInstruction && (
                              <div className="booking-ticket-card__instruction">
                                {ticketInstruction}
                              </div>
                            ))}
                          </div>

                          <div className="booking-ticket-card__controls">
                            <button
                              type="button"
                              className="booking-ticket-control booking-ticket-control--minus"
                              onClick={() =>
                                handleOfferQtyChange(
                                  ticket,
                                  qty - 1
                                )
                              }
                              disabled={qty <= 0}
                              aria-label={`Decrease ${ticketName} quantity`}
                            >
                              −
                            </button>

                            <span
                              className="booking-ticket-qty"
                              aria-live="polite"
                            >
                              {qty}
                            </span>

                            <button
                              type="button"
                              className="booking-ticket-control booking-ticket-control--plus"
                              onClick={() =>
                                handleOfferQtyChange(
                                  ticket,
                                  qty + 1
                                )
                              }
                              aria-label={`Increase ${ticketName} quantity`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )}
</div>

              {/* SERVER VALIDATION NOTICE */}
              <div className="booking-promo-notice">
                <Lock className="w-4 h-4 text-[#681B81] inline-block mr-2" />
                Final ticket eligibility and pricing are verified by
                the server before checkout.
              </div>

              {/* STEP 1 CONTINUE */}
              <button
                type="button"
                className="booking-offers-cta"
                onClick={handleProceed}
                disabled={
                  submitting ||
                  loadingRegularTickets ||
                  !visitDate ||
                  !hasAnyTickets
                }
              >
                {submitting
                  ? "Saving..."
                  : "Continue to Add-ons"}

                <ArrowRight className="booking-offers-cta__icon" />
              </button>
            </div>
          </div>
        </div>

        {/* LIVE SUMMARY */}
        <div className="booking-summary-column">
          <BookingSummary
            onNext={handleProceed}
            canProceed={
              Boolean(visitDate) &&
              hasAnyTickets &&
              !submitting &&
              !loadingRegularTickets
            }
          />
        </div>
      </div>
    </div>
  );
}