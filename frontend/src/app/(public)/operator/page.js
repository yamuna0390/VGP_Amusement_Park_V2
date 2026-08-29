"use client";

import { useState, Suspense } from "react";
import "./operator.css";
import { 
  ShieldCheck, 
  Bus, 
  Ticket
} from "lucide-react";
import { API_BASE_URL } from "@/constants/api";

function OperatorPortalContent() {
  // Operator Enquiry Form states
  const [operatorName, setOperatorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/operator-enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operator_name: operatorName,
          email,
          phone,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to send your message right now. Please try again.");
      }

      setIsSubmitted(true);
      setOperatorName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Unable to send your message right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page show" id="page-operator" style={{ background: "#F4F5F7", minHeight: "100vh", paddingBottom: "60px" }}>
      
      {/* ── Page Top Header ── */}
      <div className="hero" style={{ padding: "36px 20px 28px", textAlign: "center", background: "linear-gradient(135deg, var(--purple-deep) 0%, #2A103D 100%)", color: "#fff" }}>
        <h1 className="contact-main-heading" style={{ color: "#FDDB00", textShadow: "3px 3px 0 var(--red)" }}>
          TOUR OPERATOR PORTAL
        </h1>
        <p style={{ color: "#E2D6EE", fontWeight: 700, fontSize: "1.05rem", marginTop: "8px", maxWidth: "700px", margin: "8px auto 0" }}>
          Contracted B2B partner login, instant e-ticket issuance, and agent commission management for VGP Universal Kingdom.
        </p>
      </div>

      <div className="zigzag"></div>

      <div className="wrap" style={{ maxWidth: "1200px", margin: "32px auto 0", padding: "0 16px" }}>
        
        {/* ── MAIN 2-COLUMN SPLIT PORTAL VIEW ── */}
        <div className="op-step-grid">
          
          {/* ── LEFT COLUMN: Mascot & Partner Onboarding Graphic ── */}
          <div style={{
            background: "linear-gradient(165deg, #4A216B 0%, #2A103D 100%)",
            borderRadius: "24px",
            padding: "36px 28px",
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(74, 33, 107, 0.2)"
          }}>
            
            {/* Top Brand Name */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ fontSize: "1.5rem" }}>🏰</span>
                <span style={{ fontFamily: "var(--font-roboto-condensed)", fontWeight: "900", fontSize: "1.25rem", letterSpacing: "1px", color: "#FDDB00" }}>
                  VGP UNIVERSAL KINGDOM
                </span>
              </div>

              <span style={{ background: "rgba(253, 219, 0, 0.15)", border: "1px solid rgba(253, 219, 0, 0.4)", color: "#FDDB00", fontSize: "0.75rem", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 12px", borderRadius: "16px" }}>
                B2B Tour Operator Network
              </span>

              <h2 style={{ fontSize: "1.7rem", fontWeight: "900", color: "#FFFFFF", marginTop: "16px", lineHeight: "1.2" }}>
                Grow Your Travel Agency With VGP
              </h2>
              <p style={{ color: "#D4C3E7", fontSize: "0.9rem", fontWeight: "600", marginTop: "8px", lineHeight: "1.5" }}>
                Partner with South India&apos;s premier amusement park. Enjoy exclusive contracted rates, priority group entry, and instant payouts.
              </p>
            </div>

            {/* Mascot & Value Perks Graphic */}
            <div style={{ margin: "24px 0", background: "rgba(255, 255, 255, 0.08)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(10px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#FDDB00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>
                  👩‍💼
                </div>
                <div>
                  <h4 style={{ color: "#FDDB00", fontWeight: "800", margin: 0, fontSize: "0.95rem" }}>
                    Partner Support Desk
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "#E2D6EE", margin: 0, fontWeight: "600" }}>
                    Dedicated 24×7 Operator Line
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.84rem", color: "#FFFFFF", fontWeight: "600" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldCheck size={16} color="#FDDB00" />
                  <span>25% Contracted Discount on Bulk Passes</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Ticket size={16} color="#FDDB00" />
                  <span>Instant E-Ticket Delivery &amp; Barcode Check-in</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Bus size={16} color="#FDDB00" />
                  <span>Free Tour Bus Parking &amp; Driver Meal Pass</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div style={{ fontSize: "0.78rem", color: "#B8A3CE", fontWeight: "600" }}>
              Need instant registration help? Call <strong style={{ color: "#FFF" }}>+91 89397 00588</strong>
            </div>

          </div>

          {/* ── RIGHT COLUMN: Operator Enquiry Form Panel ── */}
          <div className="bk-panel" style={{
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "32px 30px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            border: "1px solid #E2E8F0"
          }}>
            
            <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1E293B", marginBottom: "6px" }}>
              Message from Operator
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#64748B", fontWeight: "600", marginBottom: "24px" }}>
              Send us your enquiry and our team will get back to you.
            </p>

            {isSubmitted ? (
              <div style={{ padding: "20px", background: "#f0fdf4", color: "#166534", borderRadius: "12px", border: "1px solid #bbf7d0", marginTop: "16px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem" }}>Message Sent!</h4>
                <p style={{ margin: 0, lineHeight: "1.5", fontSize: "0.9rem" }}>
                  Thank you for reaching out. We have received your enquiry and our partner support team will contact you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  style={{ marginTop: "16px", background: "none", border: "none", color: "#166534", fontWeight: "800", cursor: "pointer", textDecoration: "underline" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {error && (
                  <div style={{ padding: "12px", background: "#fef2f2", color: "#b91c1c", borderRadius: "8px", border: "1px solid #fecaca", fontSize: "0.9rem", fontWeight: "600" }}>
                    {error}
                  </div>
                )}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#1E293B", marginBottom: "6px" }}>
                    Operator Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Enter operator name"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#1E293B", marginBottom: "6px" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#1E293B", marginBottom: "6px" }}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#1E293B", marginBottom: "6px" }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem", resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cta-big cta-red"
                  style={{ width: "100%", marginTop: "8px", padding: "12px 24px", fontSize: "1rem" }}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default function OperatorPage() {
  return (
    <Suspense fallback={<div style={{ padding: "60px", textAlign: "center", fontWeight: "700" }}>Loading Operator Portal...</div>}>
      <OperatorPortalContent />
    </Suspense>
  );
}
