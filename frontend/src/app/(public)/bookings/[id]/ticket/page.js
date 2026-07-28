"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QrTicket from "@/components/booking/QrTicket";
import Link from "next/link";

export default function BookingTicketPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
          headers
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load booking details.");
        }

        setBooking(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handlePrint = () => window.print();

  return (
    <main className="page visible" style={{ padding: "60px 20px", background: "var(--cream)", minHeight: "85vh" }}>
      <div className="wrap" style={{ maxWidth: "600px", margin: "auto" }}>
        
        {/* Navigation Breadcrumb */}
        <div className="no-print" style={{ marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/profile/bookings" style={{ color: "var(--purple-deep)", fontWeight: "800", textDecoration: "none" }}>
            ← Back to My Bookings
          </Link>
          <button 
            className="cta-big cta-red" 
            onClick={handlePrint}
            style={{ height: "36px", padding: "0 18px", fontSize: "0.8rem", margin: 0 }}
          >
            🖨 Print Pass
          </button>
        </div>

        {loading ? (
          <div className="bk-panel" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ fontWeight: "800", color: "var(--purple-deep)" }}>Loading entry pass...</p>
          </div>
        ) : error ? (
          <div className="bk-panel" style={{ padding: "40px", textAlign: "center" }}>
            <h3 style={{ color: "var(--red)", marginBottom: "12px" }}>Access Error</h3>
            <p style={{ fontWeight: "600", color: "var(--ink)", marginBottom: "20px" }}>{error}</p>
            <p style={{ fontSize: "0.85rem", color: "#666" }}>
              Note: If this is a guest booking, you must be logged in as an administrator or owner to view this document directly.
            </p>
          </div>
        ) : (
          <div className="print-area">
            <QrTicket booking={booking} />
          </div>
        )}
      </div>
    </main>
  );
}
