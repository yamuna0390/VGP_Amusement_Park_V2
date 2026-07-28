"use client";

import { useState } from "react";
import Link from "next/link";
import "./contact.css";
import { MapPin, Mail, Phone, Building, Users, Headphones, Send, Clock, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Enquiry",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "General Enquiry",
        subject: "",
        message: ""
      });
    }, 1000);
  };

  return (
    <div className="page show" id="page-contact">
      {/* ── 1. Hero Header Banner ── */}
      <div className="hero contact-hero" style={{ padding: "44px 20px 34px", textAlign: "center" }}>
        <h1 className="contact-main-heading">
          CONTACT US
        </h1>
        <p style={{ color: "var(--ink)", fontWeight: 700, fontSize: "1.1rem", marginTop: "12px", maxWidth: "760px", margin: "12px auto 0" }}>
          Get in touch with the VGP Universal Kingdom team. We&apos;re here to help you plan an unforgettable adventure!
        </p>
      </div>

      <div className="zigzag"></div>

      {/* ── 2. Main Content Grid ── */}
      <section style={{ padding: "40px 20px 60px", background: "#F4F5F7" }}>
        <div className="wrap" style={{ maxWidth: "1180px", margin: "0 auto" }}>
          
          <div className="bk-step-grid">
            
            {/* ── Left Column: Contact Cards ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              
              {/* Park Location Card */}
              <div className="bk-panel" style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "24px 26px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                border: "1px solid #E2E8F0"
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "rgba(59, 130, 246, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2563EB",
                    flexShrink: 0
                  }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1E293B", margin: "0 0 6px 0" }}>
                      Park Location &amp; Address
                    </h3>
                    <p style={{ fontSize: "0.92rem", color: "#475569", fontWeight: "600", margin: 0, lineHeight: "1.5" }}>
                      SH 49, Injambakkam, Chennai, Greater Chennai, Tamil Nadu 600115
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer & Technical Support Card */}
              <div className="bk-panel" style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "24px 26px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                border: "1px solid #E2E8F0"
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "rgba(16, 185, 129, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#059669",
                    flexShrink: 0
                  }}>
                    <Phone size={24} />
                  </div>
                  <div style={{ width: "100%" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1E293B", margin: "0 0 8px 0" }}>
                      Phone &amp; Technical Support
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem", color: "#475569", fontWeight: "600" }}>
                      <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center" }}>
                        <span>Customer Support:</span>
                        <a href="tel:+918939700588" style={{ color: "#2563EB", fontWeight: "800", textDecoration: "none" }}>+91 89397 00588</a>
                      </div>
                      <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center" }}>
                        <span>Technical Support:</span>
                        <a href="tel:+919677264779" style={{ color: "#2563EB", fontWeight: "800", textDecoration: "none" }}>+91 96772 64779</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email & Group Enquiries Card */}
              <div className="bk-panel" style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "24px 26px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                border: "1px solid #E2E8F0"
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "rgba(168, 85, 247, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7E22CE",
                    flexShrink: 0
                  }}>
                    <Users size={24} />
                  </div>
                  <div style={{ width: "100%" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1E293B", margin: "0 0 8px 0" }}>
                      Group Enquiries &amp; Email
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem", color: "#475569", fontWeight: "600" }}>
                      <div>
                        <span>General Email: </span>
                        <a href="mailto:info@vgpuniversalkingdom.in" style={{ color: "#2563EB", fontWeight: "800", textDecoration: "none" }}>info@vgpuniversalkingdom.in</a>
                      </div>
                      <div>
                        <span>Group Bookings: </span>
                        <strong style={{ color: "#1E293B" }}>89397 00588</strong> | <a href="mailto:sales@vgpuniversalkingdom.in" style={{ color: "#2563EB", fontWeight: "800", textDecoration: "none" }}>sales@vgpuniversalkingdom.in</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corporate Office Card */}
              <div className="bk-panel" style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "24px 26px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                border: "1px solid #E2E8F0"
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "rgba(245, 158, 11, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D97706",
                    flexShrink: 0
                  }}>
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1E293B", margin: "0 0 6px 0" }}>
                      Corporate Address
                    </h3>
                    <p style={{ fontSize: "0.92rem", color: "#475569", fontWeight: "600", margin: 0, lineHeight: "1.5" }}>
                      VGP Square, No. 6, Dharmaraja Koil Street, Near Saidapet Railway Station, Saidapet, Chennai - 600015, India
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Right Column: Interactive Message Form ── */}
            <div className="bk-panel" style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: "30px 28px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
              border: "1px solid #E2E8F0"
            }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: "900", color: "#1E293B", marginBottom: "6px" }}>
                Send Us a Message
              </h2>
              <p style={{ fontSize: "0.88rem", color: "#64748B", fontWeight: "600", marginBottom: "22px" }}>
                Have a question or feedback? Fill out the form below and our team will get back to you promptly.
              </p>

              {submitted ? (
                <div style={{
                  background: "#ECFDF5",
                  border: "1.5px solid #A7F3D0",
                  borderRadius: "16px",
                  padding: "30px 20px",
                  textAlign: "center"
                }}>
                  <CheckCircle2 size={48} color="#059669" style={{ margin: "0 auto 12px" }} />
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#065F46", margin: "0 0 6px 0" }}>
                    Thank You! Your message has been sent.
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#047857", fontWeight: "600", margin: "0 0 18px 0" }}>
                    Our customer support team will get in touch with you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="cta-big cta-green"
                    style={{ padding: "8px 20px", fontSize: "0.88rem" }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="bk-field">
                    <label className="bk-field__label" style={{ fontWeight: "700", color: "#1E293B", marginBottom: "6px", display: "block", fontSize: "0.88rem" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="bk-field__input"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                    />
                  </div>

                  <div className="contact-inner-grid">
                    <div className="bk-field">
                      <label className="bk-field__label" style={{ fontWeight: "700", color: "#1E293B", marginBottom: "6px", display: "block", fontSize: "0.88rem" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="bk-field__input"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                      />
                    </div>

                    <div className="bk-field">
                      <label className="bk-field__label" style={{ fontWeight: "700", color: "#1E293B", marginBottom: "6px", display: "block", fontSize: "0.88rem" }}>
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="bk-field__input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                      />
                    </div>
                  </div>

                  <div className="bk-field">
                    <label className="bk-field__label" style={{ fontWeight: "700", color: "#1E293B", marginBottom: "6px", display: "block", fontSize: "0.88rem" }}>
                      Query Category
                    </label>
                    <select
                      className="bk-field__input"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", background: "#FFFFFF" }}
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Ticket Booking">Ticket Booking &amp; Passes</option>
                      <option value="Group / School Outing">Group &amp; School Outing</option>
                      <option value="Events & Celebrations">Events &amp; Celebrations</option>
                      <option value="Technical Support">Technical Support</option>
                    </select>
                  </div>

                  <div className="bk-field">
                    <label className="bk-field__label" style={{ fontWeight: "700", color: "#1E293B", marginBottom: "6px", display: "block", fontSize: "0.88rem" }}>
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      className="bk-field__input"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your query or feedback here..."
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontFamily: "inherit" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="cta-big cta-red"
                    disabled={submitting}
                    style={{ width: "100%", marginTop: "6px", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    <Send size={18} />
                    <span>{submitting ? "Sending Message..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* ── 3. Map Location Frame Section ── */}
          <div style={{ marginTop: "32px" }}>
            <div className="bk-panel" style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
              border: "1px solid #E2E8F0"
            }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "900", color: "#1E293B", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin color="#2563EB" size={20} /> Locate VGP Universal Kingdom on Map
              </h3>
              <div style={{ width: "100%", height: "340px", borderRadius: "16px", overflow: "hidden" }}>
                <iframe
                  title="VGP Universal Kingdom Map Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7563539826315!2d80.2483861!3d12.9233634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525cf156cb62ed%3A0x6b8aa107b3b3a6ef!2sVGP%20Universal%20Kingdom!5e0!3m2!1sen!2sin!4v1689200000000!5m2!1sen!2sin"
                />
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
