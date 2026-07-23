"use client";
import { createContext, useContext, useReducer, useCallback } from "react";
import { generateBookingId, generateInvoice } from "@/utils/bookingCalc";

// ─── Initial State ─────────────────────────────────────────────────────────
const initialState = {
  step: 1,

  // Step 1
  visitDate: null,       // ISO date string "YYYY-MM-DD"
  selectedOffer: null,   // offer object | null

  // Step 2
  ticketQty: {
    adult: 0, child: 0, senior: 0,
    student: 0, dfpa: 0, dfpc: 0, below90: 0,
  },

  // Step 3
  mealQty: {
    veg: 0, nonveg: 0, kids: 0, snacks: 0,
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

  // Step 5 (after payment)
  bookingId: null,
  invoiceNo: null,
  bookingDate: null,
};

// ─── Reducer ───────────────────────────────────────────────────────────────
function bookingReducer(state, action) {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };

    case "SET_DATE":
      return { ...state, visitDate: action.payload };

    case "SET_OFFER":
      return { ...state, selectedOffer: action.payload };

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
      };

    case "SET_CUSTOMER":
      return {
        ...state,
        customer: { ...state.customer, ...action.payload },
      };

    case "SET_TERMS":
      return { ...state, agreedToTerms: action.payload };

    case "CONFIRM_BOOKING": {
      const id = generateBookingId();
      return {
        ...state,
        step: 5,
        bookingId: id,
        invoiceNo: generateInvoice(id),
        bookingDate: new Date().toISOString().split("T")[0],
      };
    }

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────
const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const setStep        = useCallback((s) => dispatch({ type: "SET_STEP", payload: s }), []);
  const setDate        = useCallback((d) => dispatch({ type: "SET_DATE", payload: d }), []);
  const setOffer       = useCallback((o) => dispatch({ type: "SET_OFFER", payload: o }), []);
  const setTicketQty   = useCallback((id, qty) => dispatch({ type: "SET_TICKET_QTY", id, payload: qty }), []);
  const setMealQty     = useCallback((id, qty) => dispatch({ type: "SET_MEAL_QTY", id, payload: qty }), []);
  const setCoupon      = useCallback((code, coupon) => dispatch({ type: "SET_COUPON", payload: code, coupon }), []);
  const setCustomer    = useCallback((data) => dispatch({ type: "SET_CUSTOMER", payload: data }), []);
  const setTerms       = useCallback((v) => dispatch({ type: "SET_TERMS", payload: v }), []);
  const confirmBooking = useCallback(() => dispatch({ type: "CONFIRM_BOOKING" }), []);
  const resetBooking   = useCallback(() => dispatch({ type: "RESET" }), []);

  return (
    <BookingContext.Provider value={{
      ...state,
      setStep, setDate, setOffer,
      setTicketQty, setMealQty,
      setCoupon, setCustomer, setTerms,
      confirmBooking, resetBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
