"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import "./operator.css";
import { 
  User, 
  Building2, 
  Building, 
  CreditCard, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Bus, 
  Percent, 
  Ticket, 
  ChevronRight,
  Sparkles,
  Lock
} from "lucide-react";

function OperatorPortalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mode: "login" | "register" | "dashboard"
  const initialMode = searchParams.get("tab") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (searchParams.get("tab") === "register") {
      setMode("register");
    }
  }, [searchParams]);

  // Stepper state for Registration: 1 = Personal, 2 = Agency, 3 = Bank
  const [regStep, setRegStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: "John Doe",
    username: "john123",
    password: "",
    confirmPassword: "",
    mobile: "812969XXXX",
    altMobile: "812969XXXX",
    telephone: "044 2545XXXX",
    dob: "1990-05-15",
    email: "john.doe@email.com",
    altEmail: ""
  });

  const [agencyInfo, setAgencyInfo] = useState({
    agencyName: "Royal South Travels Pvt Ltd",
    gstNumber: "33AAAAA0000A1Z5",
    licenseNo: "TN-TOUR-2024-889",
    entityType: "Private Limited",
    address: "No. 45, Anna Salai, Guindy",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600032",
    annualVolume: "2000-5000"
  });

  const [bankInfo, setBankInfo] = useState({
    accountHolder: "Royal South Travels Pvt Ltd",
    bankName: "HDFC Bank",
    accountNumber: "50100239481023",
    confirmAccountNumber: "50100239481023",
    ifscCode: "HDFC0001234",
    branch: "Anna Salai Branch",
    agreedToTerms: true
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    operatorCode: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (regStep < 3) {
      setRegStep(regStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Final Submit
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
        setIsLoggedIn(true);
      }, 1200);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsLoggedIn(true);
    }, 1000);
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
        
        {isLoggedIn ? (
          /* ── LOGGED IN OPERATOR DASHBOARD VIEW ── */
          <div className="bk-panel" style={{ background: "#FFFFFF", borderRadius: "24px", padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #F1F5F9", paddingBottom: "20px", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <span style={{ background: "#DCFCE7", color: "#166534", fontWeight: "800", fontSize: "0.78rem", padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase" }}>
                  ✓ Active B2B Partner
                </span>
                <h2 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#1E293B", margin: "8px 0 20px" }}>
                  Welcome, {agencyInfo.agencyName || personalInfo.name}!
                </h2>
                <p style={{ fontSize: "0.88rem", color: "#64748B", fontWeight: "600", margin: 0 }}>
                  Operator ID: <strong style={{ color: "#1E293B" }}>UKD-OP-2026</strong> | Tier 1 Contracted Rates (25% Off)
                </p>
              </div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="bk-btn-back"
                style={{ margin: 0, padding: "8px 20px" }}
              >
                Logout
              </button>
            </div>

            {/* Quick Action Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "30px" }}>
              
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "18px", padding: "22px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(37, 99, 235, 0.1)", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  <Ticket size={22} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1E293B", marginBottom: "6px" }}>Book Operator Tickets</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: "600", marginBottom: "16px" }}>
                  Book individual or small-group passes at contracted operator rates.
                </p>
              </div>

              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "18px", padding: "22px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  <Percent size={22} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1E293B", marginBottom: "6px" }}>Commission &amp; Payouts</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: "600", marginBottom: "16px" }}>
                  View earned monthly commissions and download tax invoices.
                </p>
                <button className="pill" style={{ padding: "6px 16px", fontSize: "0.85rem" }}>
                  View Statement 📄
                </button>
              </div>

              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "18px", padding: "22px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.1)", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  <Bus size={22} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1E293B", marginBottom: "6px" }}>Bus Parking Voucher</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: "600", marginBottom: "16px" }}>
                  Request complimentary priority bus parking pass for tour groups.
                </p>
                <button className="pill" style={{ padding: "6px 16px", fontSize: "0.85rem" }}>
                  Generate Bus Pass 🚌
                </button>
              </div>

            </div>
          </div>
        ) : (
          /* ── MAIN 2-COLUMN SPLIT PORTAL VIEW (MATCHING SCREENSHOT) ── */
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

            {/* ── RIGHT COLUMN: Registration / Login Form Panel (Wonderla Layout) ── */}
            <div className="bk-panel" style={{
              background: "#FFFFFF",
              borderRadius: "24px",
              padding: "32px 30px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              border: "1px solid #E2E8F0"
            }}>
              
              {/* Mode Switcher Tabs */}
              <div style={{ display: "flex", background: "#F1F5F9", borderRadius: "16px", padding: "4px", marginBottom: "24px" }}>
                <button
                  onClick={() => setMode("register")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: "800",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    background: mode === "register" ? "#FFFFFF" : "transparent",
                    color: mode === "register" ? "var(--purple-deep)" : "#64748B",
                    boxShadow: mode === "register" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                    transition: "0.2s"
                  }}
                >
                  📝 Agency Registration
                </button>

                <button
                  onClick={() => setMode("login")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: "800",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    background: mode === "login" ? "#FFFFFF" : "transparent",
                    color: mode === "login" ? "var(--purple-deep)" : "#64748B",
                    boxShadow: mode === "login" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                    transition: "0.2s"
                  }}
                >
                  🔑 Operator Login
                </button>
              </div>

              {mode === "register" ? (
                /* ── REGISTRATION FORM WITH 3-STEP STEPPER (MATCHING SCREENSHOT) ── */
                <div>
                  
                  {/* Stepper Header (Personal Details > Agency Details > Bank Details) */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
                    
                    {/* Step 1 Pill */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      background: regStep === 1 ? "var(--purple-deep)" : regStep > 1 ? "#DCFCE7" : "#F1F5F9",
                      color: regStep === 1 ? "#FFFFFF" : regStep > 1 ? "#166534" : "#64748B",
                      fontWeight: "800",
                      fontSize: "0.82rem"
                    }}>
                      <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: regStep === 1 ? "rgba(255,255,255,0.2)" : regStep > 1 ? "#166534" : "rgba(0,0,0,0.1)",
                        color: "#FFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem"
                      }}>
                        {regStep > 1 ? "✓" : "1"}
                      </div>
                      <span>Personal Details</span>
                    </div>

                    <ChevronRight size={16} color="#94A3B8" />

                    {/* Step 2 Pill */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      background: regStep === 2 ? "var(--purple-deep)" : regStep > 2 ? "#DCFCE7" : "#F1F5F9",
                      color: regStep === 2 ? "#FFFFFF" : regStep > 2 ? "#166534" : "#64748B",
                      fontWeight: "800",
                      fontSize: "0.82rem"
                    }}>
                      <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: regStep === 2 ? "rgba(255,255,255,0.2)" : regStep > 2 ? "#166534" : "rgba(0,0,0,0.1)",
                        color: "#FFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem"
                      }}>
                        {regStep > 2 ? "✓" : "2"}
                      </div>
                      <span>Agency Details</span>
                    </div>

                    <ChevronRight size={16} color="#94A3B8" />

                    {/* Step 3 Pill */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      background: regStep === 3 ? "var(--purple-deep)" : "#F1F5F9",
                      color: regStep === 3 ? "#FFFFFF" : "#64748B",
                      fontWeight: "800",
                      fontSize: "0.82rem"
                    }}>
                      <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: regStep === 3 ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                        color: "#FFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem"
                      }}>
                        3
                      </div>
                      <span>Bank Details</span>
                    </div>

                  </div>

                  <form onSubmit={handleNextStep}>
                    
                    {/* ── STEP 1: PERSONAL INFORMATION ── */}
                    {regStep === 1 && (
                      <div>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#1E293B", marginBottom: "20px" }}>
                          Personal Information
                        </h3>

                        <div className="op-field-grid-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={personalInfo.name}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                              placeholder="johndoe"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Username *
                            </label>
                            <input
                              type="text"
                              required
                              value={personalInfo.username}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, username: e.target.value })}
                              placeholder="john123"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>
                        </div>

                        <div className="op-field-grid-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Password *
                            </label>
                            <div style={{ position: "relative" }}>
                              <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={personalInfo.password}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, password: e.target.value })}
                                placeholder="••••••••"
                                style={{ width: "100%", padding: "10px 38px 10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
                              >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Confirm Password *
                            </label>
                            <div style={{ position: "relative" }}>
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={personalInfo.confirmPassword}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                style={{ width: "100%", padding: "10px 38px 10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
                              >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="op-field-grid-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Mobile *
                            </label>
                            <div style={{ display: "flex" }}>
                              <span style={{ padding: "10px 12px", background: "#F1F5F9", border: "1px solid #CBD5E1", borderRight: "none", borderRadius: "10px 0 0 10px", fontSize: "0.88rem", fontWeight: "700", color: "#475569" }}>
                                +91
                              </span>
                              <input
                                type="tel"
                                required
                                value={personalInfo.mobile}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, mobile: e.target.value })}
                                placeholder="8129 69XX XX"
                                style={{ width: "100%", padding: "10px 14px", borderRadius: "0 10px 10px 0", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Alternate Mobile
                            </label>
                            <div style={{ display: "flex" }}>
                              <span style={{ padding: "10px 12px", background: "#F1F5F9", border: "1px solid #CBD5E1", borderRight: "none", borderRadius: "10px 0 0 10px", fontSize: "0.88rem", fontWeight: "700", color: "#475569" }}>
                                +91
                              </span>
                              <input
                                type="tel"
                                value={personalInfo.altMobile}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, altMobile: e.target.value })}
                                placeholder="8129 69XX XX"
                                style={{ width: "100%", padding: "10px 14px", borderRadius: "0 10px 10px 0", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="op-field-grid-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Telephone
                            </label>
                            <input
                              type="text"
                              value={personalInfo.telephone}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, telephone: e.target.value })}
                              placeholder="0484 2545XX"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              value={personalInfo.dob}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>
                        </div>

                        <div className="op-field-grid-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Email *
                            </label>
                            <input
                              type="email"
                              required
                              value={personalInfo.email}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                              placeholder="john.doe@email.com"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Alternate Email
                            </label>
                            <input
                              type="email"
                              value={personalInfo.altEmail}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, altEmail: e.target.value })}
                              placeholder="john.doe@email.com"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 2: AGENCY DETAILS ── */}
                    {regStep === 2 && (
                      <div>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#1E293B", marginBottom: "20px" }}>
                          Agency Information
                        </h3>

                        <div className="op-field-grid-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Agency / Company Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={agencyInfo.agencyName}
                              onChange={(e) => setAgencyInfo({ ...agencyInfo, agencyName: e.target.value })}
                              placeholder="Royal South Travels"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              GSTIN / License Number *
                            </label>
                            <input
                              type="text"
                              required
                              value={agencyInfo.gstNumber}
                              onChange={(e) => setAgencyInfo({ ...agencyInfo, gstNumber: e.target.value })}
                              placeholder="33AAAAA0000A1Z5"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>
                        </div>

                        <div className="op-field-grid-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Business Entity Type
                            </label>
                            <select
                              value={agencyInfo.entityType}
                              onChange={(e) => setAgencyInfo({ ...agencyInfo, entityType: e.target.value })}
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "#FFF" }}
                            >
                              <option value="Private Limited">Private Limited</option>
                              <option value="Proprietorship">Proprietorship</option>
                              <option value="Partnership">Partnership</option>
                              <option value="Authorized Travel Agent">Authorized Travel Agent</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Expected Annual Guest Volume
                            </label>
                            <select
                              value={agencyInfo.annualVolume}
                              onChange={(e) => setAgencyInfo({ ...agencyInfo, annualVolume: e.target.value })}
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "#FFF" }}
                            >
                              <option value="500-1000">500 – 1,000 Visitors / year</option>
                              <option value="2000-5000">2,000 – 5,000 Visitors / year</option>
                              <option value="5000-10000">5,000 – 10,000 Visitors / year</option>
                              <option value="10000+">10,000+ Major Operator</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                            Office Address *
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={agencyInfo.address}
                            onChange={(e) => setAgencyInfo({ ...agencyInfo, address: e.target.value })}
                            placeholder="Full registered agency address..."
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                          />
                        </div>

                        <div className="op-field-grid-3">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              City *
                            </label>
                            <input
                              type="text"
                              required
                              value={agencyInfo.city}
                              onChange={(e) => setAgencyInfo({ ...agencyInfo, city: e.target.value })}
                              placeholder="Chennai"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              State *
                            </label>
                            <input
                              type="text"
                              required
                              value={agencyInfo.state}
                              onChange={(e) => setAgencyInfo({ ...agencyInfo, state: e.target.value })}
                              placeholder="Tamil Nadu"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Pincode *
                            </label>
                            <input
                              type="text"
                              required
                              value={agencyInfo.pincode}
                              onChange={(e) => setAgencyInfo({ ...agencyInfo, pincode: e.target.value })}
                              placeholder="600032"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 3: BANK DETAILS & KYC ── */}
                    {regStep === 3 && (
                      <div>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#1E293B", marginBottom: "20px" }}>
                          Bank &amp; KYC Verification
                        </h3>

                        <div className="op-field-grid-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Account Holder Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={bankInfo.accountHolder}
                              onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
                              placeholder="Royal South Travels"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Bank Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={bankInfo.bankName}
                              onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                              placeholder="HDFC Bank"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>
                        </div>

                        <div className="op-field-grid-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Account Number *
                            </label>
                            <input
                              type="password"
                              required
                              value={bankInfo.accountNumber}
                              onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                              placeholder="5010023XXXXX"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Confirm Account Number *
                            </label>
                            <input
                              type="text"
                              required
                              value={bankInfo.confirmAccountNumber}
                              onChange={(e) => setBankInfo({ ...bankInfo, confirmAccountNumber: e.target.value })}
                              placeholder="5010023XXXXX"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>
                        </div>

                        <div className="op-field-grid-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              IFSC Code *
                            </label>
                            <input
                              type="text"
                              required
                              value={bankInfo.ifscCode}
                              onChange={(e) => setBankInfo({ ...bankInfo, ifscCode: e.target.value })}
                              placeholder="HDFC0001234"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                              Branch Name
                            </label>
                            <input
                              type="text"
                              value={bankInfo.branch}
                              onChange={(e) => setBankInfo({ ...bankInfo, branch: e.target.value })}
                              placeholder="Anna Salai Branch"
                              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                          <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={bankInfo.agreedToTerms}
                              onChange={(e) => setBankInfo({ ...bankInfo, agreedToTerms: e.target.checked })}
                              style={{ marginTop: "3px" }}
                            />
                            <span style={{ fontSize: "0.85rem", color: "#475569", fontWeight: "600" }}>
                              I agree to the VGP Universal Kingdom B2B Partner Terms, privacy rules, and commission payout terms.
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Stepper Navigation Buttons (Matching Screenshot) */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "18px", borderTop: "1px solid #F1F5F9" }}>
                      
                      <button
                        type="button"
                        disabled={regStep === 1}
                        onClick={() => setRegStep(regStep - 1)}
                        style={{
                          padding: "10px 24px",
                          borderRadius: "10px",
                          border: "1px solid #CBD5E1",
                          background: regStep === 1 ? "#F8FAFC" : "#FFFFFF",
                          color: regStep === 1 ? "#94A3B8" : "#475569",
                          fontWeight: "800",
                          fontSize: "0.88rem",
                          cursor: regStep === 1 ? "not-allowed" : "pointer"
                        }}
                      >
                        ← Previous
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          padding: "10px 28px",
                          borderRadius: "10px",
                          border: "none",
                          background: "#FDDB00",
                          color: "#1E293B",
                          fontWeight: "900",
                          fontSize: "0.92rem",
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(253, 219, 0, 0.3)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <span>{submitting ? "Submitting..." : regStep === 3 ? "Submit Registration 🚀" : "Next →"}</span>
                      </button>

                    </div>

                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        style={{ background: "none", border: "none", color: "#D97706", fontWeight: "800", fontSize: "0.88rem", cursor: "pointer" }}
                      >
                        ‹ Back to login
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                /* ── OPERATOR LOGIN FORM VIEW ── */
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1E293B", marginBottom: "6px" }}>
                    Operator Login
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "#64748B", fontWeight: "600", marginBottom: "24px" }}>
                    Access your agency dashboard to book passes at contracted rates.
                  </p>

                  <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#1E293B", marginBottom: "6px" }}>
                        Operator ID / Registered Email *
                      </label>
                      <input
                        type="text"
                        required
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        placeholder="e.g. UKD-OP-1234 or email@agency.com"
                        style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#1E293B", marginBottom: "6px" }}>
                        Password *
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="••••••••"
                          style={{ width: "100%", padding: "12px 40px 12px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="cta-big cta-red"
                      style={{ width: "100%", marginTop: "8px", padding: "12px 24px", fontSize: "1rem" }}
                    >
                      {submitting ? "Authenticating..." : "Login to Operator Portal 🔑"}
                    </button>
                  </form>

                  <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #F1F5F9" }}>
                    <p style={{ fontSize: "0.88rem", color: "#64748B", fontWeight: "600" }}>
                      New tour operator?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("register")}
                        style={{ background: "none", border: "none", color: "#2563EB", fontWeight: "800", cursor: "pointer", textDecoration: "underline" }}
                      >
                        Register your agency
                      </button>
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

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
