"use client";

import { useState } from "react";
import "./SettingsForm.css";

export default function SettingsForm({ settings }) {
  const [formData, setFormData] = useState(settings);

  function handleChange(section, field, value) {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }

  function handleCheckbox(section, field) {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  }

  function handleSave() {
    alert("Settings saved successfully! (Demo)");
  }

  return (
    <div className="settings-container">

      {/* Park Information */}

      <div className="settings-card">
        <h2>Park Information</h2>

        <div className="settings-grid">

          <div className="form-group">
            <label>Park Name</label>
            <input
              value={formData.parkInfo.parkName}
              onChange={(e) =>
                handleChange("parkInfo", "parkName", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              value={formData.parkInfo.email}
              onChange={(e) =>
                handleChange("parkInfo", "email", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              value={formData.parkInfo.phone}
              onChange={(e) =>
                handleChange("parkInfo", "phone", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>WhatsApp</label>
            <input
              value={formData.parkInfo.whatsapp}
              onChange={(e) =>
                handleChange("parkInfo", "whatsapp", e.target.value)
              }
            />
          </div>

        </div>

        <div className="form-group">
          <label>Address</label>

          <textarea
            rows="3"
            value={formData.parkInfo.address}
            onChange={(e) =>
              handleChange("parkInfo", "address", e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>About Park</label>

          <textarea
            rows="4"
            value={formData.parkInfo.about}
            onChange={(e) =>
              handleChange("parkInfo", "about", e.target.value)
            }
          />
        </div>

      </div>

      {/* Business Hours */}

      <div className="settings-card">
        <h2>Business Hours</h2>

        <div className="settings-grid">

          <div className="form-group">
            <label>Opening Time</label>

            <input
              type="time"
              value={formData.businessHours.openingTime}
              onChange={(e) =>
                handleChange(
                  "businessHours",
                  "openingTime",
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>Closing Time</label>

            <input
              type="time"
              value={formData.businessHours.closingTime}
              onChange={(e) =>
                handleChange(
                  "businessHours",
                  "closingTime",
                  e.target.value
                )
              }
            />
          </div>

        </div>
      </div>

      {/* Ticket Settings */}

      <div className="settings-card">
        <h2>Ticket Settings</h2>

        <div className="settings-grid">

          <div className="form-group">
            <label>Adult Ticket</label>

            <input
              type="number"
              value={formData.ticketSettings.adultPrice}
              onChange={(e) =>
                handleChange(
                  "ticketSettings",
                  "adultPrice",
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>Child Ticket</label>

            <input
              type="number"
              value={formData.ticketSettings.childPrice}
              onChange={(e) =>
                handleChange(
                  "ticketSettings",
                  "childPrice",
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>Senior Ticket</label>

            <input
              type="number"
              value={formData.ticketSettings.seniorPrice}
              onChange={(e) =>
                handleChange(
                  "ticketSettings",
                  "seniorPrice",
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>Tax (%)</label>

            <input
              type="number"
              value={formData.ticketSettings.tax}
              onChange={(e) =>
                handleChange(
                  "ticketSettings",
                  "tax",
                  e.target.value
                )
              }
            />
          </div>

        </div>
      </div>

      {/* Email Settings */}

      <div className="settings-card">
        <h2>Email Settings</h2>

        <div className="checkbox-group">

          <label>
            <input
              type="checkbox"
              checked={formData.emailSettings.bookingConfirmation}
              onChange={() =>
                handleCheckbox(
                  "emailSettings",
                  "bookingConfirmation"
                )
              }
            />

            Booking Confirmation Emails
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.emailSettings.enquiryNotification}
              onChange={() =>
                handleCheckbox(
                  "emailSettings",
                  "enquiryNotification"
                )
              }
            />

            Contact Enquiry Notifications
          </label>

        </div>
      </div>

      <div className="settings-actions">

        <button
          className="save-btn"
          onClick={handleSave}
        >
          Save Settings
        </button>

      </div>

    </div>
  );
}