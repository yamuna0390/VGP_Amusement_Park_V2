"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminOfferService } from "@/services/adminOfferService";
import { adminTicketTypeService } from "@/services/adminTicketTypeService";
import { Plus, Trash2 } from "lucide-react";

// For CSS we can just reuse ride form styles or similar global admin styles
import "@/components/admin/Rides/RideForm.css"; 

const defaultForm = {
  offer_name: "",
  description: "",
  offer_code: "",
  instruction: "",
  promotion_type: "PERCENTAGE", // 'PERCENTAGE', 'FLAT', 'BUY_X_GET_Y'
  discount_type: "PERCENTAGE",  // 'PERCENTAGE', 'FLAT', 'FIXED_PRICE'
  discount_value: 0,
  minimum_amount: 0,
  valid_from: "",
  valid_to: "",
  min_advance_days: 1,
  status: "Active",
  priority: 1,
  offer_tickets: [],
  offer_schedule_rules: []
};

export default function OfferForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [ticketTypes, setTicketTypes] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const t = await adminTicketTypeService.getTickets();
        setTicketTypes(t.data || t || []);
      } catch (err) {
        console.error("Failed to load tickets", err);
      }
    }
    loadData();
    
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        valid_from: initialData.valid_from ? new Date(initialData.valid_from).toISOString().split('T')[0] : "",
        valid_to: initialData.valid_to ? new Date(initialData.valid_to).toISOString().split('T')[0] : "",
        offer_tickets: initialData.offer_tickets || [],
        offer_schedule_rules: initialData.offer_schedule_rules || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "promotion_type") {
      let updatedTickets = [...form.offer_tickets];
      if (value === "PERCENTAGE" || value === "FLAT") {
        updatedTickets = updatedTickets.map(tk => ({
          ...tk,
          min_qty: 1,
          free_qty: 0
        }));
      }
      setForm(prev => ({ ...prev, [name]: value, offer_tickets: updatedTickets }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTicketChange = (index, field, value) => {
    const newTickets = [...form.offer_tickets];
    newTickets[index] = { ...newTickets[index], [field]: value };
    
    if (field === "ticket_id") {
      const selectedTicket = ticketTypes.find(t => t.id === Number(value));
      if (selectedTicket) {
        newTickets[index].display_name = selectedTicket.name;
      }
    }
    
    setForm(prev => ({ ...prev, offer_tickets: newTickets }));
  };

  const addTicketRow = () => {
    const newOrder = form.offer_tickets.length > 0 
      ? Math.max(...form.offer_tickets.map(t => t.display_order || 0)) + 1 
      : 1;
    setForm(prev => ({
      ...prev,
      offer_tickets: [...prev.offer_tickets, { ticket_id: "", display_name: "", min_qty: 1, free_qty: 0, max_qty: "", display_order: newOrder, is_active: 1 }]
    }));
  };

  const removeTicketRow = (index) => {
    const newTickets = [...form.offer_tickets];
    newTickets.splice(index, 1);
    setForm(prev => ({ ...prev, offer_tickets: newTickets }));
  };

  const handleWeekdayToggle = (dayValue) => {
    let newRules = [...form.offer_schedule_rules];
    const existingIndex = newRules.findIndex(r => Number(r.day_of_week) === dayValue);
    
    if (existingIndex >= 0) {
      newRules.splice(existingIndex, 1);
    } else {
      newRules.push({ day_of_week: dayValue, valid_from: null, valid_until: null });
    }
    
    setForm(prev => ({ ...prev, offer_schedule_rules: newRules }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    if (form.promotion_type === "BUY_X_GET_Y") {
      if (form.offer_tickets.length === 0) {
        alert("Buy X Get Y requires at least one applicable ticket.");
        setSubmitting(false);
        return;
      }
      for (const tk of form.offer_tickets) {
        if (!tk.ticket_id || tk.min_qty <= 0 || tk.free_qty <= 0) {
          alert("Buy X Get Y requires Ticket Type Name, Min buy Qty (>0), and Offer Qty (>0).");
          setSubmitting(false);
          return;
        }
      }
    } else {
      if (form.discount_value === "" || Number(form.discount_value) < 0) {
        alert("Discount Value is required and cannot be negative.");
        setSubmitting(false);
        return;
      }
    }

    try {
      const payload = { ...form };
      
      if (payload.promotion_type === "PERCENTAGE") {
        payload.discount_type = "PERCENTAGE";
      } else if (payload.promotion_type === "FLAT") {
        payload.discount_type = "FLAT";
      } else if (payload.promotion_type === "BUY_X_GET_Y") {
        payload.discount_type = "PERCENTAGE";
        payload.discount_value = 0;
      }
      
      if (payload.promotion_type !== "BUY_X_GET_Y") {
        payload.offer_tickets = payload.offer_tickets.map(tk => ({
          ...tk,
          min_qty: 1,
          free_qty: 0
        }));
      }

      if (isEdit) {
        await adminOfferService.updateOffer(initialData.id, payload);
        alert("Offer updated successfully");
      } else {
        await adminOfferService.createOffer(payload);
        alert("Offer created successfully");
      }
      router.push("/admin/offers");
    } catch (error) {
      alert("Error saving offer: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const dayOptions = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 7, label: "Sunday" }
  ];

  return (
    <form className="ride-form-container" onSubmit={handleSubmit}>
      <div className="ride-form-header">
        <h2>{isEdit ? `Edit Offer: ${form.offer_name}` : "Create New Offer"}</h2>
        <div className="header-actions">
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Offer"}
          </button>
        </div>
      </div>

      <div className="ride-form-grid">
        
        {/* SECTION A: Basic Info */}
        <section className="form-section">
          <h3>Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Offer Name *</label>
              <input type="text" name="offer_name" value={form.offer_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Offer Code (Optional)</label>
              <input type="text" name="offer_code" value={form.offer_code} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Description <small style={{ fontWeight: 'normal', color: '#666' }}>Explain the offer and its benefit to customers.</small></label>
            <textarea name="description" value={form.description || ""} onChange={handleChange} rows="3" />
          </div>
          <div className="form-group">
            <label>Instruction <small style={{ fontWeight: 'normal', color: '#666' }}>Tell customers what they need to do or provide to use this offer.</small></label>
            <textarea name="instruction" value={form.instruction || ""} onChange={handleChange} rows="3" />
          </div>
        </section>

        {/* SECTION B: Promotion Rules */}
        <section className="form-section">
          <h3>Promotion Rules</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Promotion Type *</label>
              <select name="promotion_type" value={form.promotion_type} onChange={handleChange} required>
                <option value="PERCENTAGE">Percentage</option>
                <option value="FLAT">Flat</option>
                <option value="BUY_X_GET_Y">Buy X Get Y</option>
              </select>
            </div>
            {form.promotion_type !== "BUY_X_GET_Y" && (
              <div className="form-group">
                <label>Discount Value {form.promotion_type === 'PERCENTAGE' ? '(%)' : ''} *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="discount_value" 
                  value={form.discount_value} 
                  onChange={handleChange} 
                  required 
                  min="0"
                />
              </div>
            )}
          </div>
        </section>

        {/* SECTION C: Constraints */}
        <section className="form-section">
          <h3>Constraints & Validity</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Valid From *</label>
              <input type="date" name="valid_from" value={form.valid_from} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Valid To *</label>
              <input type="date" name="valid_to" value={form.valid_to} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Minimum Advance Days</label>
              <input type="number" name="min_advance_days" value={form.min_advance_days} onChange={handleChange} required />
              <small>0 = same day booking</small>
            </div>
          </div>
        </section>

        {/* SECTION D: Admin Settings */}
        <section className="form-section">
          <h3>Admin Settings</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Priority (Lower = Higher precedence)</label>
              <input type="number" name="priority" value={form.priority} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={form.status} onChange={handleChange} required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION E: Applicable Tickets (Repeater) */}
        <section className="form-section">
          <div className="section-header-flex">
            <h3>Applicable Tickets (offer_tickets)</h3>
            <button type="button" className="btn-secondary btn-sm" onClick={addTicketRow}><Plus size={14}/> Add Ticket</button>
          </div>
          {form.offer_tickets.map((tk, index) => {
            return (
              <div key={index} className="repeater-row" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '2 1 200px' }}>
                  <label>Ticket Type Name</label>
                  <select 
                    value={tk.ticket_id} 
                    onChange={(e) => handleTicketChange(index, "ticket_id", e.target.value)} 
                    required
                  >
                    <option value="" disabled>Select a ticket...</option>
                    {ticketTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.id} — {t.name}</option>
                    ))}
                  </select>
                </div>
                {form.promotion_type === "BUY_X_GET_Y" && (
                  <>
                    <div className="form-group" style={{ flex: '1 1 100px' }}>
                      <label>Min buy Qty</label>
                      <input 
                        type="number" 
                        value={tk.min_qty} 
                        onChange={(e) => handleTicketChange(index, "min_qty", e.target.value)} 
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 100px' }}>
                      <label>Offer Qty</label>
                      <input 
                        type="number" 
                        value={tk.free_qty} 
                        onChange={(e) => handleTicketChange(index, "free_qty", e.target.value)} 
                        min="1"
                        required
                      />
                    </div>
                  </>
                )}
                <div className="form-group" style={{ alignSelf: 'flex-end', paddingBottom: '5px' }}>
                  <button type="button" className="btn-icon btn-danger" onClick={() => removeTicketRow(index)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
          {form.offer_tickets.length === 0 && <p className="empty-text">No applicable tickets added. (Offer won't evaluate if empty).</p>}
        </section>

        {/* SECTION F: Schedule Rules (Checkboxes) */}
        <section className="form-section">
          <h3>Schedule Restrictions (Optional)</h3>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
            No days selected = offer applies every day.
          </p>
          <div className="checkbox-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {dayOptions.map(day => {
              const isChecked = form.offer_schedule_rules.some(r => Number(r.day_of_week) === day.value);
              return (
                <label key={day.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleWeekdayToggle(day.value)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  {day.label}
                </label>
              );
            })}
          </div>
        </section>

      </div>
    </form>
  );
}