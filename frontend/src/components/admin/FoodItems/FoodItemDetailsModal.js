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

export default function FoodItemDetailsModal({
  isOpen,
  foodItem,
  onClose,
}) {
  if (!foodItem) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Food Item Details"
      onClose={onClose}
      size="lg"
    >
      <div className="details-body">

        {/* Food Information */}

        <Section title="Food Information">
          <DetailRow
            label="Food ID"
            value={foodItem.id}
            highlight
          />

          <DetailRow
            label="Food Name"
            value={foodItem.name}
          />

          <DetailRow
            label="Category"
            value={foodItem.category}
          />

          <DetailRow
            label="Description"
            value={foodItem.description}
          />
        </Section>

        {/* Pricing */}

        <Section title="Pricing">
          <DetailRow
            label="Price"
            value={`₹${foodItem.price.toLocaleString("en-IN")}`}
            highlight
          />
        </Section>

        {/* Availability */}

        <Section title="Availability">
          <DetailRow
            label="Food Type"
            value={foodItem.type}
          />

          <DetailRow
            label="Availability"
            value={foodItem.availability}
          />
        </Section>

        {/* Status */}

        <Section title="Status">

          <div className="details-row">
            <span className="details-label">
              Current Status
            </span>

            <StatusBadge status={foodItem.status} />
          </div>

          <DetailRow
            label="Created Date"
            value={formatDate(foodItem.createdDate)}
          />

        </Section>

      </div>
    </Modal>
  );
}