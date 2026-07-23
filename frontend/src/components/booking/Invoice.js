"use client";
import { calcTotals, fmt } from "@/utils/bookingCalc";
import { TICKETS } from "@/data/tickets";
import { MEALS } from "@/data/meals";

export default function Invoice({ booking }) {
  const {
    bookingId, invoiceNo, bookingDate,
    visitDate, customer,
    ticketQty, mealQty,
    selectedOffer, couponCode,
  } = booking;

  const t = calcTotals(ticketQty, mealQty, selectedOffer, couponCode);
  const selectedTickets = TICKETS.filter((tk) => (ticketQty[tk.id] || 0) > 0);
  const selectedMeals   = MEALS.filter((m) => (mealQty[m.id] || 0) > 0);

  const handlePrint = () => window.print();

  return (
    <div className="bk-invoice" id="invoice">
      {/* Header */}
      <div className="bk-inv__head">
        <div>
          <div className="bk-inv__brand">👑 VGP UNIVERSAL KINGDOM</div>
          <div className="bk-inv__sub">Family Amusement &amp; Water Park · ECR, Chennai</div>
        </div>
        <div className="bk-inv__badge">TAX INVOICE · E-TICKET</div>
      </div>

      {/* Invoice meta */}
      <div className="bk-inv__meta">
        <div>
          <strong>Invoice:</strong> {invoiceNo}<br />
          <strong>Date:</strong> {bookingDate}<br />
          <strong>GSTIN:</strong> 33ABCDE1234F1Z5
        </div>
      </div>

      <hr className="bk-inv__hr" />

      {/* Billed to / Visit details */}
      <div className="bk-inv__two">
        <div>
          <div className="bk-inv__section-label">BILLED TO</div>
          <div>{customer.name}</div>
          <div>{customer.email}</div>
          <div>{customer.mobile}</div>
        </div>
        <div>
          <div className="bk-inv__section-label">VISIT DETAILS</div>
          <div>Visit date: <strong>{visitDate}</strong></div>
          <div>Booking ID: <strong>{bookingId}</strong></div>
          {selectedOffer && <div>Offer: {selectedOffer.title}</div>}
        </div>
      </div>

      <hr className="bk-inv__hr" />

      {/* Line items */}
      <table className="bk-inv__table">
        <thead>
          <tr>
            <th>DESCRIPTION</th>
            <th>QTY</th>
            <th>RATE</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {selectedTickets.map((tk) => {
            const rate = tk.discountPrice !== null ? tk.discountPrice : tk.originalPrice;
            const qty  = ticketQty[tk.id];
            return (
              <tr key={tk.id}>
                <td>{tk.name}</td>
                <td>{qty}</td>
                <td>{fmt(rate)}</td>
                <td>{fmt(rate * qty)}</td>
              </tr>
            );
          })}
          {selectedMeals.map((m) => {
            const qty = mealQty[m.id];
            return (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{qty}</td>
                <td>{fmt(m.price)}</td>
                <td>{fmt(m.price * qty)}</td>
              </tr>
            );
          })}

          {t.offerDiscount > 0 && (
            <tr className="bk-inv__deduct">
              <td colSpan={3}>Offer Discount ({selectedOffer?.title})</td>
              <td>−{fmt(t.offerDiscount)}</td>
            </tr>
          )}
          {t.couponDiscount > 0 && (
            <tr className="bk-inv__deduct">
              <td colSpan={3}>Coupon Discount ({couponCode})</td>
              <td>−{fmt(t.couponDiscount)}</td>
            </tr>
          )}

          <tr>
            <td colSpan={3}>GST on tickets (18%)</td>
            <td>{fmt(t.ticketGST)}</td>
          </tr>
          <tr>
            <td colSpan={3}>GST on food (5%)</td>
            <td>{fmt(t.foodGST)}</td>
          </tr>
          <tr>
            <td colSpan={3}>Convenience fee (min ₹{t.convenienceFee})</td>
            <td>{fmt(t.convenienceFee)}</td>
          </tr>
        </tbody>
      </table>

      <div className="bk-inv__total">
        <span>Total Payable</span>
        <strong>{fmt(t.grandTotal)}</strong>
      </div>

      {/* QR + T&C */}
      <div className="bk-inv__bottom">
        <div className="bk-inv__qr-wrap">
          {/* SVG QR placeholder — replace with real QR library */}
          <div className="bk-inv__qr" aria-label={`QR code for booking ${bookingId}`}>
            <svg viewBox="0 0 100 100" width="100" height="100">
              {/* Finder patterns */}
              <rect x="5" y="5" width="30" height="30" rx="2" fill="#1a0a2e"/>
              <rect x="10" y="10" width="20" height="20" rx="1" fill="#fff"/>
              <rect x="13" y="13" width="14" height="14" rx="1" fill="#1a0a2e"/>
              <rect x="65" y="5" width="30" height="30" rx="2" fill="#1a0a2e"/>
              <rect x="70" y="10" width="20" height="20" rx="1" fill="#fff"/>
              <rect x="73" y="13" width="14" height="14" rx="1" fill="#1a0a2e"/>
              <rect x="5" y="65" width="30" height="30" rx="2" fill="#1a0a2e"/>
              <rect x="10" y="70" width="20" height="20" rx="1" fill="#fff"/>
              <rect x="13" y="73" width="14" height="14" rx="1" fill="#1a0a2e"/>
              {/* Data modules */}
              {[40,45,50,55,60,65,70,75,80,85,90].map((x) =>
                [40,45,50,55,60,65,70,75,80,85,90].map((y) =>
                  (x + y) % 10 < 5
                    ? <rect key={`${x}${y}`} x={x} y={y} width="4" height="4" fill="#1a0a2e"/>
                    : null
                )
              )}
              {[40,45,50,55].map((x) =>
                [5,10,15,20,25,30,35].map((y) =>
                  (x * y) % 7 < 3
                    ? <rect key={`r${x}${y}`} x={x} y={y} width="4" height="4" fill="#1a0a2e"/>
                    : null
                )
              )}
            </svg>
          </div>
          <div className="bk-inv__qr-label">
            Scan at entry<br /><strong>{bookingId}</strong>
          </div>
        </div>

        <div className="bk-inv__tc">
          <strong>Terms &amp; Conditions</strong>
          <ul>
            <li>No cancellation/postponement after booking.</li>
            <li>Entry free for children below 90 cm.</li>
            <li>Senior (60+) &amp; students must carry valid ID.</li>
            <li>Birthday offers require original DOB proof at entry.</li>
            <li>This QR code is unique to this transaction and is verified at the gate.</li>
            <li>Recorded locally (server offline).</li>
          </ul>
        </div>
      </div>

      {/* Action buttons */}
      <div className="bk-inv__actions no-print">
        <button className="cta-big cta-red" onClick={handlePrint}>
          🖨 Print / Download PDF
        </button>
      </div>
    </div>
  );
}
