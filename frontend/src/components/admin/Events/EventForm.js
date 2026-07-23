"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/admin/Common/Modal";
import "./EventForm.css";

const initialState = {
  name: "",
  type: "Live Show",
  description: "",
  venue: "",
  capacity: 100,
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  ticketRequired: "Yes",
  status: "Upcoming",
};

export default function EventForm({
  isOpen,
  event,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData(initialState);
    }
  }, [event, isOpen]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacity"
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      ...formData,
      id: event?.id,
      createdDate:
        event?.createdDate ||
        new Date().toISOString().split("T")[0],
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? "Edit Event" : "Add Event"}
      size="xl"
    >
      <form
        className="event-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">

          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Event Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option>Live Show</option>
              <option>Magic Show</option>
              <option>Dance Performance</option>
              <option>Music Concert</option>
              <option>Kids Show</option>
              <option>Festival</option>
              <option>Seasonal Event</option>
              <option>Special Event</option>
            </select>
          </div>

          <div className="form-group form-group-full">
            <label>Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Venue</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ticket Required</label>
            <select
              name="ticketRequired"
              value={formData.ticketRequired}
              onChange={handleChange}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Upcoming</option>
              <option>Live</option>
              <option>Ended</option>
              <option>Cancelled</option>
            </select>
          </div>

        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
          >
            {event ? "Update Event" : "Add Event"}
          </button>
        </div>
      </form>
    </Modal>
  );
}