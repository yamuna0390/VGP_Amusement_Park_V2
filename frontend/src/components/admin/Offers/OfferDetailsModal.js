"use client";

import Modal from "@/components/admin/Common/Modal";
import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/DetailsModal.css";

function getOfferStatus(offer) {
  if (!offer.enabled) return "Inactive";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(offer.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(offer.endDate);
  end.setHours(23, 59, 59, 999);

  if (today < start) return "Scheduled";
  if (today > end) return "Expired";

  return "Active";
}

function formatPrice(price) {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function OfferDetailsModal({
  isOpen,
  offer,
  onClose,
}) {
  if (!offer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Offer Details"
      size="lg"
    >
      <div className="details-body">

        {/* Offer Information */}

        <div className="details-section">

          <h3 className="details-section-title">
            Offer Information
          </h3>

          <div className="details-row">
            <span className="details-label">
              Offer ID
            </span>
            <span className="details-value-highlight">
              {offer.id}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Offer Name
            </span>
            <span className="details-value">
              {offer.name}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Offer Code
            </span>
            <span className="details-value">
              {offer.code}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Offer Type
            </span>
            <span className="details-value">
              {offer.type}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Description
            </span>
            <span className="details-value">
              {offer.description}
            </span>
          </div>

        </div>

        {/* Pricing */}

        <div className="details-section">

          <h3 className="details-section-title">
            Pricing
          </h3>

          <div className="details-row">
            <span className="details-label">
              Adult Price
            </span>
            <span className="details-value">
              {formatPrice(offer.adultPrice)}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Adult Saving
            </span>
            <span className="details-value">
              {formatPrice(offer.adultSaving)}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Child Price
            </span>
            <span className="details-value">
              {formatPrice(offer.childPrice)}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Child Saving
            </span>
            <span className="details-value">
              {formatPrice(offer.childSaving)}
            </span>
          </div>

        </div>

        {/* Validity */}

        <div className="details-section">

          <h3 className="details-section-title">
            Validity
          </h3>

          <div className="details-row">
            <span className="details-label">
              Validity Type
            </span>
            <span className="details-value">
              {offer.validityType}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Duration
            </span>
            <span className="details-value">
              {offer.duration}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Start Date
            </span>
            <span className="details-value">
              {formatDate(offer.startDate)}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              End Date
            </span>
            <span className="details-value">
              {formatDate(offer.endDate)}
            </span>
          </div>

        </div>

        {/* Status */}

        <div className="details-section">

          <h3 className="details-section-title">
            Status
          </h3>

          <div className="details-row">
            <span className="details-label">
              Current Status
            </span>

            <StatusBadge
              status={getOfferStatus(offer)}
            />
          </div>

          <div className="details-row">
            <span className="details-label">
              Created Date
            </span>

            <span className="details-value">
              {formatDate(offer.createdDate)}
            </span>
          </div>

        </div>

      </div>
    </Modal>
  );
}