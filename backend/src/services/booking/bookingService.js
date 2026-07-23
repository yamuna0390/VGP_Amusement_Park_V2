const bookingRepository = require("../../repositories/bookingRepository");

/**
 * Generate Booking Number
 */
function generateBookingNumber() {
  const timestamp = Date.now();
  return `VGP${timestamp}`;
}

/**
 * Create Booking
 */
async function createBooking(data) {
  const bookingNumber = generateBookingNumber();

  const booking = {
    bookingNumber,
    customerId: null,
    customerName: data.customer.name,
    customerEmail: data.customer.email,
    customerMobile: data.customer.mobile,

    visitDate: data.visitDate,

    offerId: data.selectedOffer?.id || null,
    offerName: data.selectedOffer?.name || null,

    subtotal: data.subtotal,
    discount: data.discount,
    tax: data.tax,
    grandTotal: data.grandTotal,

    couponCode: data.couponCode || null,
  };

  const bookingId = await bookingRepository.createBooking(booking);

  await bookingRepository.saveTicketItems(
    bookingId,
    data.ticketQty
  );

  await bookingRepository.saveMealItems(
    bookingId,
    data.mealQty
  );

  return {
    bookingId,
    bookingNumber,
  };
}

module.exports = {
  createBooking,
};