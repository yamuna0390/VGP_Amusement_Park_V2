"use client";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { createPaymentOrder, verifyPayment } from "@/services/bookingApi";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import BookingSummary from "@/components/booking/BookingSummary";
import CustomerForm from "@/components/booking/CustomerForm";
import { fmt } from "@/utils/bookingCalc";

function validateCustomer(c) {
  const errs = {};
  if (!c.name?.trim()) errs.name = "Name is required.";
  if (!c.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email))
    errs.email = "Valid email is required.";
  if (!c.mobile?.trim() || !/^[6-9]\d{9}$/.test(c.mobile.replace(/\D/g, "").slice(-10)))
    errs.mobile = "Valid 10-digit Indian mobile number required.";
  return errs;
}

export default function StepCheckout({ onBack }) {
  const {
    visitDate,
    offerQty,
    ticketQty,
    foodQty,
    masterData,
    couponCode,
    customer,
    setCustomer,
    agreedToTerms,
    setTerms,
    setStep,
    setBookingResult,
    finalReviewData,
  } = useBooking();

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setCustomer({
        name: user.fullName || "",
        email: user.email || "",
        mobile: user.phone || "",
      });
    }
  }, [user, setCustomer]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handlePay = async () => {
    const errs = validateCustomer(customer);

    if (!agreedToTerms) {
      errs.terms = "You must agree to the Terms & Conditions.";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setApiError("");
    setSubmitting(true);

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your connection and retry.");
      }

      const res = await createPaymentOrder();
      const { keyId, orderId, amount, currency, bookingNumber } = res.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "VGP Universal Kingdom",
        description: "Amusement Park Booking",
        order_id: orderId,
        handler: async function (response) {
          try {
            setSubmitting(true);
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };
            
            const verifyRes = await verifyPayment(verifyPayload);
            
            console.log("Mock Payment Success! Verification successful.");
            const payloadForSuccess = {
              bookingNumber: bookingNumber,
              invoiceNo: verifyRes.data?.invoiceNumber || "N/A",
              qr_token: verifyRes.data?.qr_token || null,
              bookingDate: new Date().toISOString(),
              subtotal: finalReviewData?.quote?.subtotal || 0,
              discount: finalReviewData?.quote?.totalDiscount || 0,
              tax: finalReviewData?.quote?.totalTax || 0,
              grandTotal: finalReviewData?.quote?.grandTotal || 0,
              tickets: finalReviewData?.purchaseSummary?.tickets || [],
              offerName: finalReviewData?.session?.offerId ? "Offer Applied" : null,
              visitorCount: finalReviewData?.purchaseSummary?.totalVisitors || 1,
              purchaseSummary: finalReviewData?.purchaseSummary || null,
              quote: {
                subtotal: finalReviewData?.quote?.subtotal ?? 0,
                ticketTax: finalReviewData?.quote?.ticketTax ?? 0,
                addonTax: finalReviewData?.quote?.addonTax ?? 0,
                totalTax: finalReviewData?.quote?.totalTax ?? 0,
                convenienceFee: finalReviewData?.quote?.convenienceFee ?? 0,
                grandTotal: finalReviewData?.quote?.grandTotal ?? 0,
                currency: finalReviewData?.quote?.currency ?? "INR"
              }
            };
            setBookingResult(payloadForSuccess);
            setSubmitting(false);
          } catch (err) {
            setApiError(err.message || "Payment verification failed.");
            setSubmitting(false);
          }
        },
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.mobile,
        },
        theme: {
          color: "#E52823",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed", response.error);
        setApiError(response.error.description || "Payment failed.");
      });

      rzp.open();
    } catch (error) {
      setApiError(error.message || "Failed to create payment order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bk-step-content">
      {/* Header row with back button + Title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#FDDB00] border-none flex items-center justify-center text-slate-800 font-black cursor-pointer hover:bg-[#e6c700] transition-colors"
        >
          <ChevronLeft size={22} />
        </button>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide m-0" style={{ fontFamily: "var(--font-roboto-condensed), sans-serif" }}>
          REVIEW YOUR BOOKING
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ── Left Column: Park Information ── */}
        <div className="order-2 lg:order-1 lg:w-1/2 flex flex-col gap-6">
          <div 
            className="bk-panel bg-white rounded-3xl p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col"
            style={{ minHeight: "calc(100vh - 160px)" }}
          >
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide mb-4">
              PARK INFORMATION
            </h2>
            
            <div className="w-full flex-grow relative mb-6 min-h-[250px]">
              <img 
                src="/images/sampleVGP.jpg" 
                alt="VGP Universal Kingdom" 
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: "contain", objectPosition: "center top" }}
              />
            </div>

            <div className="mt-auto">
              <p className="text-slate-700 font-bold mb-8 text-center text-[1.05rem]">
                7 hours of non-stop thrills, twists, and unforgettable excitement!
              </p>
              
              <div className="mb-8">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-4">
                  PARK TIMINGS / WATER TIMINGS
                </h3>
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[300px]">
                  <thead>
                    <tr>
                      <th className="pb-3 text-slate-500 font-bold uppercase tracking-wider text-xs"></th>
                      <th className="pb-3 text-slate-800 font-black">WEEKDAYS</th>
                      <th className="pb-3 text-slate-800 font-black">WEEKENDS</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 font-medium">
                    <tr className="border-t border-slate-200">
                      <td className="py-3.5 pr-2 text-slate-700 font-bold">Park Timings</td>
                      <td className="py-3.5 pr-2">11 AM – 6 PM</td>
                      <td className="py-3.5">11 AM – 7 PM</td>
                    </tr>
                    <tr className="border-t border-slate-200">
                      <td className="py-3.5 pr-2 text-slate-700 font-bold">Water Timings</td>
                      <td className="py-3.5 pr-2">12 PM – 6 PM</td>
                      <td className="py-3.5">12 PM – 6 PM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-2">
                UPCOMING HOLIDAYS
              </h3>
              <p className="text-slate-600 font-medium m-0">
                Perfect for an adventure trip — we are open all 365 days!
              </p>
            </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Booking Summary & Payment ── */}
        <div className="order-1 lg:order-2 lg:w-1/2 flex flex-col gap-6">
          <BookingSummary
            ticketQty={ticketQty}
            foodQty={foodQty}
            offerQty={offerQty}
            couponCode={couponCode}
            visitDate={visitDate}
          />
          
          <div className="bk-panel bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200">
            <div className="bk-terms mb-5">
              <label className="flex gap-3 items-start cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={agreedToTerms}
                  onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: undefined })); }}
                  id="terms-chk"
                />
                <span className="text-sm text-slate-600 font-semibold leading-relaxed group-hover:text-slate-800 transition-colors">
                  I agree to the VGP Universal Kingdom{" "}
                  <a href="/terms" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">Terms &amp; Conditions</a> and Privacy Policy.
                </span>
              </label>
              {errors.terms && <p className="text-red-600 font-bold text-sm mt-2">{errors.terms}</p>}
            </div>

            {apiError && (
              <p className="text-red-600 font-bold text-sm mt-2 mb-4 bg-red-50 p-3 rounded-xl border border-red-100">
                {apiError}
              </p>
            )}

            <button
              className="w-full bg-[#E52823] text-white font-black text-lg py-4 px-6 rounded-xl hover:bg-[#c81e1a] transform transition-all active:scale-[0.98] shadow-lg shadow-red-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handlePay}
              disabled={submitting}
              id="step4-pay-btn"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Booking…
                </span>
              ) : (
                "Book Now 🎟"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
