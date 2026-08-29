"use client";

import { createContext, useContext, useReducer, useCallback } from "react";
import { getTicketTotal, getFoodTotal, getGrandTotal, calculateTemporaryCouponUiDiscount } from "@/utils/bookingSummary";

// ─── Initial State ─────────────────────────────────────────────────────────
const initialState = {
  step: 1,

  // Step 1
  visitDate: null,
  bookingType: "regular",
  selectedOffer: null,

  masterData: {
    regularTickets: [],
    offerTickets: [],
    foods: [],
    parkSettings: {},
  },

  // Step 2
  ticketQty: {},
  offerQty: {},

  // Step 3
  foodQty: {},

  // Step 4
  couponCode: "",
  appliedCoupon: null,
  couponApplied: false,
  finalReviewData: null,

  customer: {
    name: "",
    email: "",
    mobile: "",
    sendTicketByWhatsapp: true,
  },

  agreedToTerms: false,

  // Step 5 (Backend Response)
  bookingResult: null,
};

// ─── Reducer ───────────────────────────────────────────────────────────────
function bookingReducer(state, action) {
  switch (action.type) {
    case "SET_STEP":
      return {
        ...state,
        step: action.payload,
      };

    case "SET_DATE":
      return {
        ...state,
        visitDate: action.payload,
        ticketQty: {},
        offerQty: {},
        foodQty: {},
        finalReviewData: null,
      };

    case "SET_BOOKING_TYPE":
      return {
        ...state,
        bookingType: action.payload,
        ticketQty: {},
        offerQty: {},
        foodQty: {},
        finalReviewData: null,
      };

    case "SET_OFFER":
      return {
        ...state,
        selectedOffer: action.payload,
        ticketQty: {},
        offerQty: {},
        foodQty: {},
        finalReviewData: null,
        couponCode: action.payload ? "" : state.couponCode,
        appliedCoupon: action.payload ? null : state.appliedCoupon,
        couponApplied: action.payload ? false : state.couponApplied,
      };

    case "SET_TICKET_QTY":
      return {
        ...state,
        ticketQty: {
          ...state.ticketQty,
          [action.id]: Math.max(0, action.payload),
        },
        finalReviewData: null,
      };

    case "SET_OFFER_QTY": {
      if (action.payload <= 0) {
        const { [action.id]: _, ...restOfferQty } = state.offerQty;
        return {
          ...state,
          offerQty: restOfferQty,
          finalReviewData: null,
        };
      }
      return {
        ...state,
        couponCode: "",
        appliedCoupon: null,
        couponApplied: false,
        finalReviewData: null,
        offerQty: action.resetOthers
          ? { [action.id]: Math.max(0, action.payload) }
          : {
              ...state.offerQty,
              [action.id]: Math.max(0, action.payload),
            },
      };
    }

    case "SET_FOOD_QTY":
      return {
        ...state,
        foodQty: {
          ...state.foodQty,
          [action.id]: Math.max(0, action.payload),
        },
        finalReviewData: null,
      };

    case "SET_COUPON": {
      const isApplied = Boolean(action.payload && action.coupon);
      return {
        ...state,
        couponCode: action.payload || "",
        appliedCoupon: action.coupon || null,
        couponApplied: isApplied,
        offerQty: isApplied ? {} : state.offerQty,
        finalReviewData: null,
      };
    }

    case "SET_FINAL_REVIEW_DATA":
      return {
        ...state,
        finalReviewData: action.payload || null,
      };

    case "SET_CUSTOMER":
      return {
        ...state,
        customer: {
          ...state.customer,
          ...action.payload,
        },
      };

    case "SET_TERMS":
      return {
        ...state,
        agreedToTerms: action.payload,
      };

    case "SET_BOOKING_RESULT":
      return {
        ...state,
        bookingResult: action.payload,
        bookingId: action.payload.bookingNumber,
        invoiceNo: action.payload.invoiceNo,
        bookingDate: action.payload.bookingDate,
        subtotal: action.payload.subtotal,
        discount: action.payload.discount,
        discountPercent: action.payload.discountPercent,
        tax: action.payload.tax,
        grandTotal: action.payload.grandTotal,
        savings: action.payload.savings,
        tickets: action.payload.tickets,
        offer_name: action.payload.offerName,
        step: 5,
      };

    case "SET_MASTER_DATA": {
      const masterDataUpdate = typeof action.payload === "function"
        ? action.payload(state.masterData)
        : action.payload;

      return {
        ...state,
        masterData: {
          ...state.masterData,
          ...masterDataUpdate,
        },
      };
    }

    case "RESET":
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────
const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const { ticketQty, offerQty, foodQty, masterData, appliedCoupon, couponApplied, bookingType, selectedOffer } = state;

  const flattenedOfferTickets = Array.isArray(masterData.offerTickets)
    ? masterData.offerTickets.flatMap((offer) => offer.offerTickets || offer.offer_tickets || [])
    : [];

  const ticketTotal = getTicketTotal(
    ticketQty,
    masterData.regularTickets || [],
    offerQty,
    flattenedOfferTickets,
    bookingType,
    selectedOffer
  );

  const foodTotal = getFoodTotal(
    foodQty,
    masterData.foods || []
  );

  const calculatedGrandTotal = getGrandTotal(
    ticketQty,
    masterData.regularTickets || [],
    offerQty,
    flattenedOfferTickets,
    foodQty,
    masterData.foods || [],
    bookingType,
    selectedOffer
  );

  const { discountAmount: couponDiscount, adjustedGrandTotal } = calculateTemporaryCouponUiDiscount(
    ticketTotal,
    foodTotal,
    couponApplied ? appliedCoupon : null
  );

  const grandTotal = couponApplied ? adjustedGrandTotal : calculatedGrandTotal;

  const setStep = useCallback(
    (step) => dispatch({ type: "SET_STEP", payload: step }),
    []
  );

  const setDate = useCallback(
    (date) => dispatch({ type: "SET_DATE", payload: date }),
    []
  );

  const setBookingType = useCallback(
    (type) => dispatch({ type: "SET_BOOKING_TYPE", payload: type }),
    []
  );

  const setOffer = useCallback(
    (offer) => dispatch({ type: "SET_OFFER", payload: offer }),
    []
  );

  const setTicketQty = useCallback(
    (id, qty) =>
      dispatch({
        type: "SET_TICKET_QTY",
        id,
        payload: qty,
      }),
    []
  );

  const setOfferQty = useCallback(
    (id, qty, resetOthers = false) =>
      dispatch({
        type: "SET_OFFER_QTY",
        id,
        payload: qty,
        resetOthers,
      }),
    []
  );

  const setFoodQty = useCallback(
    (id, qty) =>
      dispatch({
        type: "SET_FOOD_QTY",
        id,
        payload: qty,
      }),
    []
  );

  const setCoupon = useCallback(
    (code, coupon) =>
      dispatch({
        type: "SET_COUPON",
        payload: code,
        coupon,
      }),
    []
  );

  const setFinalReviewData = useCallback(
    (data) =>
      dispatch({
        type: "SET_FINAL_REVIEW_DATA",
        payload: data,
      }),
    []
  );

  const setCustomer = useCallback(
    (customer) =>
      dispatch({
        type: "SET_CUSTOMER",
        payload: customer,
      }),
    []
  );

  const setTerms = useCallback(
    (value) =>
      dispatch({
        type: "SET_TERMS",
        payload: value,
      }),
    []
  );

  const setBookingResult = useCallback(
    (result) =>
      dispatch({
        type: "SET_BOOKING_RESULT",
        payload: result,
      }),
    []
  );

  const setMasterData = useCallback(
    (data) =>
      dispatch({
        type: "SET_MASTER_DATA",
        payload: data,
      }),
    []
  );

  const resetBooking = useCallback(
    () => dispatch({ type: "RESET" }),
    []
  );

  return (
    <BookingContext.Provider
      value={{
        ...state,

        foodQty,
        ticketTotal,
        foodTotal,
        grandTotal,
        couponDiscount,

        setStep,
        setDate,
        setBookingType,
        setMasterData,
        setTicketQty,
        setOfferQty,
        setFoodQty,
        setCoupon,
        setOffer,
        setFinalReviewData,
        setCustomer,
        setTerms,

        setBookingResult,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
}