"use client";

import { useEffect, useRef } from "react";

/**
 * StepTickets
 *
 * Ticket selection is handled completely in Step 1.
 *
 * Booking flow:
 * Step 1 → Date + Tickets + Offers + Live Summary
 * Step 2 → Add-ons
 * Step 3 → Customer Info
 * Step 4 → Checkout
 *
 * Kept for compatibility with the existing booking step controller.
 */
export default function StepTickets({ onNext }) {
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (redirectedRef.current) return;

    if (typeof onNext === "function") {
      redirectedRef.current = true;
      onNext();
    }
  }, [onNext]);

  return null;
}