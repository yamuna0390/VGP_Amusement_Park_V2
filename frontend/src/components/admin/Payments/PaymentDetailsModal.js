"use client";

import Modal from "@/components/admin/Common/Modal";
import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/DetailsModal.css";

function formatPrice(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PaymentDetailsModal({
  isOpen,
  payment,
  onClose,
}) {
  if (!payment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Details"
      size="lg"
    >
      <div className="details-body">

        {/* Payment Information */}

        <div className="details-section">

          <h3 className="details-section-title">
            Payment Information
          </h3>

          <div className="details-row">
            <span className="details-label">
              Payment ID
            </span>
            <span className="details-value-highlight">
              {payment.id}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Booking ID
            </span>
            <span className="details-value">
              {payment.bookingId}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Amount
            </span>
            <span className="details-value">
              {formatPrice(payment.amount)}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Status
            </span>

            <StatusBadge
              status={payment.status}
            />
          </div>

        </div>

        {/* Customer Information */}

        <div className="details-section">

          <h3 className="details-section-title">
            Customer Information
          </h3>

          <div className="details-row">
            <span className="details-label">
              Customer Name
            </span>
            <span className="details-value">
              {payment.customerName}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Mobile
            </span>
            <span className="details-value">
              {payment.mobile}
            </span>
          </div>

        </div>

        {/* Transaction Information */}

        <div className="details-section">

          <h3 className="details-section-title">
            Transaction Information
          </h3>

          <div className="details-row">
            <span className="details-label">
              Payment Method
            </span>
            <span className="details-value">
              {payment.paymentMethod}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Transaction ID
            </span>
            <span className="details-value-highlight">
              {payment.transactionId}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Payment Date
            </span>
            <span className="details-value">
              {formatDate(payment.paymentDate)}
            </span>
          </div>

        </div>

        {/* Refund Details */}

        <div className="details-section">

          <h3 className="details-section-title">
            Refund Details
          </h3>

          <div className="details-row">
            <span className="details-label">
              Refund Amount
            </span>
            <span className="details-value">
              {formatPrice(payment.refundAmount)}
            </span>
          </div>

        </div>

        {/* Notes */}

        <div className="details-section">

          <h3 className="details-section-title">
            Notes
          </h3>

          <div className="details-row">
            <span className="details-value">
              {payment.notes || "-"}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Created Date
            </span>

            <span className="details-value">
              {formatDate(payment.createdDate)}
            </span>
          </div>

        </div>

      </div>
    </Modal>
  );
}