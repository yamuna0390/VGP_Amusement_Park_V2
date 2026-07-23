"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/admin/Common/Modal";
import "./AttractionForm.css";

const initialState = {
  id: "",
  name: "",
  category: "Thrill Ride",
  description: "",
  minHeight: "",
  duration: "",
  capacity: "",
  location: "",
  status: "Active",
};

export default function AttractionForm({
  isOpen,
  onClose,
  onSave,
  attraction,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (attraction) {
      setForm(attraction);
    } else {
      setForm(initialState);
    }
  }, [attraction]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSave(form);
  }

  return (
    <Modal
      isOpen={isOpen}
      title={attraction ? "Edit Attraction" : "Add Attraction"}
      onClose={onClose}
      size="xl"
    >
      <form
        className="attraction-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">

          <div className="form-group">
            <label>Attraction Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Thrill Ride</option>
              <option>Family Ride</option>
              <option>Kids Ride</option>
              <option>Water Ride</option>
              <option>Indoor Attraction</option>
            </select>
          </div>

          <div className="form-group form-group-full">
            <label>Description</label>

            <textarea
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Minimum Height</label>

            <input
              type="text"
              name="minHeight"
              value={form.minHeight}
              onChange={handleChange}
              placeholder="140 cm"
            />
          </div>

          <div className="form-group">
            <label>Ride Duration</label>

            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="3 min"
            />
          </div>

          <div className="form-group">
            <label>Maximum Capacity</label>

            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Maintenance</option>
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
            {attraction ? "Update Attraction" : "Add Attraction"}
          </button>

        </div>
      </form>
    </Modal>
  );
}