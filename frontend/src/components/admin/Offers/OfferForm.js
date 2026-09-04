"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

import { adminOfferService } from "@/services/adminOfferService";
import { adminTicketTypeService } from "@/services/adminTicketTypeService";
import { uploadService } from "@/services/uploadService";
import { getImageUrl } from "@/constants/api";

import "./OfferForm.css";

const DEFAULT_FORM = {
  offer_name: "",
  description: "",
  instruction: "",
  offer_code: "",
  image_url: null,

  offer_type_id: 1,

  discount_percentage: "",
  flat_discount: "",
  minimum_booking_value: 0,

  valid_from: "",
  valid_to: "",
  min_advance_days: 0,

  status: "Active",
  display_order: 1,

  offer_tickets: [],
  offer_schedule_rules: [],
};

const OFFER_TYPES = [
  {
    id: 1,
    code: "PERCENTAGE",
    name: "Percentage Discount",
  },
  {
    id: 2,
    code: "FLAT_OFF",
    name: "Flat Amount Off",
  },
  {
    id: 3,
    code: "BUY_X_GET_Y",
    name: "Buy X Get Y",
  },
];

const DAY_OPTIONS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

function formatDate(value) {
  if (!value) return "";

  try {
    return new Date(value).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

function getTicketPrice(ticket) {
  if (!ticket) return 0;

  return Number(
    ticket.price ??
      ticket.original_price ??
      ticket.originalPrice ??
      ticket.base_price ??
      ticket.basePrice ??
      0
  );
}

function calculateOfferPrice(ticket, offerTypeId, discountValue) {
  const originalPrice = getTicketPrice(ticket);
  const value = Number(discountValue);

  if (!originalPrice || Number.isNaN(value)) {
    return 0;
  }

  if (offerTypeId === 1) {
    // Percentage
    return Math.round(originalPrice * (1 - value / 100));
  }

  if (offerTypeId === 2) {
    // Flat amount
    return Math.max(0, Math.round(originalPrice - value));
  }

  return 0;
}

function getOfferTypeName(typeId) {
  const type = OFFER_TYPES.find(
    (item) => Number(item.id) === Number(typeId)
  );

  return type ? type.name : "";
}

export default function OfferForm({
  initialData = null,
  isEdit = false,
}) {
  const router = useRouter();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const data = await uploadService.uploadImage(file);
      setForm((prev) => ({ ...prev, image_url: data.url }));
    } catch (error) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      setForm(DEFAULT_FORM);
      return;
    }

    setForm({
      ...DEFAULT_FORM,
      ...initialData,
      image_url: initialData.image_url || null,

      offer_type_id:
        initialData.offer_type_id ??
        initialData.offerTypeId ??
        1,

      discount_percentage:
        initialData.discount_percentage ??
        "",

      flat_discount:
        initialData.flat_discount ??
        "",

      minimum_booking_value:
        initialData.minimum_booking_value ??
        0,

      valid_from: formatDate(initialData.valid_from),
      valid_to: formatDate(initialData.valid_to),

      min_advance_days:
        initialData.min_advance_days ??
        0,

      display_order:
        initialData.display_order ??
        1,

      offer_tickets: Array.isArray(initialData.offer_tickets)
        ? initialData.offer_tickets.map((ticket, index) => ({
            ...ticket,

            buy_ticket_id:
              ticket.buy_ticket_id ??
              "",

            free_ticket_id:
              ticket.free_ticket_id ??
              null,

            display_name:
              ticket.display_name ??
              "",

            display_subname:
              ticket.display_subname ??
              "",

            buy_quantity:
              ticket.buy_quantity ??
              1,

            free_quantity:
              ticket.free_quantity ??
              0,

            offer_price:
              ticket.offer_price ??
              0,

            max_qty:
              ticket.max_qty ??
              "",

            display_order:
              ticket.display_order ??
              index + 1,

            is_active:
              ticket.is_active !== undefined
                ? ticket.is_active
                : 1,
          }))
        : [],

      offer_schedule_rules:
        Array.isArray(initialData.offer_schedule_rules)
          ? initialData.offer_schedule_rules
          : [],
    });
  }, [initialData]);

  async function loadTickets() {
    setLoadingTickets(true);

    try {
      const response = await adminTicketTypeService.getTickets();

      const tickets =
        response?.data ||
        response ||
        [];

      setTicketTypes(Array.isArray(tickets) ? tickets : []);
    } catch (error) {
      console.error("Failed to load ticket types:", error);
      setTicketTypes([]);
    } finally {
      setLoadingTickets(false);
    }
  }

  const selectedOfferType = Number(form.offer_type_id);

  const isPercentage = selectedOfferType === 1;
  const isFlat = selectedOfferType === 2;
  const isBuyXGetY = selectedOfferType === 3;

  const discountValue = isPercentage
    ? form.discount_percentage
    : form.flat_discount;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleOfferTypeChange = (event) => {
    const offerTypeId = Number(event.target.value);

    setForm((previous) => ({
      ...previous,
      offer_type_id: offerTypeId,

      discount_percentage:
        offerTypeId === 1
          ? previous.discount_percentage
          : "",

      flat_discount:
        offerTypeId === 2
          ? previous.flat_discount
          : "",

      offer_tickets:
        offerTypeId === 3
          ? previous.offer_tickets
          : previous.offer_tickets.map((ticket) => ({
              ...ticket,
              buy_quantity: 1,
              free_quantity: 0,
              free_ticket_id: null,
            })),
    }));
  };

  const handleTicketChange = (index, field, value) => {
    setForm((previous) => {
      const updatedTickets = [...previous.offer_tickets];

      const updatedTicket = {
        ...updatedTickets[index],
        [field]: value,
      };

      if (field === "buy_ticket_id") {
        const selectedTicket = ticketTypes.find(
          (ticket) => Number(ticket.id) === Number(value)
        );

        if (selectedTicket) {
          updatedTicket.display_name = selectedTicket.name;

          if (!isBuyXGetY) {
            updatedTicket.offer_price =
              calculateOfferPrice(
                selectedTicket,
                selectedOfferType,
                discountValue
              );
          }
        }
      }

      if (field === "free_ticket_id" && value) {
        const freeTicket = ticketTypes.find(
          (ticket) => Number(ticket.id) === Number(value)
        );

        if (freeTicket && !updatedTicket.display_subname) {
          updatedTicket.display_subname = "";
        }
      }

      if (
        field === "buy_quantity" ||
        field === "free_quantity" ||
        field === "display_subname" ||
        field === "max_qty" ||
         field === "offer_price"
      ) {
        updatedTicket[field] = value;
      }

      updatedTickets[index] = updatedTicket;

      return {
        ...previous,
        offer_tickets: updatedTickets,
      };
    });
  };

  const recalculateTicketPrices = (
    offerTypeId,
    percentage,
    flatDiscount
  ) => {
    setForm((previous) => {
      const value =
        offerTypeId === 1
          ? percentage
          : flatDiscount;

      const updatedTickets = previous.offer_tickets.map(
        (ticket) => {
          const selectedTicket = ticketTypes.find(
            (item) =>
              Number(item.id) ===
              Number(ticket.buy_ticket_id)
          );

          return {
            ...ticket,
            offer_price:
              selectedTicket && offerTypeId !== 3
                ? calculateOfferPrice(
                    selectedTicket,
                    offerTypeId,
                    value
                  )
                : ticket.offer_price || 0,
          };
        }
      );

      return {
        ...previous,
        offer_tickets: updatedTickets,
      };
    });
  };

  const handleDiscountChange = (event) => {
    const { value } = event.target;

    if (isPercentage) {
      setForm((previous) => ({
        ...previous,
        discount_percentage: value,
      }));

      recalculateTicketPrices(
        1,
        value,
        form.flat_discount
      );

      return;
    }

    if (isFlat) {
      setForm((previous) => ({
        ...previous,
        flat_discount: value,
      }));

      recalculateTicketPrices(
        2,
        form.discount_percentage,
        value
      );
    }
  };

  const addTicketRow = () => {
    const nextOrder =
      form.offer_tickets.length > 0
        ? Math.max(
            ...form.offer_tickets.map(
              (ticket) =>
                Number(ticket.display_order) || 0
            )
          ) + 1
        : 1;

    const newTicket = {
      buy_ticket_id: "",
      free_ticket_id: null,

      display_name: "",
      display_subname: "",

      buy_quantity: 1,
      free_quantity: isBuyXGetY ? 1 : 0,

      offer_price: 0,

      max_qty: "",

      display_order: nextOrder,
      is_active: 1,
    };

    setForm((previous) => ({
      ...previous,
      offer_tickets: [
        ...previous.offer_tickets,
        newTicket,
      ],
    }));
  };

  const removeTicketRow = (index) => {
    setForm((previous) => ({
      ...previous,
      offer_tickets:
        previous.offer_tickets.filter(
          (_, ticketIndex) =>
            ticketIndex !== index
        ),
    }));
  };

  const toggleDay = (dayValue) => {
    setForm((previous) => {
      const exists =
        previous.offer_schedule_rules.some(
          (rule) =>
            Number(rule.day_of_week) ===
            Number(dayValue)
        );

      if (exists) {
        return {
          ...previous,
          offer_schedule_rules:
            previous.offer_schedule_rules.filter(
              (rule) =>
                Number(rule.day_of_week) !==
                Number(dayValue)
            ),
        };
      }

      return {
        ...previous,
        offer_schedule_rules: [
          ...previous.offer_schedule_rules,
          {
            day_of_week: dayValue,
            valid_from: null,
            valid_until: null,
          },
        ],
      };
    });
  };

  const validateForm = () => {
    if (!form.offer_name.trim()) {
      alert("Offer Name is required.");
      return false;
    }

    if (!form.valid_from || !form.valid_to) {
      alert("Valid From and Valid To are required.");
      return false;
    }

    if (
      Number(form.min_advance_days) < 0
    ) {
      alert("Minimum Advance Days cannot be negative.");
      return false;
    }

    if (isPercentage) {
      const percentage = Number(
        form.discount_percentage
      );

      if (
        form.discount_percentage === "" ||
        Number.isNaN(percentage) ||
        percentage < 0 ||
        percentage > 100
      ) {
        alert(
          "Percentage discount must be between 0 and 100."
        );
        return false;
      }
    }

    if (isFlat) {
      const flatDiscount = Number(
        form.flat_discount
      );

      if (
        form.flat_discount === "" ||
        Number.isNaN(flatDiscount) ||
        flatDiscount < 0
      ) {
        alert(
          "Flat discount cannot be negative."
        );
        return false;
      }
    }

    if (form.offer_tickets.length === 0) {
      alert(
        "Please add at least one applicable ticket."
      );
      return false;
    }

    for (const ticket of form.offer_tickets) {
      if (!ticket.buy_ticket_id) {
        alert(
          "Every offer ticket must have a Buy Ticket selected."
        );
        return false;
      }

      if (isBuyXGetY) {
        if (
          Number(ticket.buy_quantity) <= 0 ||
          Number(ticket.free_quantity) <= 0
        ) {
          alert(
            "Buy X Get Y requires valid Buy Quantity and Free Quantity."
          );
          return false;
        }

        if (!ticket.free_ticket_id) {
          alert(
            "Buy X Get Y requires a Free Ticket selection."
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        offer_name: form.offer_name.trim(),
        description:
          form.description?.trim() || null,
        instruction:
          form.instruction?.trim() || null,
        offer_code:
          form.offer_code?.trim() || null,
        image_url:
          form.image_url || null,

        offer_type_id:
          Number(form.offer_type_id),

        discount_percentage:
          isPercentage
            ? Number(form.discount_percentage)
            : null,

        flat_discount:
          isFlat
            ? Number(form.flat_discount)
            : null,

        minimum_booking_value:
          Number(form.minimum_booking_value) || 0,

        valid_from: form.valid_from,
        valid_to: form.valid_to,

        min_advance_days:
          Number(form.min_advance_days) || 0,

        status: form.status,

        display_order:
          Number(form.display_order) || 0,

        offer_tickets:
          form.offer_tickets.map(
            (ticket, index) => ({
              buy_ticket_id:
                Number(ticket.buy_ticket_id),

              free_ticket_id:
                isBuyXGetY
                  ? Number(ticket.free_ticket_id)
                  : null,

              display_name:
                ticket.display_name || "",

              display_subname:
                ticket.display_subname || null,

              buy_quantity:
                isBuyXGetY
                  ? Number(ticket.buy_quantity) || 1
                  : 1,

              free_quantity:
                isBuyXGetY
                  ? Number(ticket.free_quantity) || 0
                  : 0,

             offer_price:
  Math.round(
    Number(ticket.offer_price) || 0
  ),

              max_qty:
                ticket.max_qty === "" ||
                ticket.max_qty === null ||
                ticket.max_qty === undefined
                  ? null
                  : Number(ticket.max_qty),

              display_order:
                Number(ticket.display_order) ||
                index + 1,

              is_active:
                ticket.is_active !== undefined
                  ? Number(ticket.is_active)
                  : 1,
            })
          ),

        offer_schedule_rules:
          form.offer_schedule_rules.map(
            (rule) => ({
              day_of_week:
                Number(rule.day_of_week),
              valid_from:
                rule.valid_from || null,
              valid_until:
                rule.valid_until || null,
            })
          ),
      };

      if (isEdit) {
        await adminOfferService.updateOffer(
          initialData.id,
          payload
        );

        alert("Offer updated successfully.");
      } else {
        await adminOfferService.createOffer(
          payload
        );

        alert("Offer created successfully.");
      }

      router.push("/admin/offers");
    } catch (error) {
      console.error(
        "Offer save error:",
        error
      );

      alert(
        `Error saving offer: ${
          error?.message ||
          "Unknown error"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="offer-form-container"
      onSubmit={handleSubmit}
    >
      {/* HEADER */}
      <div className="offer-form-header">
        <div className="offer-form-title-block">
          <h2>
            {isEdit
              ? `Edit Offer: ${form.offer_name}`
              : "Create New Offer"}
          </h2>

          <p>
            Configure offer rules, eligible
            tickets and validity.
          </p>
        </div>

        <div className="offer-header-actions">
          <button
            type="button"
            className="offer-btn offer-btn-secondary"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="offer-btn offer-btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : isEdit
                ? "Update Offer"
                : "Save Offer"}
          </button>
        </div>
      </div>

      <div className="offer-form-grid">

        {/* BASIC INFORMATION */}
        <section className="offer-form-section">
          <div className="offer-section-heading">
            <div>
              <h3>Basic Information</h3>
              <p>
                Enter the main details shown and
                used for this offer.
              </p>
            </div>
          </div>

          <div className="offer-form-row">
            <div className="offer-form-group">
              <label>
                Offer Name <span>*</span>
              </label>

              <input
                type="text"
                name="offer_name"
                value={form.offer_name}
                onChange={handleChange}
                placeholder="Example: 15% Early Bird Offer"
                required
              />
            </div>

            <div className="offer-form-group">
              <label>Offer Code</label>

              <input
                type="text"
                name="offer_code"
                value={form.offer_code ?? ""}
                onChange={handleChange}
                placeholder="Example: EARLYBIRD15"
              />

              <small>
                Optional unique code for internal
                identification.
              </small>
            </div>
          </div>

          <div className="offer-form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description ?? ""}
              onChange={handleChange}
              rows={3}
              placeholder="Explain the offer and its benefit to customers."
            />
          </div>

          <div className="offer-form-group">
            <label>Instruction</label>

            <textarea
              name="instruction"
              value={form.instruction ?? ""}
              onChange={handleChange}
              rows={3}
              placeholder="Tell customers what they need to do or provide to use this offer."
            />
          </div>

          <div className="offer-form-group">
            <label>Offer Image</label>
            <div className="offer-image-upload-wrapper" style={{ marginTop: '8px' }}>
              {form.image_url ? (
                <div className="offer-image-preview" style={{ marginBottom: '10px' }}>
                  <img 
                    src={getImageUrl(form.image_url)} 
                    alt="Offer Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }} 
                  />
                </div>
              ) : null}
              
              <div className="offer-upload-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label className="offer-btn offer-btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={16} />
                  {imageUploading ? "Uploading..." : form.image_url ? "Replace Image" : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    style={{ display: 'none' }}
                  />
                </label>
                {form.image_url && !imageUploading && (
                  <button
                    type="button"
                    className="offer-btn offer-btn-secondary"
                    style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    onClick={() => setForm(prev => ({ ...prev, image_url: null }))}
                  >
                    Remove
                  </button>
                )}
              </div>
              <small style={{ display: 'block', marginTop: '6px' }}>
                Upload an image to display on the public offer card.
              </small>
            </div>
          </div>
        </section>

        {/* OFFER TYPE */}
        <section className="offer-form-section">
          <div className="offer-section-heading">
            <div>
              <h3>Offer Rule</h3>
              <p>
                Select how the offer changes the
                ticket price.
              </p>
            </div>
          </div>

          <div className="offer-form-row">
            <div className="offer-form-group">
              <label>
                Offer Type <span>*</span>
              </label>

              <select
                value={form.offer_type_id}
                onChange={handleOfferTypeChange}
                required
              >
                {OFFER_TYPES.map((type) => (
                  <option
                    key={type.id}
                    value={type.id}
                  >
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {!isBuyXGetY && (
              <div className="offer-form-group">
                <label>
                  {isPercentage
                    ? "Discount Percentage (%)"
                    : "Flat Discount (₹)"}
                  <span> *</span>
                </label>

                <input
                  type="number"
                  min="0"
                  max={
                    isPercentage
                      ? "100"
                      : undefined
                  }
                  step="0.01"
                  value={discountValue ?? ""}
                  onChange={handleDiscountChange}
                  placeholder={
                    isPercentage
                      ? "15"
                      : "100"
                  }
                  required
                />

                <small>
                  {isPercentage
                    ? "Offer price is automatically calculated from the regular ticket price."
                    : "The entered amount is deducted from each selected ticket price."}
                </small>
              </div>
            )}
          </div>

          <div className="offer-rule-summary">
            <div className="offer-rule-summary-label">
              Selected Rule
            </div>

            <div className="offer-rule-summary-value">
              {getOfferTypeName(
                form.offer_type_id
              )}
            </div>
          </div>
        </section>

        {/* VALIDITY */}
        <section className="offer-form-section">
          <div className="offer-section-heading">
            <div>
              <h3>Validity & Booking Rules</h3>
              <p>
                Control when customers can use
                this offer.
              </p>
            </div>
          </div>

          <div className="offer-form-row">
            <div className="offer-form-group">
              <label>
                Valid From <span>*</span>
              </label>

              <input
                type="date"
                name="valid_from"
                value={form.valid_from}
                onChange={handleChange}
                required
              />
            </div>

            <div className="offer-form-group">
              <label>
                Valid To <span>*</span>
              </label>

              <input
                type="date"
                name="valid_to"
                value={form.valid_to}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="offer-form-row">
            <div className="offer-form-group">
              <label>
                Minimum Advance Days
              </label>

              <input
                type="number"
                min="0"
                name="min_advance_days"
                value={form.min_advance_days}
                onChange={handleChange}
              />

              <small>
                0 = same-day booking allowed.
              </small>
            </div>

            <div className="offer-form-group">
              <label>
                Minimum Booking Value (₹)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                name="minimum_booking_value"
                value={
                  form.minimum_booking_value
                }
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* ADMIN SETTINGS */}
        <section className="offer-form-section">
          <div className="offer-section-heading">
            <div>
              <h3>Admin Settings</h3>
              <p>
                Control display order and active
                state.
              </p>
            </div>
          </div>

          <div className="offer-form-row">
            <div className="offer-form-group">
              <label>
                Display Order
              </label>

              <input
                type="number"
                min="0"
                name="display_order"
                value={form.display_order}
                onChange={handleChange}
              />

              <small>
                Lower number appears first.
              </small>
            </div>

            <div className="offer-form-group">
              <label>
                Status <span>*</span>
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="Active">
                  Active
                </option>
                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* TICKETS */}
        <section className="offer-form-section offer-ticket-section">
          <div className="offer-section-header-flex">
            <div>
              <h3>Applicable Tickets</h3>
              <p>
                Select the ticket categories covered
                by this offer.
              </p>
            </div>

            <button
              type="button"
              className="offer-btn offer-btn-secondary offer-btn-sm"
              onClick={addTicketRow}
            >
              <Plus size={15} />
              Add Ticket
            </button>
          </div>

          {loadingTickets ? (
            <div className="offer-loading">
              Loading ticket types...
            </div>
          ) : form.offer_tickets.length === 0 ? (
            <div className="offer-empty-state">
              <p>
                No applicable tickets added yet.
              </p>

              <span>
                Add at least one ticket before
                saving this offer.
              </span>
            </div>
          ) : (
            <div className="offer-ticket-list">
              {form.offer_tickets.map(
                (ticket, index) => {
                  const selectedTicket =
                    ticketTypes.find(
                      (item) =>
                        Number(item.id) ===
                        Number(
                          ticket.buy_ticket_id
                        )
                    );

                  return (
                    <div
                      key={`offer-ticket-${index}`}
                      className="offer-ticket-card"
                    >
                      <div className="offer-ticket-card-header">
                        <div>
                          <span className="offer-ticket-number">
                            Ticket {index + 1}
                          </span>

                          <strong>
                            {ticket.display_name ||
                              "New Ticket Rule"}
                          </strong>
                        </div>

                        <button
                          type="button"
                          className="offer-icon-btn offer-icon-btn-danger"
                          onClick={() =>
                            removeTicketRow(index)
                          }
                          aria-label="Remove ticket"
                          title="Remove ticket"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="offer-ticket-grid">

                        {/* BUY TICKET */}
                        <div className="offer-form-group">
                          <label>
                            {isBuyXGetY
                              ? "Buy Ticket"
                              : "Ticket Type"}
                            <span> *</span>
                          </label>

                          <select
                            value={
                              ticket.buy_ticket_id
                            }
                            onChange={(event) =>
                              handleTicketChange(
                                index,
                                "buy_ticket_id",
                                event.target.value
                              )
                            }
                            required
                          >
                            <option value="">
                              Select ticket...
                            </option>

                            {ticketTypes.map(
                              (item) => (
                                <option
                                  key={item.id}
                                  value={item.id}
                                >
                                  {item.name}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* FREE TICKET */}
                        {isBuyXGetY && (
                          <div className="offer-form-group">
                            <label>
                              Free Ticket
                              <span> *</span>
                            </label>

                            <select
                              value={
                                ticket.free_ticket_id ||
                                ""
                              }
                              onChange={(event) =>
                                handleTicketChange(
                                  index,
                                  "free_ticket_id",
                                  event.target.value
                                )
                              }
                              required
                            >
                              <option value="">
                                Select free ticket...
                              </option>

                              {ticketTypes.map(
                                (item) => (
                                  <option
                                    key={item.id}
                                    value={item.id}
                                  >
                                    {item.name}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        )}

                        {/* BUY QTY */}
                        {isBuyXGetY && (
                          <div className="offer-form-group">
                            <label>
                              Buy Quantity
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={
                                ticket.buy_quantity
                              }
                              onChange={(event) =>
                                handleTicketChange(
                                  index,
                                  "buy_quantity",
                                  event.target.value
                                )
                              }
                            />
                          </div>
                        )}

                        {/* FREE QTY */}
                        {isBuyXGetY && (
                          <div className="offer-form-group">
                            <label>
                              Free Quantity
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={
                                ticket.free_quantity
                              }
                              onChange={(event) =>
                                handleTicketChange(
                                  index,
                                  "free_quantity",
                                  event.target.value
                                )
                              }
                            />
                          </div>
                        )}

                        {/* DISPLAY NAME */}
                        <div className="offer-form-group">
                          <label>
                            Display Name
                            <span> *</span>
                          </label>

                          <input
                            type="text"
                            value={
                              ticket.display_name ||
                              ""
                            }
                            onChange={(event) =>
                              handleTicketChange(
                                index,
                                "display_name",
                                event.target.value
                              )
                            }
                            placeholder="Example: Adult Fun Pass"
                            required
                          />
                        </div>

                        {/* DISPLAY SUBNAME */}
                        <div className="offer-form-group">
                          <label>
                            Display Subname
                          </label>

                          <input
                            type="text"
                            value={
                              ticket.display_subname ||
                              ""
                            }
                            onChange={(event) =>
                              handleTicketChange(
                                index,
                                "display_subname",
                                event.target.value
                              )
                            }
                            placeholder={
                              isBuyXGetY
                                ? "Example: Buy 1 Get 1 Child Free"
                                : isPercentage
                                  ? "Example: 15% OFF"
                                  : "Example: ₹100 OFF"
                            }
                          />
                        </div>

             {/* OFFER PRICE */}
{isBuyXGetY ? (
  <div className="offer-form-group">
    <label>
      Offer Price
    </label>

    <input
      type="number"
      min="0"
      step="1"
      value={ticket.offer_price ?? ""}
      onChange={(event) =>
        handleTicketChange(
          index,
          "offer_price",
          event.target.value
        )
      }
      placeholder="Enter offer price"
    />
  </div>
) : (
  <div className="offer-form-group">
    <label>
      Calculated Offer Price
    </label>

    <div className="offer-price-preview">
      <span className="offer-price-original">
        ₹
        {getTicketPrice(
          selectedTicket
        ).toFixed(0)}
      </span>

      <span className="offer-price-arrow">
        →
      </span>

      <strong>
        ₹
        {Number(
          ticket.offer_price || 0
        ).toFixed(0)}
      </strong>
    </div>

    <small>
      Automatically calculated
      from the selected ticket
      price.
    </small>
  </div>
)}

{/* MAX QTY */}
<div className="offer-form-group">
  <label>
    Maximum Quantity
  </label>

  <input
    type="number"
    min="1"
    value={
      ticket.max_qty ?? ""
    }
    onChange={(event) =>
      handleTicketChange(
        index,
        "max_qty",
        event.target.value
      )
    }
    placeholder="Optional"
  />
</div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* SCHEDULE */}
        <section className="offer-form-section">
          <div className="offer-section-heading">
            <div>
              <h3>
                Schedule Restrictions
              </h3>

              <p>
                Optional: restrict the offer to
                selected weekdays.
              </p>
            </div>
          </div>

          <div className="offer-schedule-note">
            No days selected = offer applies every
            day during its validity period.
          </div>

          <div className="offer-day-grid">
            {DAY_OPTIONS.map((day) => {
              const checked =
                form.offer_schedule_rules.some(
                  (rule) =>
                    Number(
                      rule.day_of_week
                    ) === day.value
                );

              return (
                <label
                  key={day.value}
                  className={`offer-day-option ${
                    checked
                      ? "offer-day-option-active"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      toggleDay(day.value)
                    }
                  />

                  <span>{day.label}</span>
                </label>
              );
            })}
          </div>
        </section>

      </div>
    </form>
  );
}