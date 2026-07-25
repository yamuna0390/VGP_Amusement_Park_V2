const db = require("../../config/database");

const bookingRepository = require("../../repositories/bookingRepository");

const {
    calculateBookingPrice,
} = require("./pricingService");

const {
    generateBookingNumber,
} = require("./bookingNumberService");

const createBooking = async (bookingRequest, authUser) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        // Calculate pricing
        const pricing = await calculateBookingPrice({
            tickets: bookingRequest.tickets,
            meals: bookingRequest.meals,
            visitDate: bookingRequest.visitDate,
            couponCode: bookingRequest.couponCode,
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
                customerMobile: authUser ? authUser.mobile : bookingRequest.customer.mobile,

                visitDate: bookingRequest.visitDate,

                offerId: pricing.offerId,
                offerName: pricing.offerName,

                subtotal: pricing.subtotal,
                discount: pricing.discount,
                tax: pricing.tax,
                grandTotal: pricing.grandTotal,

                couponCode: pricing.couponCode,

                paymentStatus: "Pending",
                bookingStatus: "Pending",
            }
        );

        // Generate booking number
        const bookingNumber =
            await generateBookingNumber(bookingId);

        const invoiceNumber = `INV-${bookingNumber}`;

        // Update booking number and invoice number
        await bookingRepository.updateBookingNumber(
            connection,
            bookingId,
            bookingNumber,
            invoiceNumber
        );

        // Save ticket items
        await bookingRepository.createBookingItems(
            connection,
            bookingId,
            pricing.ticketItems
        );

        // Save meal items
        await bookingRepository.createBookingMeals(
            connection,
            bookingId,
            pricing.mealItems
        );

        await connection.commit();

    return {
    bookingId,
    bookingNumber,
    invoiceNo: `INV-${bookingNumber}`,
    bookingDate: new Date().toISOString().split("T")[0],

    subtotal: pricing.subtotal,
    discount: pricing.discount,
    tax: pricing.tax,
    grandTotal: pricing.grandTotal,

    paymentStatus: "Pending",
    bookingStatus: "Pending",
};

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }
};

const getCustomerBookings = async (customerId) => {
    return await bookingRepository.getBookingsByCustomerId(customerId);
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

    return {
        ...booking,
        tickets,
        meals,
    };
};

module.exports = {
    createBooking,
    getCustomerBookings,
    findBooking,
};