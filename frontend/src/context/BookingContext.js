"use client";

import { createContext, useContext, useReducer, useCallback } from "react";

// ─── Initial State ─────────────────────────────────────────────────────────
const initialState = {
  step: 1,

  // Step 1
  visitDate: null,
  selectedOffer: null,

  // Step 2
  ticketQty: {
    adult: 0,
    child: 0,
    senior: 0,
    student: 0,
    dfpa: 0,
    dfpc: 0,
    below90: 0,
  },

  // Step 3
  mealQty: {
    veg: 0,
    nonveg: 0,
    kids: 0,
    snacks: 0,
  },

  // Step 4
  couponCode: "",
  appliedCoupon: null,

  customer: {
    name: "",
    email: "",
    mobile: "",
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
      };

    case "SET_OFFER":
      return {
        ...state,
        selectedOffer: action.payload,
        couponCode: "",
        appliedCoupon: null,
      };

    case "SET_TICKET_QTY":
      return {
        ...state,
        ticketQty: {
          ...state.ticketQty,
          [action.id]: Math.max(0, action.payload),
        },
      };

    case "SET_MEAL_QTY":
      return {
        ...state,
        role: undefined, // ensure state remains clean
        mealQty: {
          ...state.mealQty,
          [action.id]: Math.max(0, action.payload),
        },
      };

    case "SET_COUPON":
      return {
        ...state,
        couponCode: action.payload,
        appliedCoupon: action.coupon || null,
        selectedOffer: null,
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

  const setStep = useCallback(
    (step) => dispatch({ type: "SET_STEP", payload: step }),
    []
  );

  const setDate = useCallback(
    (date) => dispatch({ type: "SET_DATE", payload: date }),
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

  const setMealQty = useCallback(
    (id, qty) =>
      dispatch({
        type: "SET_MEAL_QTY",
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

  const resetBooking = useCallback(
    () => dispatch({ type: "RESET" }),
    []
  );

  return (
    <BookingContext.Provider
      value={{
        ...state,

        setStep,
        setDate,
        setOffer,
        setTicketQty,
        setMealQty,
        setCoupon,
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