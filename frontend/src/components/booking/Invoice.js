"use client";
import { useBooking } from "@/context/BookingContext";
import { calcTotals, fmt } from "@/utils/bookingCalc";
import { QRCodeSVG } from "qrcode.react";

const formatISTDate = (dateString) => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const parts = formatter.formatToParts(d);
    const p = {};
    parts.forEach(part => { p[part.type] = part.value; });
    
    return `${p.day} ${p.month} ${p.year}, ${p.hour}:${p.minute} ${p.dayPeriod}`;
  } catch (e) {
    return dateString;
  }
};

export default function Invoice({ booking }) {
  const {
    bookingId, 
    bookingNumber, 
    invoiceNo, 
    bookingDate,
    visitDate, 
    customer,
    ticketQty, 
    foodQty,
    selectedOffer, 
    couponCode,
    offer_name,
    coupon_code,
    subtotal,
    discount,
    discountPercent,
    savings,
    tax,
    grandTotal,
    bookingResult,
    qr_token,
  } = booking;

  // Resolve booking ID and invoice number keys (camelCase vs snake_case)
  const bNumber = bookingNumber || bookingId;
  const bInvoiceNo = invoiceNo || `INV-${bNumber}`;
  
const quote = booking.quote || bookingResult?.quote;
  const qrToken = bookingResult?.qr_token || null;
  
  const displayGrandTotal = quote ? quote.grandTotal : (grandTotal !== undefined ? grandTotal : 0);
  const displaySubtotal = quote ? quote.subtotal : subtotal;
  const displayOfferName = selectedOffer?.title || offer_name;
  const displayCouponCode = couponCode || coupon_code;
  const displayDiscount = quote?.totalDiscount !== undefined ? quote.totalDiscount : (discount || 0);
  const displaySavings = savings || displayDiscount;

  // Normalize items to a consistent format (handle both camelCase from live API and snake_case from DB)
  const rawItems = booking.tickets || [];
  const normalizedItems = rawItems.map((item, idx) => {
    const ticketType = item.ticket_type || item.ticketType || '';
    const lowerType = ticketType.toLowerCase();

    // Infer itemType from text content if not explicitly set
    let itemType = item.item_type || item.itemType || null;
    if (!itemType) {
      if (lowerType.includes('discount') || Number(item.total_price ?? item.totalPrice) < 0) {
        itemType = 'Discount';
      } else if (lowerType.includes('gst')) {
        itemType = 'Tax';
      } else if (lowerType.includes('convenience')) {
        itemType = 'Fee';
      } else {
        itemType = 'Ticket';
      }
    }

    return {
      id: item.id || idx,
      ticketType,
      quantity: item.quantity,
      unitPrice: item.unit_price !== undefined ? item.unit_price : item.unitPrice,
      totalPrice: item.total_price !== undefined ? item.total_price : item.totalPrice,
      itemType,
    };
  });

  // Check if booking has itemized data (from backend)
  const isItemized = normalizedItems.length > 0 && normalizedItems.some(item =>
    item.ticketType.toLowerCase().includes("ticket") ||
    item.ticketType.toLowerCase().includes("gst") ||
    item.ticketType.toLowerCase().includes("convenience") ||
    item.ticketType.toLowerCase().includes("discount")
  );

  let contextMasterData = { regularTickets: [], foods: [] };
  try {
    const context = useBooking();
    if (context?.masterData) contextMasterData = context.masterData;
  } catch (e) {}

  const regularTickets = booking.masterData?.regularTickets || contextMasterData.regularTickets || [];
  const foods = booking.masterData?.foods || contextMasterData.foods || [];

  const t = !isItemized ? calcTotals(ticketQty || {}, foodQty || {}, selectedOffer, couponCode) : null;
  const selectedRegularTickets = !isItemized ? regularTickets.filter((tk) => Number(ticketQty?.[tk.id] || ticketQty?.[tk.code] || 0) > 0) : [];
  const selectedFoods   = !isItemized ? foods.filter((m) => Number(foodQty?.[m.id] || foodQty?.[m.code] || 0) > 0) : [];

  const handlePrint = () => window.print();

  return (
    <div className="bk-invoice" id="invoice" style={{ background: "#fff", padding: "30px", borderRadius: "12px", border: "1.5px solid var(--border)", boxShadow: "0 6px 15px rgba(0,0,0,0.02)" }}>
      {/* Header */}
      <div className="bk-inv__head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--purple-deep)", paddingBottom: "14px", marginBottom: "20px" }}>
        <div>
          <div className="bk-inv__brand" style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--purple-deep)" }}>👑 VGP UNIVERSAL KINGDOM</div>
          <div className="bk-inv__sub" style={{ fontSize: "0.8rem", color: "#666" }}>Family Amusement &amp; Water Park · ECR, Chennai</div>
        </div>
        <div className="bk-inv__badge" style={{ fontSize: "0.85rem", fontWeight: "800", background: "var(--purple-light)", color: "var(--purple-deep)", padding: "4px 10px", borderRadius: "6px" }}>
          TAX INVOICE · E-TICKET
        </div>
      </div>

      {/* Invoice meta */}
      <div className="bk-inv__meta" style={{ fontSize: "0.85rem", color: "#444", marginBottom: "20px" }}>
        <div>
          <strong>Invoice:</strong> {bInvoiceNo}<br />
          <strong>Date:</strong> {formatISTDate(bookingDate || booking.created_at)}<br />
          <strong>GSTIN:</strong> 33ABCDE1234F1Z5
        </div>
      </div>

      <hr className="bk-inv__hr" style={{ border: "0", borderTop: "1px dashed var(--border)", margin: "20px 0" }} />

      {/* Billed to / Visit details */}
      <div className="bk-inv__two-auto">
        <div>
          <div className="bk-inv__section-label" style={{ fontWeight: "800", color: "#888", marginBottom: "6px", fontSize: "0.75rem", letterSpacing: "0.5px" }}>BILLED TO</div>
          <div>{customer?.name || booking.customer_name}</div>
          <div>{customer?.email || booking.customer_email}</div>
          <div>{customer?.mobile || booking.customer_mobile}</div>
        </div>
        <div>
          <div className="bk-inv__section-label" style={{ fontWeight: "800", color: "#888", marginBottom: "6px", fontSize: "0.75rem", letterSpacing: "0.5px" }}>VISIT DETAILS</div>
          <div>Visit date: <strong>{visitDate || (booking.visit_date ? new Date(booking.visit_date).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "")}</strong></div>
          <div>Booking ID: <strong>{bNumber}</strong></div>
          {displayOfferName && (
            <div>Offer: <strong style={{ color: "var(--purple-deep)" }}>
              {displayOfferName}{discountPercent ? ` (${discountPercent}%)` : ''}
            </strong></div>
          )}
          {displayCouponCode && <div>Coupon: <strong style={{ color: "#2e7d32" }}>{displayCouponCode}</strong></div>}
          {displaySavings > 0 && (
            <div style={{ color: "#2e7d32", fontWeight: "700", marginTop: "4px" }}>
              💰 You save: {fmt(displaySavings)}
            </div>
          )}
        </div>
      </div>

      <hr className="bk-inv__hr" style={{ border: "0", borderTop: "1px dashed var(--border)", margin: "20px 0" }} />

      {/* Line items */}
      <table className="bk-inv__table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginBottom: "20px" }}>
        <thead>
          <tr style={{ borderBottom: "2.5px solid var(--purple-deep)", textAlign: "left", color: "var(--purple-deep)", fontWeight: "800" }}>
            <th style={{ padding: "8px 0" }}>DESCRIPTION</th>
            <th style={{ padding: "8px 0", textAlign: "center" }}>QTY</th>
            <th style={{ padding: "8px 0", textAlign: "right" }}>RATE</th>
            <th style={{ padding: "8px 0", textAlign: "right" }}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {isItemized ? (
            // Render database-itemized rows directly
            normalizedItems.map((item) => {
              const isDiscount = item.itemType === "Discount";
              const isFree = item.ticketType.includes("FREE");
              const isTaxOrFee = item.itemType === "Tax" || item.itemType === "Fee";

              if (isDiscount) {
                return (
                  <tr key={item.id} className="bk-inv__deduct" style={{ borderBottom: "1px solid #f3effa" }}>
                    <td colSpan={3} style={{ padding: "10px 0", color: "#2e7d32", fontWeight: "700" }}>
                      {item.ticketType}
                    </td>
                    <td style={{ padding: "10px 0", textAlign: "right", color: "#2e7d32", fontWeight: "700" }}>
                      −{fmt(Math.abs(Number(item.totalPrice)))}
                    </td>
                  </tr>
                );
              }

              if (isTaxOrFee) {
                return (
                  <tr key={item.id} style={{ borderBottom: "1px dashed var(--border)" }}>
                    <td colSpan={3} style={{ padding: "8px 0" }}>{item.ticketType}</td>
                    <td style={{ padding: "8px 0", textAlign: "right" }}>{fmt(item.totalPrice)}</td>
                  </tr>
                );
              }

              return (
                <tr key={item.id} style={{ borderBottom: "1px solid #f3effa" }}>
                  <td style={{ padding: "10px 0", fontWeight: isFree ? "700" : "500" }}>
                    {item.ticketType}
                  </td>
                  <td style={{ padding: "10px 0", textAlign: "center" }}>{item.quantity || ''}</td>
                  <td style={{ padding: "10px 0", textAlign: "right" }}>
                    {item.unitPrice != null ? fmt(item.unitPrice) : ''}
                  </td>
                  <td style={{ padding: "10px 0", textAlign: "right", color: isFree ? "#2e7d32" : "inherit" }}>
                    {isFree ? "₹0.00" : fmt(item.totalPrice)}
                  </td>
                </tr>
              );
            })
          ) : (
            // Fallback rendering for older non-itemized bookings
            <>
              {rawItems.length > 0 && rawItems[0].pricingType !== undefined ? (
                <>
                  {rawItems.flatMap((item, idx) => {
                    const rows = [];
                    
                    if (item.pricingType === "OFFER" && item.components && item.components.length > 0) {
                      rows.push(
                        <tr key={`${item.code || idx}-parent`} style={{ borderBottom: "none" }}>
                          <td style={{ padding: "10px 0 2px 0", fontWeight: "700" }}>{item.name}</td>
                          <td style={{ padding: "10px 0 2px 0", textAlign: "center" }}>{item.quantity}</td>
                          <td style={{ padding: "10px 0 2px 0", textAlign: "right" }}>{fmt(item.unitPrice)}</td>
                          <td style={{ padding: "10px 0 2px 0", textAlign: "right" }}>{fmt(item.amount)}</td>
                        </tr>
                      );
                      
                      item.components.forEach((comp, cIdx) => {
                        const isFree = comp.componentType === "FREE";
                        rows.push(
                          <tr key={`${item.code || idx}-comp-${cIdx}`} style={{ borderBottom: cIdx === item.components.length - 1 ? "1px solid #f3effa" : "none" }}>
                            <td style={{ padding: "2px 0 6px 15px", fontSize: "0.8rem", color: "#555" }}>
                              {comp.componentType}: {comp.name}
                            </td>
                            <td style={{ padding: "2px 0 6px 0", textAlign: "center", fontSize: "0.8rem", color: "#555" }}>
                              {comp.quantity}
                            </td>
                            <td style={{ padding: "2px 0 6px 0", textAlign: "right", fontSize: "0.8rem", color: "#555" }}>
                              {isFree ? "FREE" : "Included"}
                            </td>
                            <td style={{ padding: "2px 0 6px 0", textAlign: "right", fontSize: "0.8rem", color: isFree ? "#2e7d32" : "#555" }}>
                              {isFree ? "₹0.00" : "-"}
                            </td>
                          </tr>
                        );
                      });
                    } else if (item.pricingType === "REGULAR" && (!item.freeQuantity || item.freeQuantity === 0)) {
                      rows.push(
                        <tr key={`${item.code || idx}-reg`} style={{ borderBottom: "1px solid #f3effa" }}>
                          <td style={{ padding: "10px 0", fontWeight: "500" }}>{item.name}</td>
                          <td style={{ padding: "10px 0", textAlign: "center" }}>{item.quantity || item.paidQuantity}</td>
                          <td style={{ padding: "10px 0", textAlign: "right" }}>{fmt(item.unitPrice)}</td>
                          <td style={{ padding: "10px 0", textAlign: "right" }}>{fmt(item.amount)}</td>
                        </tr>
                      );
                    } else {
                      // Fallback for missing components or older structure
                      if (item.paidQuantity > 0 || (item.quantity > 0 && !item.freeQuantity)) {
                        const qty = item.paidQuantity || item.quantity;
                        rows.push(
                          <tr key={`${item.code || idx}-paid`} style={{ borderBottom: "1px solid #f3effa" }}>
                            <td style={{ padding: "10px 0", fontWeight: "500" }}>{item.name}</td>
                            <td style={{ padding: "10px 0", textAlign: "center" }}>{qty}</td>
                            <td style={{ padding: "10px 0", textAlign: "right" }}>{fmt(item.unitPrice)}</td>
                            <td style={{ padding: "10px 0", textAlign: "right" }}>{fmt(item.amount)}</td>
                          </tr>
                        );
                      }
                      if (item.freeQuantity > 0) {
                        rows.push(
                          <tr key={`${item.code || idx}-free`} style={{ borderBottom: "1px solid #f3effa" }}>
                            <td style={{ padding: "10px 0", fontWeight: "700" }}>Free {item.name}</td>
                            <td style={{ padding: "10px 0", textAlign: "center" }}>{item.freeQuantity}</td>
                            <td style={{ padding: "10px 0", textAlign: "right" }}>FREE</td>
                            <td style={{ padding: "10px 0", textAlign: "right", color: "#2e7d32" }}>₹0.00</td>
                          </tr>
                        );
                      }
                    }
                    
                    return rows;
                  })}
                  {bookingResult?.purchaseSummary?.addons?.map((item, idx) => (
                    <tr key={`addon-${item.code || idx}`} style={{ borderBottom: "1px solid #f3effa" }}>
                      <td style={{ padding: "10px 0", fontWeight: "500" }}>{item.name}</td>
                      <td style={{ padding: "10px 0", textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ padding: "10px 0", textAlign: "right" }}>{fmt(item.unitPrice)}</td>
                      <td style={{ padding: "10px 0", textAlign: "right" }}>{fmt(item.amount)}</td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {selectedRegularTickets.map((tk) => {
                    const rate = tk.price !== undefined ? tk.price : (tk.discountPrice !== null ? tk.discountPrice : tk.originalPrice) || 0;
                    const qty  = Number(ticketQty[tk.id] || ticketQty[tk.code] || 0);
                    return (
                      <tr key={tk.id || tk.code} style={{ borderBottom: "1px solid #f3effa" }}>
                        <td style={{ padding: "10px 0" }}>{tk.name}</td>
                        <td style={{ padding: "10px 0", textAlign: "center" }}>{qty}</td>
                        <td style={{ padding: "10px 0", textAlign: "right" }}>{fmt(rate)}</td>
                        <td style={{ padding: "10px 0", textAlign: "right" }}>{fmt(rate * qty)}</td>
                      </tr>
                    );
                  })}
                  {selectedFoods.map((m) => {
                    const qty = Number(foodQty?.[m.id] || foodQty?.[m.code] || 0);
                    const price = Number(m.price || m.unitPrice || 0);
                    return (
                      <tr key={m.id || m.code} style={{ borderBottom: "1px solid #f3effa" }}>
                        <td style={{ padding: "10px 0" }}>{m.name}</td>
                        <td style={{ padding: "10px 0", textAlign: "center" }}>{qty}</td>
                        <td style={{ padding: "10px 0", textAlign: "right" }}>{fmt(price)}</td>
                        <td style={{ padding: "10px 0", textAlign: "right" }}>{fmt(price * qty)}</td>
                      </tr>
                    );
                  })}
                </>
              )}
              {(!isItemized && (!quote || displayDiscount > 0)) && (
                <tr className="bk-inv__deduct" style={{ color: "#2e7d32", fontWeight: "700" }}>
                  <td colSpan={3} style={{ padding: "10px 0" }}>Discount Applied</td>
                  <td style={{ padding: "10px 0", textAlign: "right" }}>−{fmt(displayDiscount)}</td>
                </tr>
              )}
              <tr style={{ borderBottom: "1px dashed var(--border)" }}>
                <td colSpan={3} style={{ padding: "8px 0" }}>GST on tickets (18%)</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>{fmt(quote ? quote.ticketTax : t?.ticketGST || 0)}</td>
              </tr>
              <tr style={{ borderBottom: "1px dashed var(--border)" }}>
                <td colSpan={3} style={{ padding: "8px 0" }}>GST on food (5%)</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>{fmt(quote ? quote.addonTax : t?.foodGST || 0)}</td>
              </tr>
              <tr style={{ borderBottom: "1px dashed var(--border)" }}>
                <td colSpan={3} style={{ padding: "8px 0" }}>Convenience fee {(!quote && t) ? `(min ₹${t.convenienceFee})` : ''}</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>{fmt(quote ? quote.convenienceFee : t?.convenienceFee || 0)}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      <div className="bk-inv__total" style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: "900", borderTop: "2px solid var(--purple-deep)", paddingTop: "12px", marginBottom: "30px", color: "var(--purple-deep)" }}>
        <span>Total Payable</span>
        <strong>{fmt(displayGrandTotal || displaySubtotal || 0)}</strong>
      </div>

      {/* QR + T&C */}
      <div className="bk-inv__bottom-auto">
        <div className="bk-inv__qr-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div className="bk-inv__qr" aria-label={`QR code for booking ${bNumber}`} style={{ border: "2px solid var(--purple-deep)", padding: "10px", borderRadius: "8px", background: "#fff", marginBottom: "8px" }}>
            {qrToken ? (
              <QRCodeSVG  value={qrToken} size={120} bgColor={"#ffffff"} fgColor={"#1a0a2e"}  level={"M"}
                includeMargin={false}
              />
            ) : (
              <div style={{
                width: "120px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f9f6fc",
                color: "#888",
                fontSize: "0.85rem",
                fontWeight: "700",
                textAlign: "center",
                borderRadius: "6px"
              }}>
                QR unavailable
              </div>
            )}
          </div>
          <div className="bk-inv__qr-label">
            Scan at entry<br /><strong style={{ color: "var(--purple-deep)" }}>{bNumber}</strong>
          </div>
        </div>

        <div className="bk-inv__tc" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
          <strong>Terms &amp; Conditions</strong>
          <ul style={{ paddingLeft: "15px", margin: "6px 0 0 0" }}>
            <li>No cancellation/postponement after booking.</li>
            <li>Entry free for children below 90 cm.</li>
            <li>Senior (60+) &amp; students must carry valid ID.</li>
            <li>Birthday offers require original DOB proof at entry.</li>
            <li>This QR code is unique to this transaction and is verified at the gate.</li>
            <li>Official Tax Invoice issued by VGP Universal Kingdom.</li>
          </ul>
        </div>
      </div>

      {/* Action buttons */}
      <div className="bk-inv__actions no-print" style={{ marginTop: "30px", display: "flex", gap: "12px", justifyContent: "center" }}>
        <button className="cta-big cta-red" onClick={handlePrint} style={{ height: "45px", padding: "0 28px" }}>
          🖨 Print / Download PDF
        </button>
      </div>
    </div>
  );
}
