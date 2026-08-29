/**
 * Pure booking summary utilities.
 *
 * New booking flow:
 * Step 1:
 *   - Regular tickets + quantities
 *   - Offer tickets + quantities
 *
 * Step 2:
 *   - Add-ons
 *
 * Step 3:
 *   - Customer information
 *
 * Step 4:
 *   - Checkout
 *
 * Regular tickets and offer tickets are independent items.
 * No old selectedOffer/ticketMappings pricing logic is applied.
 */

/**
 * Get selected regular tickets.
 */
export function getSelectedRegularTickets(
  ticketQty = {},
  regularTickets = []
) {
  const selected = [];

  if (!ticketQty || !Array.isArray(regularTickets)) {
    return selected;
  }

  regularTickets.forEach((ticket) => {
    const ticketId =
      ticket.ticketId !== undefined
        ? ticket.ticketId
        : ticket.id !== undefined
          ? ticket.id
          : ticket.code;

    const qty = Number(
      ticketQty[ticketId] ||
      ticketQty[String(ticketId)] ||
      0
    );

    if (qty > 0) {
      selected.push({
        ticketId,
        quantity: qty,
      });
    }
  });

  return selected;
}

/**
 * Get selected offer tickets.
 *
 * Offer tickets are now independent purchasable items.
 */
export function getSelectedOfferTickets(
  offerQty = {},
  offerTickets = []
) {
  const selected = [];

  if (!offerQty || !Array.isArray(offerTickets)) {
    return selected;
  }

  offerTickets.forEach((offer) => {
    const offerTicketId =
      offer.offerTicketId !== undefined
        ? offer.offerTicketId
        : offer.id;

    const qty = Number(
      offerQty[offerTicketId] ||
      offerQty[String(offerTicketId)] ||
      0
    );

    if (qty > 0) {
      selected.push({
        offerTicketId,
        quantity: qty,
      });
    }
  });

  return selected;
}

/**
 * Get selected food/add-on items.
 */
export function getSelectedFoods(
  foodQty = {},
  foods = []
) {
  const selected = [];

  if (!foodQty || !Array.isArray(foods)) {
    return selected;
  }

  foods.forEach((food) => {
    const foodId =
      food.foodId !== undefined
        ? food.foodId
        : food.id;

    const qty = Number(
      foodQty[foodId] ||
      foodQty[String(foodId)] ||
      0
    );

    if (qty > 0) {
      selected.push({
        foodId,
        quantity: qty,
      });
    }
  });

  return selected;
}

/**
 * Get regular ticket unit price.
 *
 * Regular ticket price always comes from the regular ticket itself.
 */
export function getRegularTicketPrice(ticket) {
  return Number(
    ticket?.price ??
    ticket?.unitPrice ??
    ticket?.fare ??
    0
  );
}

/**
 * Get offer ticket unit price.
 *
 * New dummy offer structure:
 *
 * {
 *   id,
 *   displayName,
 *   displaySubname,
 *   offerPrice,
 *   instruction
 * }
 *
 * Backend offer structure can later be mapped to this
 * same calculation without changing the UI flow.
 */
export function getOfferTicketPrice(offer) {
  return Number(
    offer?.offerPrice ??
    offer?.unitPrice ??
    offer?.price ??
    0
  );
}

/**
 * Backward-compatible helper.
 *
 * Old code may still import getEffectiveTicketPrice.
 * In the new flow it simply returns the regular ticket price.
 */
export function getEffectiveTicketPrice(
  ticket,
  bookingType,
  selectedOffer
) {
  return getRegularTicketPrice(ticket);
}

/**
 * Calculate regular ticket total.
 */
export function getRegularTicketTotal(
  ticketQty = {},
  regularTickets = []
) {
  let total = 0;

  if (!Array.isArray(regularTickets)) {
    return 0;
  }

  regularTickets.forEach((ticket) => {
    const id =
      ticket.code ??
      ticket.ticketId ??
      ticket.id;

    const qty = Number(
      ticketQty[id] ||
      ticketQty[String(id)] ||
      0
    );

    if (qty > 0) {
      total += qty * getRegularTicketPrice(ticket);
    }
  });

  return Number(total.toFixed(2));
}

