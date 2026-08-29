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
  image_url: "",
};

export default function EventForm({
  isOpen,
  event,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(initialState);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData(initialState);
    }
    setError("");
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

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const { adminEventService } = await import("@/services/adminEventService");
      const result = await adminEventService.uploadImage(file);
      if (result.success) {
        setFormData(prev => ({ ...prev, image_url: result.url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemoveImage() {
    setFormData(prev => ({ ...prev, image_url: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!formData.image_url) {
      setError("Event image is required.");
      return;
    }

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
        {error && <div style={{ color: "red", marginBottom: "16px", fontWeight: "bold" }}>{error}</div>}
        <div className="form-grid">

          <div className="form-group form-group-full">
            <label>Event Image *</label>
            {!formData.image_url ? (
              <div style={{ border: "2px dashed #CBD5E1", padding: "30px", borderRadius: "12px", textAlign: "center", background: "#F8FAFC" }}>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  id="event-image-upload"
                  style={{ display: "none" }}
                />
                <label htmlFor="event-image-upload" style={{ cursor: "pointer", display: "inline-block", padding: "10px 20px", background: "white", border: "1px solid #E2E8F0", borderRadius: "8px", fontWeight: "600" }}>
                  {isUploading ? "Uploading..." : "Upload Image"}
                </label>
                <p style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "12px" }}>JPG, PNG or WebP (Max 5MB)</p>
              </div>
            ) : (
              <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", display: "inline-block", border: "1px solid #E2E8F0" }}>
                <img 
                  src={formData.image_url.startsWith('http') ? formData.image_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${formData.image_url}`} 
                  alt="Event Preview" 
                  style={{ display: "block", maxHeight: "200px", objectFit: "cover" }} 
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{ position: "absolute", top: "10px", right: "10px", background: "white", color: "red", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

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