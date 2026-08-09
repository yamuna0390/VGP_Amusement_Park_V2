"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="page visible" style={{ padding: "80px 20px", textAlign: "center", background: "var(--cream)", minHeight: "60vh" }}>
        <div className="wrap" style={{ maxWidth: "450px", margin: "auto" }}>
          <h2 style={{ color: "var(--purple-deep)", marginBottom: "16px" }}>Access Denied</h2>
          <p style={{ fontWeight: "700", color: "var(--ink)", marginBottom: "24px" }}>
            Please log in to view and manage your profile details.
          </p>
          <Link href="/" className="cta-big cta-red">
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email, phone }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update profile.");
      }

      // Update local state and context user details
      updateUser(result.data.user);
      setIsEditing(false);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page visible" style={{ padding: "60px 20px", background: "var(--cream)", minHeight: "75vh" }}>
      <div className="wrap" style={{ maxWidth: "600px", margin: "auto" }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "2px solid var(--border)", paddingBottom: "10px" }}>
          <Link href="/profile" style={{ fontWeight: "800", color: "var(--purple-deep)", borderBottom: "3px solid var(--purple-deep)", padding: "8px 16px" }}>
            👤 My Profile
          </Link>
        </div>

        <div className="bk-panel" style={{ padding: "34px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <h2 style={{ color: "var(--purple-deep)", fontSize: "1.75rem", marginBottom: "6px" }}>My Profile</h2>
          <p style={{ fontSize: "0.85rem", color: "#6a5a8a", fontWeight: "600", marginBottom: "24px" }}>
            Manage your registered VGP Amusement Park customer account information below.
          </p>

          {message.text && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "0.85rem",
              marginBottom: "20px",
              backgroundColor: message.type === "success" ? "#e8f5e9" : "#ffebee",
              color: message.type === "success" ? "#2e7d32" : "#c62828",
              border: `1px solid ${message.type === "success" ? "#a5d6a7" : "#ef9a9a"}`
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Full Name (Read-Only) */}
            <div className="bk-field">
              <label className="bk-field__label">Full Name</label>
              <input
                className="bk-field__input"
                type="text"
                value={user.fullName || ""}
                disabled
                style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
              />
              <span style={{ fontSize: "0.75rem", color: "#888", display: "block", marginTop: "4px" }}>
                Name updates require contacting customer support.
              </span>
            </div>

            {/* Email (Editable) */}
            <div className="bk-field">
              <label className="bk-field__label">Email Address <span className="bk-field__req">*</span></label>
              <input
                className="bk-field__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                required
                style={!isEditing ? { backgroundColor: "#f9f9f9", color: "#555" } : {}}
              />
            </div>

            {/* Mobile Phone (Editable) */}
            <div className="bk-field">
              <label className="bk-field__label">Mobile Phone <span className="bk-field__req">*</span></label>
              <input
                className="bk-field__input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                required
                style={!isEditing ? { backgroundColor: "#f9f9f9", color: "#555" } : {}}
              />
            </div>

            {/* Edit / Save Actions */}
            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="cta-big cta-green"
                  style={{ border: "none", width: "100%", padding: "12px" }}
                >
                  ✏️ Edit Profile Info
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEmail(user.email || "");
                      setPhone(user.phone || "");
                      setMessage({ text: "", type: "" });
                    }}
                    className="bk-btn-back"
                    style={{ flex: "1", padding: "12px" }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cta-big cta-red"
                    style={{ flex: "2", border: "none", padding: "12px" }}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "💾 Save Changes"}
                  </button>
                </>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
