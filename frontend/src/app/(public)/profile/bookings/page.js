"use client";

import { useAuth } from "@/context/AuthContext";
import "../profile.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BookingsHistoryPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/bookings/my", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load bookings.");
        }

        setBookings(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
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
      <div className="wrap" style={{ maxWidth: "800px", margin: "auto" }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "2px solid var(--border)", paddingBottom: "10px" }}>
          <Link href="/profile" style={{ fontWeight: "800", color: "var(--purple)", padding: "8px 16px" }}>
            👤 My Profile
          </Link>
          <Link href="/profile/bookings" style={{ fontWeight: "800", color: "var(--purple-deep)", borderBottom: "3px solid var(--purple-deep)", padding: "8px 16px" }}>
            🎟️ My Bookings
          </Link>
        </div>

        <div className="bk-panel" style={{ padding: "34px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <h2 style={{ color: "var(--purple-deep)", fontSize: "1.75rem", marginBottom: "6px" }}>My Bookings</h2>
          <p style={{ fontSize: "0.85rem", color: "#6a5a8a", fontWeight: "600", marginBottom: "24px" }}>
            View your ticket purchase history and upcoming visit credentials.
          </p>

          {loading ? (
            <p style={{ fontWeight: "bold", textAlign: "center", padding: "40px" }}>Loading bookings...</p>
          ) : error ? (
            <div className="bk-err" style={{ textAlign: "center", padding: "20px" }}>{error}</div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ fontWeight: "800", color: "var(--ink)", marginBottom: "20px" }}>You have no bookings yet.</p>
              <Link href="/book" className="cta-big cta-red">
                🎟️ Book Tickets Now
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {bookings.map((booking) => (
                <div 
                  key={booking.id}
                  style={{
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", borderBottom: "1px solid #f3effa", paddingBottom: "10px" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>BOOKING NUMBER</span>
                      <strong style={{ color: "var(--purple-deep)", fontSize: "1.1rem" }}>{booking.booking_number}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>VISIT DATE</span>
                      <strong style={{ color: "var(--ink)" }}>{new Date(booking.visit_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>BOOKING STATUS</span>
                      <span 
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "0.72rem",
                          fontWeight: "800",
                          backgroundColor: booking.booking_status === "Confirmed" ? "#e8f5e9" : (booking.booking_status === "Cancelled" ? "#ffebee" : "#e0f7fa"),
                          color: booking.booking_status === "Confirmed" ? "#2e7d32" : (booking.booking_status === "Cancelled" ? "#c62828" : "#00838f")
                        }}
                      >
                        {booking.booking_status || "Confirmed"}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>PAYMENT</span>
                      <span 
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "0.72rem",
                          fontWeight: "800",
                          backgroundColor: booking.payment_status === "Completed" || booking.payment_status === "Paid" ? "#e8f5e9" : "#ffe082",
                          color: booking.payment_status === "Completed" || booking.payment_status === "Paid" ? "#2e7d32" : "#b78103"
                        }}
                      >
                        {booking.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="profile-booking-grid">
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>PROMOTION</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: booking.coupon_code ? "#2e7d32" : "var(--purple-deep)" }}>
                        {booking.offer_name || booking.coupon_code || "None"}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>VISITORS</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: "800" }}>
                        👥 {booking.visitor_count || 1} Guest{booking.visitor_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>GUEST CONTACT</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{booking.customer_mobile}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>TOTAL PAID</span>
                      <strong style={{ color: "var(--red)", fontSize: "1.15rem" }}>₹{booking.grand_total}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
                    <Link 
                      href={`/bookings/${booking.booking_number}`} 
                      target="_blank"
                      style={{
                        padding: "6px 14px",
                        fontSize: "0.75rem",
                        fontWeight: "800",
                        color: "var(--purple-deep)",
                        border: "1.5px solid var(--purple-deep)",
                        borderRadius: "8px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      📄 Download Invoice
                    </Link>
                    <Link 
                      href={`/bookings/${booking.booking_number}/ticket`} 
                      target="_blank"
                      style={{
                        padding: "6px 14px",
                        fontSize: "0.75rem",
                        fontWeight: "800",
                        color: "#fff",
                        backgroundColor: "var(--red)",
                        borderRadius: "8px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      🎟️ Download Ticket
                    </Link>
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
