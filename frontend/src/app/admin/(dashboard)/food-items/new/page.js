"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { adminAddonService } from "@/services/adminAddonService";

export default function NewFoodItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    addon_type: "OTHER",
    price: "",
    display_order: "0",
    status: "Active"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const priceVal = parseFloat(formData.price);
      if (isNaN(priceVal) || priceVal < 0) {
        throw new Error("Price must be a valid number >= 0");
      }

      await adminAddonService.createAddon({
        ...formData,
        price: priceVal,
        display_order: parseInt(formData.display_order) || 0
      });

      router.push("/admin/food-items");
    } catch (err) {
      setError(err.message || "Failed to create item");
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/food-items" className="text-blue-600 hover:underline flex items-center gap-2 text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Back to Food & Add-ons
        </Link>
        <h1 className="text-2xl font-bold">Add New Item</h1>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Lunch Buffet"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Internal Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. lunch-buffet"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category Type *</label>
            <select
              name="addon_type"
              value={formData.addon_type}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MEAL_COUPON">Meal Coupon</option>
              <option value="LOCKER">Locker</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Item details..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : <><Save size={18} /> Save Item</>}
          </button>
        </div>
      </form>
    </div>
  );
}
