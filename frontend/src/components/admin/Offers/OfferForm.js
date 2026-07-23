"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/admin/Common/Modal";
import "./OfferForm.css";

const initialState = {
  name: "",
  code: "",
  type: "2-Day Pass",
  description: "",

  adultPrice: 0,
  adultSaving: 0,

  childPrice: 0,
  childSaving: 0,

  validityType: "Any Day",
  duration: "1-Day",

  startDate: "",
  endDate: "",

  enabled: true,
};

export default function OfferForm({
  isOpen,
  offer,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (offer) {
      setFormData(offer);
    } else {
      setFormData(initialState);
    }
  }, [offer, isOpen]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : [
              "adultPrice",
              "adultSaving",
              "childPrice",
              "childSaving",
            ].includes(name)
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      ...formData,
      id: offer?.id,
      createdDate:
        offer?.createdDate ||
        new Date().toISOString().split("T")[0],
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={offer ? "Edit Offer" : "Add Offer"}
      size="xl"
    >
      <form
        className="offer-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">

          <div className="form-group">
            <label>Offer Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Offer Code</label>

            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
              required
            />
          </div>

          <div className="form-group">
            <label>Offer Type</label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option>2-Day Pass</option>
              <option>Family Package</option>
              <option>Seasonal</option>
              <option>Birthday Offer</option>
              <option>Student Offer</option>
              <option>Group Package</option>
              <option>Weekend Offer</option>
              <option>Advance Booking</option>
              <option>Premium</option>
              <option>Festival Offer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Validity Type</label>

            <select
              name="validityType"
              value={formData.validityType}
              onChange={handleChange}
            >
              <option>Any Day</option>
              <option>Weekdays</option>
              <option>Saturday & Sunday</option>
              <option>Festival Days</option>
              <option>Advance Booking</option>
            </select>
          </div>

          <div className="form-group form-group-full">
            <label>Description</label>

            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Adult Price (₹)</label>

            <input
              type="number"
              name="adultPrice"
              value={formData.adultPrice}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Adult Saving (₹)</label>

            <input
              type="number"
              name="adultSaving"
              value={formData.adultSaving}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Child Price (₹)</label>

            <input
              type="number"
              name="childPrice"
              value={formData.childPrice}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Child Saving (₹)</label>

            <input
              type="number"
              name="childSaving"
              value={formData.childSaving}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Duration</label>

            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Example: 2-Day Validity"
              required
            />
          </div>

          <div className="form-group">
            <label>Offer Enabled</label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enabled"
                checked={formData.enabled}
                onChange={handleChange}
              />

              Enable this Offer
            </label>
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
            {offer ? "Update Offer" : "Add Offer"}
          </button>

        </div>
      </form>
    </Modal>
  );
}