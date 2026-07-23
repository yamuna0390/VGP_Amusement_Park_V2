"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import "./FilterBar.css";

// Extend this object when Booking Date filtering is added — no other changes needed.
const INITIAL_FILTERS = {
  bookingStatus: "",
  paymentStatus: "",
  visitDateFrom: "",
  visitDateTo: "",
  // Future fields: bookingDateFrom: "", bookingDateTo: ""
};

/**
 * FilterBar — manages its own pending filter state internally.
 * Pushes committed filters to parent only when Apply / Reset is clicked.
 *
 * Props:
 *   onApply {function(filters)} — called with the applied filter object
 *   onReset {function}          — called when all filters are cleared
 */
export default function FilterBar({ onApply, onReset }) {
  const [pending, setPending] = useState(INITIAL_FILTERS);

  function handleChange(field, value) {
    setPending((prev) => ({ ...prev, [field]: value }));
  }

  function handleApply() {
    if (
      pending.visitDateFrom &&
      pending.visitDateTo &&
      pending.visitDateFrom > pending.visitDateTo
    ) {
      alert("'Visit Date From' cannot be later than 'Visit Date To'.");
      return;
    }
    onApply(pending);
  }

  function handleReset() {
    setPending(INITIAL_FILTERS);
    onReset();
  }

  return (
    <div className="filter-bar">

      {/* Booking Status */}
      <div className="filter-group">
        <label className="filter-label">Booking Status</label>
        <select
          className="filter-select"
          value={pending.bookingStatus}
          onChange={(e) => handleChange("bookingStatus", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Payment Status */}
      <div className="filter-group">
        <label className="filter-label">Payment Status</label>
        <select
          className="filter-select"
          value={pending.paymentStatus}
          onChange={(e) => handleChange("paymentStatus", e.target.value)}
        >
          <option value="">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <div className="filter-divider" />

      {/* Visit Date From */}
      <div className="filter-group">
        <label className="filter-label">Visit Date — From</label>
        <input
          type="date"
          className="filter-date"
          value={pending.visitDateFrom}
          onChange={(e) => handleChange("visitDateFrom", e.target.value)}
        />
      </div>

      {/* Visit Date To */}
      <div className="filter-group">
        <label className="filter-label">Visit Date — To</label>
        <input
          type="date"
          className="filter-date"
          value={pending.visitDateTo}
          onChange={(e) => handleChange("visitDateTo", e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="filter-actions">
        <button
          type="button"
          className="filter-apply-btn"
          onClick={handleApply}
        >
          <Check size={15} />
          Apply
        </button>

        <button
          type="button"
          className="filter-reset-btn"
          onClick={handleReset}
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>

    </div>
  );
}
