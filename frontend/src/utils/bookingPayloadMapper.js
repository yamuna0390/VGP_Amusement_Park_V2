/**
 * Converts BookingContext state into the API payload
 * expected by the backend.
 */

import { TICKETS } from "@/data/tickets";
import { MEALS } from "@/data/meals";

export function buildBookingPayload(state) {
  const {
    visitDate,
    selectedOffer,
    ticketQty,
    mealQty,
    couponCode,
    customer,
    agreedToTerms,
  } = state;

  const tickets = Object.entries(ticketQty)
    .filter(([, quantity]) => quantity > 0)
    .map(([ticketType, quantity]) => {
      const ticket = TICKETS.find((t) => t.id === ticketType);
      return {
        ticketTypeId: ticket ? ticket.dbId : null,
        quantity,
      };
    })
    .filter((t) => t.ticketTypeId !== null);

  const meals = Object.entries(mealQty)
    .filter(([, quantity]) => quantity > 0)
    .map(([mealType, quantity]) => {
      const meal = MEALS.find((m) => m.id === mealType);
      return {
        mealTypeId: meal ? meal.dbId : null,
        quantity,
      };
    })
    .filter((m) => m.mealTypeId !== null);

  return {
    visitDate,

    // Send only the ID to the backend
    offerId: selectedOffer?.id || null,

    couponCode,

    customer: {
      name: customer.name.trim(),
      email: customer.email.trim(),
      mobile: customer.mobile.trim(),
    },

    agreedToTerms,

    tickets,

    meals,
  };
}