/**
 * Calculate offer ticket total.
 */
export function getOfferTicketTotal(
  offerQty = {},
  offerTickets = []
) {
  let total = 0;

  if (!Array.isArray(offerTickets)) {
    return 0;
  }

  offerTickets.forEach((offer) => {
    const id =
      offer.offerTicketId ??
      offer.id;

    const qty = Number(
      offerQty[id] ||
      offerQty[String(id)] ||
      0
    );

    if (qty > 0) {
      total += qty * getOfferTicketPrice(offer);
    }
  });

  return Number(total.toFixed(2));
}

/**
 * Calculate combined ticket total.
 *
 * Regular tickets + offer tickets.
 */
export function getTicketTotal(
  ticketQty = {},
  regularTickets = [],
  offerQty = {},
  offerTickets = [],
  bookingType = "regular",
  selectedOffer = null
) {
  const regularTotal = getRegularTicketTotal(
    ticketQty,
    regularTickets
  );

  const offerTotal = getOfferTicketTotal(
    offerQty,
    offerTickets
  );

  return Number(
    (regularTotal + offerTotal).toFixed(2)
  );
}

/**
 * Calculate add-on / food total.
 */
export function getFoodTotal(
  foodQty = {},
  foods = []
) {
  let total = 0;

  if (!Array.isArray(foods)) {
    return 0;
  }

  foods.forEach((food) => {
    const id =
      food.foodId !== undefined
        ? food.foodId
        : food.id;

    const qty = Number(
      foodQty[id] ||
      foodQty[String(id)] ||
      0
    );

    const price = Number(
      food.price ??
      food.unitPrice ??
      0
    );

    if (qty > 0) {
      total += qty * price;
    }
  });

  return Number(total.toFixed(2));
}

/**
 * Calculate grand total.
 *
 * Regular tickets
 * + Offer tickets
 * + Add-ons
 */
export function getGrandTotal(
  ticketQty = {},
  regularTickets = [],
  offerQty = {},
  offerTickets = [],
  foodQty = {},
  foods = [],
  bookingType = "regular",
  selectedOffer = null
) {
  const ticketTotal = getTicketTotal(
    ticketQty,
    regularTickets,
    offerQty,
    offerTickets
  );

  const foodTotal = getFoodTotal(
    foodQty,
    foods
  );

  return Number(
    (ticketTotal + foodTotal).toFixed(2)
  );
}

/**
 * Get complete live-summary data.
 *
 * Useful for displaying:
 *
 * Regular Tickets
 *   Adult x 2      ₹1700
 *
 * Offer Tickets
 *   Early Bird x 1 ₹765
 *
 * Add-ons
 *   Food x 2       ₹300
 *
 * Grand Total      ₹2765
 */
