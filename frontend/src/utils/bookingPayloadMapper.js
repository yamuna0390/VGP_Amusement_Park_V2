/**
 * Converts BookingContext state into the API payload
 * expected by the backend.
 */

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
    .map(([ticketType, quantity]) => ({
      ticketType,
      quantity,
    }));

  const meals = Object.entries(mealQty)
    .filter(([, quantity]) => quantity > 0)
    .map(([mealType, quantity]) => ({
      mealType,
      quantity,
    }));

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