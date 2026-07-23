"use client";

import Modal from "@/components/admin/Common/Modal";
import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/DetailsModal.css";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return "—";

  const d = new Date(dateStr + "T00:00:00");

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="details-row">
      <span className="details-label">{label}</span>

      <span
        className={`details-value ${
          highlight ? "details-value-highlight" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="details-section">
      <p className="details-section-title">{title}</p>
      {children}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function UserDetailsModal({
  isOpen,
  user,
  onClose,
}) {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="User Details"
      onClose={onClose}
      size="lg"
    >
      <div className="details-body">

        {/* User Information */}

        <Section title="User Information">
          <DetailRow
            label="User ID"
            value={user.id}
            highlight
          />

          <DetailRow
            label="Customer Name"
            value={user.name}
          />

          <DetailRow
            label="Mobile"
            value={user.mobile}
          />

          <DetailRow
            label="Email"
            value={user.email}
          />
        </Section>

        {/* Personal Information */}

        <Section title="Personal Information">
          <DetailRow
            label="Gender"
            value={user.gender}
          />

          <DetailRow
            label="Date of Birth"
            value={formatDate(user.dob)}
          />

          <DetailRow
            label="City"
            value={user.city}
          />

          <DetailRow
            label="State"
            value={user.state}
          />

          <DetailRow
            label="Registered Date"
            value={formatDate(user.registeredDate)}
          />
        </Section>

        {/* Booking Summary */}

        <Section title="Booking Summary">
          <DetailRow
            label="Total Bookings"
            value={user.totalBookings}
          />

          <DetailRow
            label="Completed Bookings"
            value={user.completedBookings}
          />

          <DetailRow
            label="Cancelled Bookings"
            value={user.cancelledBookings}
          />

          <DetailRow
            label="Total Amount Spent"
            value={`₹${user.totalSpent.toLocaleString("en-IN")}`}
            highlight
          />

          <DetailRow
            label="Last Visit"
            value={formatDate(user.lastVisit)}
          />
        </Section>

        {/* Account Status */}

        <Section title="Account Status">
          <div className="details-row">
            <span className="details-label">
              Status
            </span>

            <StatusBadge status={user.status} />
          </div>
        </Section>

      </div>
    </Modal>
  );
}