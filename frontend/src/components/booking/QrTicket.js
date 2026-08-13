"use client";
import { fmt } from "@/utils/bookingCalc";
import { QRCodeSVG } from "qrcode.react";

export default function QrTicket({ booking }) {
  const {
    booking_number,
    bookingNumber,
    visit_date,
    visitDate,
    customer_name,
    customer_mobile,
    offer_name,
    coupon_code,
    visitor_count,
    tickets = [],
    purchaseSummary,
    qr_token,
  } = booking;

  const bNumber = bookingNumber || booking_number;
  const displayDate = visitDate || (visit_date ? new Date(visit_date).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "");
  const guestName = booking.customer?.name || customer_name;
  const guestMobile = booking.customer?.mobile || customer_mobile;

  // Calculate paid and free counts from tickets
  let paidCount = 0;
  let freeCount = 0;

  if (purchaseSummary && purchaseSummary.totalPaidTickets !== undefined) {
    paidCount = purchaseSummary.totalPaidTickets;
    freeCount = purchaseSummary.totalFreeTickets || 0;
  } else if (tickets && tickets.length > 0) {
    let hasCounted = false;
    tickets.forEach(tk => {
      if (tk.paidQuantity !== undefined || tk.freeQuantity !== undefined) {
        paidCount += (tk.paidQuantity || 0);
        freeCount += (tk.freeQuantity || 0);
        hasCounted = true;
      } else {
        // Legacy fallback
        const type = (tk.ticket_type || tk.ticketType || "").toLowerCase();
        const price = Number(tk.unit_price ?? tk.unitPrice ?? 0);
        const itemType = (tk.item_type || tk.itemType || "").toLowerCase();

        if (itemType === "ticket" || type.includes("ticket") || type.includes("pass")) {
          hasCounted = true;
          if (price === 0 || type.includes("free")) {
            freeCount += tk.quantity;
          } else {
            paidCount += tk.quantity;
          }
        }
      }
    });

    if (!hasCounted) {
      paidCount = visitor_count || 1;
      freeCount = 0;
    }
  } else {
    // Fallback if tickets array is empty
    paidCount = visitor_count || 1;
    freeCount = 0;
  }

  const totalVisitors = (purchaseSummary && purchaseSummary.totalVisitors)
    ? purchaseSummary.totalVisitors
    : (paidCount + freeCount);

  return (
    <div className="bk-qr-ticket" style={{
      maxWidth: "500px",
      margin: "0 auto 30px auto",
      background: "#fff",
      border: "2px solid var(--purple-deep)",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      overflow: "hidden",
      fontFamily: "var(--font-geist-sans), sans-serif"
    }}>
      {/* Header stub */}
      <div style={{
        background: "var(--purple-deep)",
        color: "#fff",
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "1px", color: "var(--yellow)" }}>VGP UNIVERSAL KINGDOM</div>
          <div style={{ fontSize: "1.1rem", fontWeight: "900" }}>ENTRY PASS</div>
        </div>
        <div style={{ fontSize: "0.85rem", fontWeight: "800", background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: "6px" }}>
          {bNumber}
        </div>
      </div>

      {/* Ticket Details */}
      <div style={{ padding: "20px 24px", position: "relative" }}>
        
        <div className="qr-detail-grid">
          <div>
            <span style={{ fontSize: "0.65rem", color: "#888", display: "block", fontWeight: "800" }}>GUEST NAME</span>
            <strong style={{ fontSize: "0.95rem", color: "var(--ink)" }}>{guestName}</strong>
          </div>
          <div>
            <span style={{ fontSize: "0.65rem", color: "#888", display: "block", fontWeight: "800" }}>VISIT DATE</span>
            <strong style={{ fontSize: "0.95rem", color: "var(--ink)" }}>{displayDate}</strong>
          </div>
        </div>

        <div className="qr-detail-grid">
          <div>
            <span style={{ fontSize: "0.65rem", color: "#888", display: "block", fontWeight: "800" }}>CONTACT</span>
            <strong style={{ fontSize: "0.95rem", color: "var(--ink)" }}>{guestMobile}</strong>
          </div>
          <div>
            <span style={{ fontSize: "0.65rem", color: "#888", display: "block", fontWeight: "800" }}>TOTAL VISITORS</span>
            <strong style={{ fontSize: "1.1rem", color: "var(--red)" }}>
              👥 {totalVisitors} Guest{totalVisitors !== 1 ? "s" : ""}
            </strong>
          </div>
        </div>

        {/* Paid / Free breakdown */}
        <div style={{
          backgroundColor: "#f9f6fc",
          borderRadius: "8px",
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.8rem",
          fontWeight: "700",
          color: "#555",
          marginBottom: "16px"
        }}>
          <span>🎟 Paid Tickets: {paidCount}</span>
          <span>🎁 Free Tickets: {freeCount}</span>
        </div>

        {/* Promotion banner */}
        {(offer_name || coupon_code) && (
          <div style={{
            borderTop: "1px dashed var(--border)",
            borderBottom: "1px dashed var(--border)",
            padding: "8px 0",
            marginBottom: "20px",
            fontSize: "0.8rem",
            fontWeight: "700",
            color: "var(--purple-deep)",
            textAlign: "center"
          }}>
            PROMOTION APPLIED: {offer_name || coupon_code}
          </div>
        )}

        {/* Tear-off Line */}
        <div style={{
          height: "2px",
          borderTop: "2px dashed #ccc",
          margin: "10px 0 20px 0",
          position: "relative"
        }}>
          {/* Side circular punch holes */}
          <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#f3effa", border: "1.5px solid var(--border)", position: "absolute", left: "-33px", top: "-9px" }} />
          <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#f3effa", border: "1.5px solid var(--border)", position: "absolute", right: "-33px", top: "-9px" }} />
        </div>

        {/* QR Code Section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            border: "1.5px solid var(--purple-deep)",
            padding: "10px",
            borderRadius: "10px",
            background: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.03)"
          }}>
            {qr_token ? (
              <QRCodeSVG 
                value={qr_token} 
                size={140} 
                bgColor={"#ffffff"}
                fgColor={"#1a0a2e"}
                level={"M"}
                includeMargin={false}
              />
            ) : (
              <div style={{
                width: "140px",
                height: "140px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f9f6fc",
                color: "#888",
                fontSize: "0.85rem",
                fontWeight: "700",
                textAlign: "center",
                borderRadius: "8px"
              }}>
                QR unavailable
              </div>
            )}
          </div>
          <span style={{ fontSize: "0.75rem", color: "#666", marginTop: "10px", fontWeight: "700" }}>
            Scan QR code at the turnstile gate
          </span>
        </div>

      </div>

      {/* Footer disclaimer */}
      <div style={{
        backgroundColor: "#fcfaf6",
        borderTop: "1px solid var(--border)",
        padding: "10px 20px",
        fontSize: "0.68rem",
        color: "#777",
        textAlign: "center",
        lineHeight: "1.4"
      }}>
        Only valid for one-time entry on {displayDate} · ID verification card may be requested at the gate.
      </div>
    </div>
  );
}