export function getBookingSummary(
  ticketQty = {},
  regularTickets = [],
  offerQty = {},
  offerTickets = [],
  foodQty = {},
  foods = []
) {
  const regularItems = [];
  const offerItems = [];
  const foodItems = [];

  if (Array.isArray(regularTickets)) {
    regularTickets.forEach((ticket) => {
      const id =
        ticket.code ??
        ticket.ticketId ??
        ticket.id;

      const quantity = Number(
        ticketQty[id] ||
        ticketQty[String(id)] ||
        0
      );

      if (quantity > 0) {
        const unitPrice = getRegularTicketPrice(ticket);

        regularItems.push({
          id,
          name: ticket.name || ticket.displayName || "Ticket",
          quantity,
          unitPrice,
          total: Number(
            (quantity * unitPrice).toFixed(2)
          ),
        });
      }
    });
  }

  if (Array.isArray(offerTickets)) {
    offerTickets.forEach((offer) => {
      const id =
        offer.offerTicketId ??
        offer.id;

      const quantity = Number(
        offerQty[id] ||
        offerQty[String(id)] ||
        0
      );

      if (quantity > 0) {
        const unitPrice = getOfferTicketPrice(offer);

        offerItems.push({
          id,
          name:
            offer.displayName ||
            offer.name ||
            "Offer",
          subname:
            offer.displaySubname ||
            offer.badge ||
            "",
          instruction:
            offer.instruction || "",
          quantity,
          unitPrice,
          total: Number(
            (quantity * unitPrice).toFixed(2)
          ),
        });
      }
    });
  }

  if (Array.isArray(foods)) {
    foods.forEach((food) => {
      const id =
        food.foodId !== undefined
          ? food.foodId
          : food.id;

      const quantity = Number(
        foodQty[id] ||
        foodQty[String(id)] ||
        0
      );

      if (quantity > 0) {
        const unitPrice = Number(
          food.price ??
          food.unitPrice ??
          0
        );

        foodItems.push({
          id,
          name:
            food.name ||
            food.displayName ||
            "Add-on",
          quantity,
          unitPrice,
          total: Number(
            (quantity * unitPrice).toFixed(2)
          ),
        });
      }
    });
  }

  const regularTotal = regularItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const offerTotal = offerItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const foodTotal = foodItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const ticketTotal = regularTotal + offerTotal;
  const grandTotal = ticketTotal + foodTotal;

  return {
    regularItems,
    offerItems,
    foodItems,

    regularTotal: Number(regularTotal.toFixed(2)),
    offerTotal: Number(offerTotal.toFixed(2)),
    ticketTotal: Number(ticketTotal.toFixed(2)),
    foodTotal: Number(foodTotal.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
  };
}

/**
 * Build checkout payload.
 */
export function buildCheckoutPayload({
  visitDate,
  ticketQty = {},
  regularTickets = [],
  offerQty = {},
  offerTickets = [],
  foodQty = {},
  foods = [],
  couponCode = "",
  customer = {},
} = {}) {
  return {
    visitDate,

    regularTickets: getSelectedRegularTickets(
      ticketQty,
      regularTickets
    ),

    offerTickets: getSelectedOfferTickets(
      offerQty,
      offerTickets
    ),

    foods: getSelectedFoods(
      foodQty,
      foods
    ),

    couponCode,
    customer,
  };
}

/**
 * Temporary UI coupon calculation.
 *
 * Subtotal =
 * Regular Tickets
 * + Offer Tickets
 * + Add-ons
 */
export function calculateTemporaryCouponUiDiscount(
  ticketTotal = 0,
  foodTotal = 0,
  appliedCoupon = null
) {
  const subtotal =
    Number(ticketTotal || 0) +
    Number(foodTotal || 0);

  if (!appliedCoupon || subtotal <= 0) {
    return {
      discountAmount: 0,
      adjustedGrandTotal: subtotal,
    };
  }

  const discountType = String(
    appliedCoupon.discountType || ""
  )
    .toUpperCase()
    .trim();

  const discountValue = Number(
    appliedCoupon.discountValue || 0
  );

  let discountAmount = 0;

  if (
    discountType === "PERCENTAGE" ||
    discountType === "PERCENT"
  ) {
    discountAmount =
      (subtotal * discountValue) / 100;
  } else if (
    discountType === "FLAT" ||
    discountType === "FIXED"
  ) {
    discountAmount = discountValue;
  }

  discountAmount = Math.max(
    0,
    Math.min(discountAmount, subtotal)
  );

  discountAmount = Number(
    discountAmount.toFixed(2)
  );

  const adjustedGrandTotal = Number(
    (subtotal - discountAmount).toFixed(2)
  );

  return {
    discountAmount,
    adjustedGrandTotal,
  };
}

export default {
  getSelectedRegularTickets,
  getSelectedOfferTickets,
  getSelectedFoods,

  getRegularTicketPrice,
  getOfferTicketPrice,
  getEffectiveTicketPrice,

  getRegularTicketTotal,
  getOfferTicketTotal,
  getTicketTotal,
  getFoodTotal,
  getGrandTotal,

  getBookingSummary,

  buildCheckoutPayload,
  calculateTemporaryCouponUiDiscount,
};