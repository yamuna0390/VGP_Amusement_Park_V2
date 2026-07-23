"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/admin/Common/Modal";
import "./FoodItemForm.css";

const initialState = {
  id: "",
  name: "",
  category: "Fast Food",
  description: "",
  price: "",
  type: "Veg",
  availability: "Available",
  status: "Active",
};

export default function FoodItemForm({
  isOpen,
  onClose,
  onSave,
  foodItem,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (foodItem) {
      setForm(foodItem);
    } else {
      setForm(initialState);
    }
  }, [foodItem]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      ...form,
      price: Number(form.price),
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      title={foodItem ? "Edit Food Item" : "Add Food Item"}
      onClose={onClose}
      size="xl"
    >
      <form
        className="food-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">

          <div className="form-group">
            <label>Food Name</label>

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
              <option>Fast Food</option>
              <option>South Indian</option>
              <option>North Indian</option>
              <option>Chinese</option>
              <option>Beverages</option>
              <option>Desserts</option>
              <option>Snacks</option>
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
            <label>Price (₹)</label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Food Type</label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option>Veg</option>
              <option>Non-Veg</option>
              <option>Mixed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Availability</label>

            <select
              name="availability"
              value={form.availability}
              onChange={handleChange}
            >
              <option>Available</option>
              <option>Out of Stock</option>
            </select>
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
            {foodItem ? "Update Food Item" : "Add Food Item"}
          </button>

        </div>
      </form>
    </Modal>
  );
}