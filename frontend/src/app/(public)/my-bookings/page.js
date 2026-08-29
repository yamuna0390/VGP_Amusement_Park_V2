"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/constants/api";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState("");

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setBookingError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/booking/my-bookings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to load bookings.");
      setBookings(result.data || []);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="page visible" style={{ padding: "80px 20px", textAlign: "center", background: "var(--cream)", minHeight: "60vh" }}>
        <div className="wrap" style={{ maxWidth: "450px", margin: "auto" }}>
          <h2 style={{ color: "var(--purple-deep)", marginBottom: "16px" }}>Access Denied</h2>
          <p style={{ fontWeight: "700", color: "var(--ink)", marginBottom: "24px" }}>
            Please log in to view your bookings.
          </p>
          <Link href="/" className="cta-big cta-red">
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page visible" style={{ padding: "60px 20px", background: "var(--cream)", minHeight: "75vh" }}>
      <div className="wrap" style={{ maxWidth: "600px", margin: "auto" }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "2px solid var(--border)", paddingBottom: "10px" }}>
          <Link href="/profile" style={{ fontWeight: "800", color: "var(--ink)", padding: "8px 16px", opacity: 0.6 }}>
            👤 My Profile
          </Link>
          <Link href="/my-bookings" style={{ fontWeight: "800", color: "var(--purple-deep)", borderBottom: "3px solid var(--purple-deep)", padding: "8px 16px" }}>
            🎟️ My Bookings
          </Link>
        </div>

        <div>
          <h2 style={{ color: "var(--purple-deep)", fontSize: "1.75rem", marginBottom: "6px" }}>My Bookings</h2>
          <p style={{ fontSize: "0.85rem", color: "#6a5a8a", fontWeight: "600", marginBottom: "30px" }}>
            View your upcoming and previous VGP Universal Kingdom bookings.
          </p>

          {loadingBookings ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6a5a8a", fontWeight: "600" }}>
              Loading your bookings...
            </div>
          ) : bookingError ? (
            <div style={{ padding: "30px", background: "#ffebee", color: "#c62828", borderRadius: "12px", textAlign: "center" }}>
              <p style={{ fontWeight: "700", marginBottom: "16px" }}>Unable to load your bookings.</p>
              <button onClick={fetchBookings} className="bk-btn-back" style={{ margin: "0 auto" }}>TRY AGAIN</button>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ padding: "50px 30px", background: "#fff", borderRadius: "16px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
              <h3 style={{ color: "var(--purple-deep)", marginBottom: "12px" }}>No bookings yet</h3>
              <p style={{ color: "#6a5a8a", marginBottom: "24px", fontWeight: "500" }}>You haven&apos;t made any bookings with VGP Universal Kingdom yet.</p>
              <Link href="/book" className="cta-big cta-red" style={{ display: "inline-block" }}>
                BOOK NOW
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {bookings.map((booking) => (
                <div key={booking.id} style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  border: "1px solid #f1f5f9"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "16px" }}>
                    <div>
                      <span style={{ fontSize: "1.15rem", fontWeight: "900", color: "var(--purple-deep)", display: "block", marginBottom: "4px" }}>
                        {booking.booking_number}
                      </span>
                    </div>
                    <div>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: "800",
                        backgroundColor: booking.booking_status === "CONFIRMED" ? "#ecfdf5" : "#f1f5f9",
                        color: booking.booking_status === "CONFIRMED" ? "#059669" : "#475569",
                        border: `1px solid ${booking.booking_status === "CONFIRMED" ? "#10b981" : "#cbd5e1"}`
                      }}>
                        {booking.booking_status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase" }}>Visit Date</div>
                      <div style={{ fontWeight: "700", color: "#1E293B" }}>
                        {new Date(booking.visit_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase" }}>Booking Date</div>
                      <div style={{ fontWeight: "700", color: "#1E293B" }}>
                        {new Date(booking.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase" }}>Tickets</div>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {booking.items.map((item, idx) => (
                        <li key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.95rem", fontWeight: "600", color: "#334155" }}>
                          <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{item.item_name} × {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "16px", marginBottom: "24px" }}>
                    <span style={{ fontWeight: "800", color: "#1E293B" }}>Total Amount</span>
                    <span style={{ fontWeight: "900", color: "#1E293B", fontSize: "1.1rem" }}>₹{booking.grand_total}</span>
                  </div>

                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <button onClick={() => alert(`Booking ID: ${booking.booking_number}\nStatus: ${booking.booking_status}\nTotal: ₹${booking.grand_total}`)} className="bk-btn-back" style={{ padding: "10px 20px", fontSize: "0.85rem", flex: "1 1 auto" }}>
                      👁 VIEW DETAILS
                    </button>
                    
                    {booking.booking_status === "CONFIRMED" && booking.payment_status === "SUCCESS" && (
                      <a 
                        href={`${API_BASE_URL}/booking/my-bookings/${booking.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-big cta-red" 
                        style={{ padding: "10px 20px", fontSize: "0.85rem", textDecoration: "none", textAlign: "center", flex: "1 1 auto" }}
                      >
                        📄 DOWNLOAD E-TICKET
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
