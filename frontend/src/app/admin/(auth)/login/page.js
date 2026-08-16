"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login as loginService } from "@/services/authService";
import { useAdminAuth } from "@/context/AdminAuthContext";
import "./login.css";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginService({ email, password });
      
      if (response && response.data && response.data.user && response.data.token) {
        if (response.data.user.role !== 'admin') {
          throw new Error("Access Denied: Admin privileges required.");
        }
        
        login(response.data.user, response.data.token);
        router.push("/admin/bookings");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      setError(err.message || "Failed to log in.");
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

        <h1>VGP Universal Kingdom</h1>
        <h2>Admin Portal</h2>

        <p className="login-text">
          Sign in to access the dashboard
        </p>
        
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
            />
          </div>

          <div className="form-group">

            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Password</span>
              <Link href="/admin/forgot-password" style={{ fontSize: "0.85rem", color: "var(--red-vgp)", textDecoration: "none" }}>
                Forgot Password?
              </Link>
            </label>

            <div className="password-box">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <div className="remember-row">

            <label className="remember">

              <input type="checkbox" />

              Remember Me

            </label>

          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="copyright">
          © 2026 VGP Universal Kingdom
        </p>

      </div>
    </div>
  );
}