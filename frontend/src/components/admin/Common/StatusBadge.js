"use client";

import "./StatusBadge.css";

export default function StatusBadge({ status }) {
  if (!status) return null;

  const statusMap = {
    // Booking
    Confirmed: "status-confirmed",
    Pending: "status-pending",
    Cancelled: "status-cancelled",
    Completed: "status-completed",

    // Payment
    Paid: "status-paid",
    Refunded: "status-refunded",
    Failed: "status-failed",
     "Partially Refunded": "status-partial-refund",
     
    // User
    Active: "status-active",
    Inactive: "status-inactive",
    Blocked: "status-blocked",

    // Event
    Upcoming: "status-upcoming",
    Live: "status-live",
    Ended: "status-ended",

    // Offer
    Scheduled: "status-scheduled",
    Expired: "status-expired",

    // Attractions
    Maintenance: "status-maintenance",

    // Enquiries/contact
New: "status-new",
"In Progress": "status-progress",
Resolved: "status-resolved",
Closed: "status-closed",
    
  };

  return (
    <span
      className={`status-badge ${
        statusMap[status] || "status-inactive"
      }`}
    >
      {status}
    </span>
  );
}