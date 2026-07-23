"use client";

import Modal from "@/components/admin/Common/Modal";
import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/DetailsModal.css";

export default function EventDetailsModal({
  isOpen,
  event,
  onClose,
}) {
  if (!event) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Event Details"
      size="lg"
    >
      <div className="details-body">

        {/* Event Information */}

        <div className="details-section">

          <h3 className="details-section-title">
            Event Information
          </h3>

          <div className="details-row">
            <span className="details-label">
              Event ID
            </span>

            <span className="details-value-highlight">
              {event.id}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Event Name
            </span>

            <span className="details-value">
              {event.name}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Event Type
            </span>

            <span className="details-value">
              {event.type}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Description
            </span>

            <span className="details-value">
              {event.description}
            </span>
          </div>

        </div>

        {/* Schedule */}

        <div className="details-section">

          <h3 className="details-section-title">
            Schedule
          </h3>

          <div className="details-row">
            <span className="details-label">
              Start Date
            </span>

            <span className="details-value">
              {event.startDate}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              End Date
            </span>

            <span className="details-value">
              {event.endDate}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Start Time
            </span>

            <span className="details-value">
              {event.startTime}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              End Time
            </span>

            <span className="details-value">
              {event.endTime}
            </span>
          </div>

        </div>

        {/* Venue */}

        <div className="details-section">

          <h3 className="details-section-title">
            Venue
          </h3>

          <div className="details-row">
            <span className="details-label">
              Venue
            </span>

            <span className="details-value">
              {event.venue}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Capacity
            </span>

            <span className="details-value">
              {event.capacity}
            </span>
          </div>

          <div className="details-row">
            <span className="details-label">
              Ticket Required
            </span>

            <span className="details-value">
              {event.ticketRequired}
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
              status={event.status}
            />
          </div>

          <div className="details-row">
            <span className="details-label">
              Created Date
            </span>

            <span className="details-value">
              {event.createdDate}
            </span>
          </div>

        </div>

      </div>
    </Modal>
  );
}