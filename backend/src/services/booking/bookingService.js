const db = require("../../config/database");
const bookingRepository = require("../../repositories/bookingRepository");
const { calculateBookingPrice } = require("./pricingService");
const { generateBookingNumber } = require("./bookingNumberService");

const createBooking = async (bookingRequest, authUser) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

// console.log("===== bookingRequest =====");
// console.log(JSON.stringify(bookingRequest, null, 2));
// console.log("===== bookingRequest END =====");
    // Calculate pricing using centralized offer engine
    const pricing = await calculateBookingPrice({
      tickets: bookingRequest.tickets,
      meals: bookingRequest.meals,
      visitDate: bookingRequest.visitDate,
      couponCode: bookingRequest.couponCode,
      offerCode: bookingRequest.offerCode,
    });

    // Initial booking insert
    const bookingId = await bookingRepository.createBooking(
      connection,
      {
        bookingNumber: "TEMP",
        invoiceNumber: "INV-TEMP",
        customerId: authUser ? authUser.id : null,
        customerName: authUser ? authUser.name : bookingRequest.customer.name,
        customerEmail: authUser ? authUser.email : bookingRequest.customer.email,
        customerMobile: authUser ? (authUser.phone || authUser.mobile) : bookingRequest.customer.mobile,
        visitDate: bookingRequest.visitDate,
        offerId: pricing.offerId,
        offerName: pricing.offerName || pricing.offerCode, // fallback to code
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        tax: pricing.tax,
        grandTotal: pricing.grandTotal,
        couponCode: pricing.couponCode,
        paymentStatus: "Pending",
        bookingStatus: "Pending Payment",
      }
    );

    // Generate booking number
    const bookingNumber = await generateBookingNumber(bookingId);
    const invoiceNumber = `INV-${bookingNumber}`;

    // Update booking number and invoice number
    await bookingRepository.updateBookingNumber(
      connection,
      bookingId,
      bookingNumber,
      invoiceNumber
    );
console.log("===== Invoice Items =====");
console.log(JSON.stringify(pricing.ticketItems, null, 2));

    // Save all itemized lines (paid tickets, free tickets, meals, tax, fees) to booking_items
    await bookingRepository.createBookingItems(
      connection,
      bookingId,
      pricing.ticketItems
    );

    // Note: meals are already stored in booking_items (with itemType='Meal') by offerEngine.
    // No need to separately insert into booking_meals — that table is redundant.

    await connection.commit();

    return {
      bookingId,
      bookingNumber,
      invoiceNo: invoiceNumber,
      bookingDate: new Date().toISOString().split("T")[0],
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      discountPercent: pricing.discountPercent,
      offerName: pricing.offerName,
      offerCode: pricing.offerCode,
      tax: pricing.tax,
      grandTotal: pricing.grandTotal,
      savings: pricing.savings,
      visitorCount: pricing.visitorCount,
      paymentStatus: "Pending",
      bookingStatus: "Pending Payment",
      tickets: pricing.ticketItems,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getCustomerBookings = async (customerId) => {
  const bookings = await bookingRepository.getBookingsByCustomerId(customerId);
  const populated = [];
  for (const booking of bookings) {
    const items = await bookingRepository.getBookingItems(booking.id);
    let visitorCount = 0;
    items.forEach(item => {
      if (item.ticket_type.toLowerCase().includes("ticket")) {
        visitorCount += item.quantity;
      }
    });
    populated.push({
      ...booking,
      visitor_count: visitorCount || 1,
    });
  }
  return populated;
};

const findBooking = async ({ bookingNumber, mobileNumber, email }) => {
  const booking = await bookingRepository.getBookingByNumber(bookingNumber);
  if (!booking) {
    throw new Error("Booking not found");
  }

  const matchMobile = mobileNumber && booking.customer_mobile === mobileNumber;
  const matchEmail = email && booking.customer_email.toLowerCase() === email.toLowerCase();

  if (!matchMobile && !matchEmail) {
    throw new Error("Invalid booking number or contact details");
  }

  const tickets = await bookingRepository.getBookingItems(booking.id);
  const meals = await bookingRepository.getBookingMeals(booking.id);

  let visitorCount = 0;
  tickets.forEach(item => {
    if (item.ticket_type.toLowerCase().includes("ticket")) {
      visitorCount += item.quantity;
    }
  });

  return {
    ...booking,
    tickets,
    meals,
    visitor_count: visitorCount || 1,
  };
};

module.exports = {
  createBooking,
  getCustomerBookings,
  findBooking,
};