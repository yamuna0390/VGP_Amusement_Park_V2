"use client";

import Modal from "@/components/admin/Common/Modal";
import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/DetailsModal.css";

/* ─── Helpers ───────────────────────────────────────────────────────────── */

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

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function AttractionDetailsModal({
  isOpen,
  attraction,
  onClose,
}) {
  if (!attraction) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Attraction Details"
      onClose={onClose}
      size="lg"
    >
      <div className="details-body">

        {/* Attraction Information */}

        <Section title="Attraction Information">
          <DetailRow
            label="Attraction ID"
            value={attraction.id}
            highlight
          />

          <DetailRow
            label="Attraction Name"
            value={attraction.name}
          />

          <DetailRow
            label="Category"
            value={attraction.category}
          />

          <DetailRow
            label="Location"
            value={attraction.location}
          />

          <DetailRow
            label="Description"
            value={attraction.description}
          />
        </Section>

        {/* Ride Information */}

        <Section title="Ride Information">
          <DetailRow
            label="Ride Duration"
            value={attraction.duration}
          />

          <DetailRow
            label="Maximum Capacity"
            value={`${attraction.capacity} Persons`}
          />
        </Section>

        {/* Safety Information */}

        <Section title="Safety Information">
          <DetailRow
            label="Minimum Height"
            value={attraction.minHeight}
          />
        </Section>

        {/* Status */}

        <Section title="Status">
          <div className="details-row">
            <span className="details-label">
              Current Status
            </span>

            <StatusBadge
              status={attraction.status}
            />
          </div>

          <DetailRow
            label="Created Date"
            value={formatDate(attraction.createdDate)}
          />
        </Section>

      </div>
    </Modal>
  );
}