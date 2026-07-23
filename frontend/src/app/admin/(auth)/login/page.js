"use client";

import { useState } from "react";
import Image from "next/image";
import "./login.css";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

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

        <form>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">

            <label>Password</label>

            <div className="password-box">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <button className="login-btn">
            Sign In
          </button>

        </form>

        <p className="copyright">
          © 2026 VGP Universal Kingdom
        </p>

      </div>
    </div>
  );
}