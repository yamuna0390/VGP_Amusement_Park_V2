const ticketRepository = require("../../repositories/ticketRepository");
const mealRepository = require("../../repositories/mealRepository");

/**
 * Recalculates booking prices and generates invoice items
 */

const calculatePricing = async ({
  tickets = [], // array of { ticketType, quantity }
  meals = [], // array of { mealType, quantity }
  appliedOffer = null, // offer object from DB
  appliedCoupon = null, // coupon object from DB
}) => {

//   /**
//  * input print 
//  */
// console.log("===== Offer Engine Input =====");
// console.log(
//   JSON.stringify(
//     {
//       tickets,
//       meals,
//       appliedOffer,
//       appliedCoupon,
//     },
//     null,
//     2
//   )
// ); 
// /**
//  * input print  end
//  */
  // 1. Fetch tickets and meals details from DB
  const ticketCodes = tickets.map(t => t.ticketType);
  const ticketRows = ticketCodes.length ? await ticketRepository.getTicketsByCodes(ticketCodes) : [];
  const ticketMap = {};
  ticketRows.forEach(t => {
    ticketMap[t.code] = t;
  });

  const mealCodes = meals.map(m => m.mealType);
  const mealRows = mealCodes.length ? await mealRepository.getMealsByCodes(mealCodes) : [];
  const mealMap = {};
  mealRows.forEach(m => {
    mealMap[m.code] = m;
  });

  let ticketSubtotal = 0;
  let foodSubtotal = 0;
  const invoiceItems = []; // List of all lines printed on invoice
  let savings = 0;
  let totalPaidVisitors = 0;
  let totalFreeVisitors = 0;

  // 2. Process Ticket Items & Promotional Rules
  const offerRule = appliedOffer ? appliedOffer.offer_rule : null;
  const applicableTickets = appliedOffer && appliedOffer.applicable_tickets
    ? appliedOffer.applicable_tickets.split(",").map(s => s.trim())
    : [];

  // Temporary container for ticket calculations
  const processedTickets = [];

  for (const t of tickets) {
    const info = ticketMap[t.ticketType];
    if (!info) {
      throw new Error(`Invalid ticket type: ${t.ticketType}`);
    }

    const qty = Number(t.quantity);
    if (qty <= 0) continue;

    const price = Number(info.price);
    const itemSubtotal = qty * price;
    ticketSubtotal += itemSubtotal;
    totalPaidVisitors += qty;

    processedTickets.push({
      code: info.code,
      name: info.name,
      qty,
      price,
      itemSubtotal
    });
  }

  let offerDiscount = 0;

  // Apply offer rules if present
  if (appliedOffer) {
    if (offerRule === "BOGO") {
      // For each ticket, if it's applicable and qty >= min_qty, add matching free tickets
      const minQty = appliedOffer.min_qty || 1;
      const freeQtyPerMin = appliedOffer.free_qty || 1;

      for (const pt of processedTickets) {
        if (applicableTickets.includes(pt.code)) {
          // BOGO applies: for each paid ticket, we add free_qty_per_min free tickets
          const freeQty = pt.qty * freeQtyPerMin;
          if (freeQty > 0) {
            totalFreeVisitors += freeQty;
            savings += freeQty * pt.price;
            offerDiscount += freeQty * pt.price; // Discount tracks overall savings

            // Save paid line
            invoiceItems.push({
              ticketType: `${pt.name} Ticket`,
              quantity: pt.qty,
              unitPrice: pt.price,
              totalPrice: pt.itemSubtotal,
              itemType: "Ticket"
            });

            // Save free line
            invoiceItems.push({
              ticketType: `${pt.name} Ticket (${appliedOffer.offer_name} FREE)`,
              quantity: freeQty,
              unitPrice: 0,
              totalPrice: 0,
              itemType: "Ticket"
            });
          }
        } else {
          // Normal paid line
          invoiceItems.push({
            ticketType: `${pt.name} Ticket`,
            quantity: pt.qty,
            unitPrice: pt.price,
            totalPrice: pt.itemSubtotal,
            itemType: "Ticket"
          });
        }
      }
    } else if (offerRule === "B2G1") {
      // Buy 2 Get 1 Free: for every minQty (2) paid, add freeQty (1) free ticket
      const minQty = appliedOffer.min_qty || 2;
      const freeQtyPerMin = appliedOffer.free_qty || 1;

      for (const pt of processedTickets) {
        if (applicableTickets.includes(pt.code) && pt.qty >= minQty) {
          const multiplier = Math.floor(pt.qty / minQty);
          const freeQty = multiplier * freeQtyPerMin;

          if (freeQty > 0) {
            totalFreeVisitors += freeQty;
            savings += freeQty * pt.price;
            offerDiscount += freeQty * pt.price;

            // Save paid line
            invoiceItems.push({
              ticketType: `${pt.name} Ticket`,
              quantity: pt.qty,
              unitPrice: pt.price,
              totalPrice: pt.itemSubtotal,
              itemType: "Ticket"
            });

            // Save free line
            invoiceItems.push({
              ticketType: `${pt.name} Ticket (${appliedOffer.offer_name} FREE)`,
              quantity: freeQty,
              unitPrice: 0,
              totalPrice: 0,
              itemType: "Ticket"
            });
          } else {
            invoiceItems.push({
              ticketType: `${pt.name} Ticket`,
              quantity: pt.qty,
              unitPrice: pt.price,
              totalPrice: pt.itemSubtotal,
              itemType: "Ticket"
            });
          }
        } else {
          invoiceItems.push({
            ticketType: `${pt.name} Ticket`,
            quantity: pt.qty,
            unitPrice: pt.price,
            totalPrice: pt.itemSubtotal,
            itemType: "Ticket"
          });
        }
      }
    } else if (offerRule === "PERCENTAGE") {
      // Percentage discount on applicable tickets
      let applicableSubtotal = 0;
      for (const pt of processedTickets) {
        if (applicableTickets.length === 0 || applicableTickets.includes(pt.code)) {
          applicableSubtotal += pt.itemSubtotal;
        }
        invoiceItems.push({
          ticketType: `${pt.name} Ticket`,
          quantity: pt.qty,
          unitPrice: pt.price,
          totalPrice: pt.itemSubtotal,
          itemType: "Ticket"
        });
      }
      offerDiscount = Number(((applicableSubtotal * Number(appliedOffer.discount_value)) / 100).toFixed(2));
      savings += offerDiscount;

      // Add visible discount line item to invoice
      if (offerDiscount > 0) {
        invoiceItems.push({
          ticketType: `Offer Discount (${appliedOffer.offer_name} · ${Number(appliedOffer.discount_value)}%)`,
          quantity: null,
          unitPrice: null,
          totalPrice: -offerDiscount,
          itemType: "Discount"
        });
      }
    } else if (offerRule === "FLAT") {
      // Flat discount on applicable tickets
      let applicableQty = 0;
      for (const pt of processedTickets) {
        if (applicableTickets.length === 0 || applicableTickets.includes(pt.code)) {
          applicableQty += pt.qty;
        }
        invoiceItems.push({
          ticketType: `${pt.name} Ticket`,
          quantity: pt.qty,
          unitPrice: pt.price,
          totalPrice: pt.itemSubtotal,
          itemType: "Ticket"
        });
      }
      // Apply flat discount per ticket or flat amount.
      offerDiscount = Math.min(applicableQty * Number(appliedOffer.discount_value), ticketSubtotal);
      savings += offerDiscount;

      // Add visible discount line item to invoice
      if (offerDiscount > 0) {
        invoiceItems.push({
          ticketType: `Offer Discount (${appliedOffer.offer_name} · ₹${Number(appliedOffer.discount_value).toFixed(2)} off)`,
          quantity: null,
          unitPrice: null,
          totalPrice: -offerDiscount,
          itemType: "Discount"
        });
      }
    }
  } else {
    // No offer, just add normal ticket lines
    for (const pt of processedTickets) {
      invoiceItems.push({
        ticketType: `${pt.name} Ticket`,
        quantity: pt.qty,
        unitPrice: pt.price,
        totalPrice: pt.itemSubtotal,
        itemType: "Ticket"
      });
    }
  }

  // 3. Process Food Items
  for (const m of meals) {
    const info = mealMap[m.mealType];
    if (!info) {
      throw new Error(`Invalid meal type: ${m.mealType}`);
    }

    const qty = Number(m.quantity);
    if (qty <= 0) continue;

    const price = Number(info.price);
    const itemTotal = qty * price;
    foodSubtotal += itemTotal;

    invoiceItems.push({
      ticketType: `${info.name}`,
      quantity: qty,
      unitPrice: price,
      totalPrice: itemTotal,
      itemType: "Meal"
    });
  }

  // 4. Process Coupon Rules
  let couponDiscount = 0;
  if (appliedCoupon && !appliedOffer) {
    const minimumAmount = Number(appliedCoupon.minimum_amount || 0);
    if (ticketSubtotal >= minimumAmount) {
      if (appliedCoupon.discount_type === "Percentage") {
        couponDiscount = Number(((ticketSubtotal * Number(appliedCoupon.discount_value)) / 100).toFixed(2));
      } else {
        couponDiscount = Math.min(Number(appliedCoupon.discount_value), ticketSubtotal);
      }
      savings += couponDiscount;

      // Add visible coupon discount line item to invoice
      if (couponDiscount > 0) {
        const couponLabel = appliedCoupon.discount_type === "Percentage"
          ? `Coupon Discount (${appliedCoupon.coupon_code} · ${Number(appliedCoupon.discount_value)}%)`
          : `Coupon Discount (${appliedCoupon.coupon_code} · ₹${Number(appliedCoupon.discount_value).toFixed(2)} off)`;
        invoiceItems.push({
          ticketType: couponLabel,
          quantity: null,
          unitPrice: null,
          totalPrice: -couponDiscount,
          itemType: "Discount"
        });
      }
    }
  }

  // 5. Calculate GST (18% on tickets after discount, 5% on food)
  const finalTicketSubtotal = Math.max(0, ticketSubtotal - offerDiscount - couponDiscount);
  const ticketGST = Number((finalTicketSubtotal * 0.18).toFixed(2));
  const foodGST = Number((foodSubtotal * 0.05).toFixed(2));
  const totalGST = Number((ticketGST + foodGST).toFixed(2));

  // 6. Convenience Fee (₹40 flat if any tickets are selected)
  const convenienceFee = totalPaidVisitors > 0 ? 40.00 : 0.00;

  // 7. Add GST and Convenience Fee lines to invoice items
  if (ticketGST > 0) {
    invoiceItems.push({
      ticketType: "GST on tickets (18%)",
      quantity: 1,
      unitPrice: ticketGST,
      totalPrice: ticketGST,
      itemType: "Tax"
    });
  }
  if (foodGST > 0) {
    invoiceItems.push({
      ticketType: "GST on food (5%)",
      quantity: 1,
      unitPrice: foodGST,
      totalPrice: foodGST,
      itemType: "Tax"
    });
  }
  if (convenienceFee > 0) {
    invoiceItems.push({
      ticketType: "Convenience fee",
      quantity: 1,
      unitPrice: convenienceFee,
      totalPrice: convenienceFee,
      itemType: "Fee"
    });
  }

  const subtotal = Number((ticketSubtotal + foodSubtotal).toFixed(2));
  const totalDiscount = Number((offerDiscount + couponDiscount).toFixed(2));
  const grandTotal = Number((finalTicketSubtotal + foodSubtotal + totalGST + convenienceFee).toFixed(2));

  // Determine discount percentage for display
  const discountPercent = appliedOffer && appliedOffer.offer_rule === "PERCENTAGE"
    ? Number(appliedOffer.discount_value)
    : (appliedCoupon && appliedCoupon.discount_type === "Percentage" ? Number(appliedCoupon.discount_value) : null);
const pricingResult = {
  subtotal,
  discount: totalDiscount,
  offerDiscount,
  couponDiscount,
  discountPercent,
  tax: totalGST,
  convenienceFee,
  grandTotal,
  savings,
  visitorCount: totalPaidVisitors + totalFreeVisitors,
  paidVisitorCount: totalPaidVisitors,
  freeVisitorCount: totalFreeVisitors,
  invoiceItems,
};

// console.log("\n========== OFFER ENGINE OUTPUT ==========");
// console.log(JSON.stringify(pricingResult, null, 2));
// console.log("=========================================\n");
return pricingResult;
};

module.exports = {
  calculatePricing,
};
