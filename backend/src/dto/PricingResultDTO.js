class PricingResultDTO {
    constructor() {
        this.bookingItems = [];

        this.subtotal = 0;

        this.offerDiscount = 0;
        this.couponDiscount = 0;
        this.totalDiscount = 0;

        this.ticketTax = 0;
        this.foodTax = 0;
        this.totalTax = 0;

        this.convenienceFee = 0;

        this.grandTotal = 0;

        this.paidVisitors = 0;
        this.freeVisitors = 0;
        this.totalVisitors = 0;
    }
}

module.exports = PricingResultDTO;