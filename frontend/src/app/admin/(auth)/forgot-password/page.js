"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { forgotPassword as forgotPasswordService } from "@/services/authService";
import "../login/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await forgotPasswordService(email);
      setMessage(response.message || "If an account exists for this email, a password reset link has been sent.");
    } catch (err) {
      setError(err.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">

        <div className="login-logo">
          <Image
            src="/images/ukdlogo-1.png" 
            alt="VGP Logo"
            width={90}
            height={90}
            priority
          />
        </div>

        <h1>Forgot Password</h1>
        <h2>Admin Portal</h2>

        <p className="login-text">
          Enter your email to receive a password reset link.
        </p>
        
        {message && (
          <div style={{ color: "white", backgroundColor: "#2e7d32", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "0.9rem", textAlign: "center" }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ color: "white", backgroundColor: "#d32f2f", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "0.9rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={150}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: "20px" }}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link href="/admin/login" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>
              Back to Login
            </Link>
          </div>

        </form>

        <p className="copyright" style={{ marginTop: "30px" }}>
          © 2026 VGP Universal Kingdom
        </p>

      </div>
    </div>
  );
}
