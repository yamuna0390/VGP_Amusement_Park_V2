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

export default function BookingDetailsModal({
  isOpen,
  booking,
  onClose,
}) {
  if (!booking) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Booking Details"
      onClose={onClose}
    >
      <div className="details-body">

        {/* Booking Information */}

        <Section title="Booking Information">
          <DetailRow
            label="Booking ID"
            value={booking.id}
            highlight
          />

          <DetailRow
            label="Booking Date"
            value={formatDate(booking.bookingDate)}
          />

          <DetailRow
            label="Visit Date"
            value={formatDate(booking.visitDate)}
          />
        </Section>

        {/* Customer Details */}

        <Section title="Customer Details">
          <DetailRow
            label="Customer Name"
            value={booking.customerName}
          />

          <DetailRow
            label="Mobile"
            value={booking.mobile}
          />

          <DetailRow
            label="Email"
            value={booking.email}
          />
        </Section>

        {/* Ticket Details */}

        <Section title="Ticket Details">
          <DetailRow
            label="Ticket Type"
            value={booking.ticketType}
          />

          <DetailRow
            label="Quantity"
            value={booking.quantity}
          />

          <DetailRow
            label="Price per Ticket"
            value={`₹${booking.price?.toLocaleString("en-IN")}`}
          />

          <DetailRow
            label="Total Amount"
            value={`₹${booking.totalAmount?.toLocaleString("en-IN")}`}
            highlight
          />
        </Section>

        {/* Payment & Status */}

        <Section title="Payment & Status">

          <div className="details-row">
            <span className="details-label">
              Payment Status
            </span>

            <StatusBadge
              status={booking.paymentStatus}
            />
          </div>

          <DetailRow
            label="Transaction ID"
            value={booking.transactionId || "—"}
          />

          <div className="details-row">
            <span className="details-label">
              Booking Status
            </span>

            <StatusBadge
              status={booking.bookingStatus}
            />
          </div>

        </Section>

      </div>
    </Modal>
  );
}