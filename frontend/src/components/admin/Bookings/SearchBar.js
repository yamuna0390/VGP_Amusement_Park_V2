"use client";

import { Search, X } from "lucide-react";
import "./SearchBar.css";

/**
 * SearchBar — Reusable search input with clear button.
 * Props:
 *   value    {string}   — controlled input value
 *   onChange {function} — called with new string value on every keystroke
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar-wrapper">
      <Search size={18} className="search-icon" />

      <input
        type="text"
        className="search-input"
        placeholder="Search by Booking ID, Customer Name, Mobile or Email…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <button
          className="search-clear-btn"
          onClick={() => onChange("")}
          title="Clear search"
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
