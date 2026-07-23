"use client";

import { useState } from "react";
import { login as loginService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ switchToRegister, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Call Backend Login API
      const response = await loginService(formData);

      // Save user & token using AuthContext
      login(
        response.data.user,
        response.data.token
      );

      alert("Login successful!");

      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && (
        <p style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <div className="form-group">
        <label>Email</label>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className="auth-btn"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="forgot-password">
        <button
          type="button"
          className="link-btn"
        >
          Forgot Password?
        </button>
      </div>

      <div className="auth-footer">
        <span>Don't have an account?</span>

        <button
          type="button"
          className="link-btn"
          onClick={switchToRegister}
        >
          Register
        </button>
      </div>
    </form>
  );
}