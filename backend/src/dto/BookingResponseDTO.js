class BookingResponseDTO {
    constructor() {
        this.success = false;
        this.message = "";

        this.booking = {
            bookingNumber: "",
            visitDate: "",
            bookingStatus: "",
            paymentStatus: "",
            grandTotal: 0
        };

        this.payment = {
            transactionId: "",
            paymentMethod: ""
        };

        this.download = {
            pdf: ""
        };
    }
}

module.exports = BookingResponseDTO;