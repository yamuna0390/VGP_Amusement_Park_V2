class BookingRequestDTO {
    constructor(data = {}) {
        this.visitDate = data.visitDate || null;

        this.customer = {
            name: data.customer?.name || "",
            email: data.customer?.email || "",
            mobile: data.customer?.mobile || ""
        };

        this.offerCode = data.offerCode || null;
        this.couponCode = data.couponCode || null;

        this.tickets = Array.isArray(data.tickets)
            ? data.tickets.map(ticket => ({
                  ticketTypeId: Number(ticket.ticketTypeId),
                  quantity: Number(ticket.quantity)
              }))
            : [];

        this.meals = Array.isArray(data.meals)
            ? data.meals.map(meal => ({
                  mealTypeId: Number(meal.mealTypeId),
                  quantity: Number(meal.quantity)
              }))
            : [];

        this.agreedToTerms = Boolean(data.agreedToTerms);
    }
}

module.exports = BookingRequestDTO;