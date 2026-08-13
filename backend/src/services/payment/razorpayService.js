const Razorpay = require('razorpay');

let razorpayInstance = null;

function getRazorpayInstance() {
    if (!razorpayInstance) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error("Razorpay credentials are not configured in environment variables.");
        }
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
}

/**
 * Creates a Razorpay Order.
 * 
 * @param {number} amount - Amount in subunits (e.g. paisa for INR)
 * @param {string} currency - Currency code (e.g. "INR")
 * @param {string} receipt - Unique receipt string matching our booking/order
 */
async function createOrder(amount, currency, receipt) {
    const instance = getRazorpayInstance();
    const options = {
        amount: Math.round(amount), // Ensure integer in subunits
        currency: currency || "INR",
        receipt: String(receipt)
    };

    try {
        const order = await instance.orders.create(options);
        return order;
    } catch (error) {
        // Safe logging of Razorpay error details
        if (error.statusCode) {
            console.error("Razorpay Error Response:", {
                statusCode: error.statusCode,
                errorParams: error.error || error.message
            });
        } else {
            console.error("Razorpay Order Creation TypeError/Network Error:", error.message);
        }
        throw new Error("Failed to create payment order with gateway.");
    }
}

module.exports = {
    createOrder
};
