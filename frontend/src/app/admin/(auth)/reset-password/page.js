"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword as resetPasswordService } from "@/services/authService";
import "../login/login.css";

// This is wrapped in a dynamic Suspense boundary in production or just standard in app dir
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPasswordService(token, newPassword);
      setMessage(response.message || "Password has been successfully reset.");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
      
    } catch (err) {
      setError(err.message || "Failed to reset password.");
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

        <h1>Reset Password</h1>
        <h2>Admin Portal</h2>
        
        {message ? (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <div style={{ color: "white", backgroundColor: "#2e7d32", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "0.9rem" }}>
              {message}
            </div>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>Redirecting to login...</p>
            <Link href="/admin/login" style={{ color: "var(--red-vgp)", textDecoration: "none", fontSize: "0.9rem", display: "inline-block", marginTop: "10px" }}>
              Click here if not redirected
            </Link>
          </div>
        ) : (
          <>
            <p className="login-text">
              Enter your new password below.
            </p>

            {error && (
              <div style={{ color: "white", backgroundColor: "#d32f2f", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "0.9rem", textAlign: "center" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>New Password</label>
                <div className="password-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    maxLength={100}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="password-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading || !token} style={{ marginTop: "20px" }}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Link href="/admin/login" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>
                  Back to Login
                </Link>
              </div>

            </form>
          </>
        )}

        <p className="copyright" style={{ marginTop: "30px" }}>
          © 2026 VGP Universal Kingdom
        </p>

      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", color: "white", padding: "50px" }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
