"use client";

import Modal from "@/components/admin/Common/Modal";
import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/DetailsModal.css";

function formatDate(date) {
  if (!date) return "-";

  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function EnquiryDetailsModal({
  isOpen,
  enquiry,
  onClose,
}) {
  if (!enquiry) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enquiry Details"
      size="lg"
    >
      <div className="details-body">

        {/* Enquiry Information */}

        <div className="details-section">

          <h3 className="details-section-title">
            Enquiry Information
          </h3>

          <div className="details-row">
            <span className="details-label">
              Enquiry ID
            </span>

            <span className="details-value-highlight">
              {enquiry.id}
            </span>
          </div>

          {enquiry.type && (
            <div className="details-row">
              <span className="details-label">
                Type
              </span>
              <span className="details-value">
                {enquiry.type}
              </span>
            </div>
          )}

          <div className="details-row">
            <span className="details-label">
              Subject
            </span>

            <span className="details-value">
              {enquiry.subject}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Status
            </span>

            <StatusBadge status={enquiry.status} />
          </div>

          <div className="details-row">
            <span className="details-label">
              Received Date
            </span>

            <span className="details-value">
              {formatDate(enquiry.receivedDate)}
            </span>
          </div>

        </div>

        {/* Customer Information */}

        <div className="details-section">

          <h3 className="details-section-title">
            Customer Information
          </h3>

          <div className="details-row">
            <span className="details-label">
              Name
            </span>

            <span className="details-value">
              {enquiry.name}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Email
            </span>

            <span className="details-value">
              {enquiry.email}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Mobile
            </span>

            <span className="details-value">
              {enquiry.mobile}
            </span>
          </div>

        </div>

        {/* Group Quote Information */}
        {enquiry.type === "Group Quote" && (
          <div className="details-section">
            <h3 className="details-section-title">
              Group Quote Details
            </h3>

            <div className="details-row">
              <span className="details-label">
                Group Size
              </span>
              <span className="details-value">
                {enquiry.groupSize}
              </span>
            </div>

            <div className="details-row">
              <span className="details-label">
                Preferred Date
              </span>
              <span className="details-value">
                {formatDate(enquiry.preferredDate)}
              </span>
            </div>
          </div>
        )}

        {/* Message */}
        {enquiry.message && (
          <div className="details-section">

            <h3 className="details-section-title">
              Message
            </h3>

            <div className="details-row">
              <span
                className="details-value"
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                }}
              >
                {enquiry.message}
              </span>
            </div>

          </div>
        )}

      </div>
    </Modal>
  );
}