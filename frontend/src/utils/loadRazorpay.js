export const loadRazorpay = () => {
  return new Promise((resolve) => {
    // Check if the script is already loaded
    if (document.getElementById("razorpay-checkout-js")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
