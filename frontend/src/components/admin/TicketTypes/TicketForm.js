"use client";

import "./TicketForm.css";

export default function TicketForm({ onCancel }) {
  return (
    <form className="ticket-form">

      <div className="form-group">
        <label>Ticket Name</label>
        <input
          type="text"
          placeholder="Enter ticket name"
        />
      </div>

      <div className="form-group">
        <label>Category</label>

        <select>
          <option>Regular</option>
          <option>Group</option>
          <option>Special</option>
        </select>
      </div>

      <div className="form-group">
        <label>Price (₹)</label>

        <input
          type="number"
          placeholder="Enter ticket price"
        />
      </div>

      <div className="form-group">
        <label>Status</label>

        <select>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="form-group">
        <label>Description</label>

        <textarea
          rows="4"
          placeholder="Enter description"
        ></textarea>
      </div>

      <div className="form-actions">

        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="save-btn"
        >
          Save Ticket
        </button>

      </div>

    </form>
  );
}