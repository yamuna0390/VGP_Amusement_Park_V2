"use client";

import { useAuth } from "@/context/AuthContext";

export default function CustomerForm({ customer, onChange, errors }) {
  const { user } = useAuth();
  const isDisabled = !!user;

  const field = (key, label, type = "text", placeholder = "") => (
    <div className="bk-field">
      <label className="bk-field__label" htmlFor={`cf-${key}`}>
        {label} <span className="bk-field__req">*</span>
      </label>
      <input
        id={`cf-${key}`}
        className={`bk-field__input ${errors?.[key] ? "bk-field__input--err" : ""}`}
        type={type}
        placeholder={placeholder}
        value={customer[key] || ""}
        onChange={(e) => onChange(key, e.target.value)}
        disabled={isDisabled}
        autoComplete={
          key === "name" ? "name" :
          key === "email" ? "email" :
          key === "mobile" ? "tel" : "off"
        }
      />
      {errors?.[key] && (
        <span className="bk-field__error" role="alert">{errors[key]}</span>
      )}
    </div>
  );

  return (
    <div className="bk-cust">
      <h3 className="bk-cust__title">Customer Details</h3>
      <div className="bk-cust__grid">
        {field("name",   "Name",           "text",  "Your full name")}
        {field("email",  "Email",          "email", "you@example.com")}
        {field("mobile", "Mobile Number",  "tel",   "+91 98xxxxxxxx")}
      </div>
      {isDisabled && (
        <p className="bk-cust__note" style={{ color: "var(--purple)", fontWeight: "bold", fontSize: "0.85rem", marginTop: "12px" }}>
          Booking will be created using your registered account.
        </p>
      )}
    </div>
  );
}
