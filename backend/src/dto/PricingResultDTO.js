class PricingResultDTO {

    constructor() {

        // Invoice Line Items
        this.invoiceItems = [];

        // Subtotals
        this.ticketSubtotal = 0;
        this.mealSubtotal = 0;
        this.subtotal = 0;

        // Taxable Amounts (Calculated after discount allocation)
        this.ticketTaxableAmount = 0;
        this.mealTaxableAmount = 0;

        // Discounts
        this.offerDiscount = 0;
        this.couponDiscount = 0;
        this.totalDiscount = 0;

        // Taxes (Calculated exclusively on taxable amounts)
        this.ticketTax = 0;
        this.foodTax = 0;
        this.totalTax = 0;

        // Charges
        this.convenienceFee = 0;

        // Final Amount
        this.grandTotal = 0;

        // Visitors
        this.paidVisitors = 0;
        this.freeVisitors = 0;
        this.totalVisitors = 0;
    }

}

module.exports = PricingResultDTO;