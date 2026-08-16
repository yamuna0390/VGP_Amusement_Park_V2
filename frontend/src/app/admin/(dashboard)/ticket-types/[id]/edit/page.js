"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Activity } from "lucide-react";
import { adminTicketTypeService } from "@/services/adminTicketTypeService";

export default function EditTicketPage() {
  const router = useRouter();
  const params = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    price: "",
    display_order: "0",
    status: "Active"
  });

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticket = await adminTicketTypeService.getTicketById(params.id);
        setFormData({
          name: ticket.name || "",
          code: ticket.code || "",
          description: ticket.description || "",
          price: ticket.price || "",
          display_order: ticket.display_order?.toString() || "0",
          status: ticket.status || "Active"
        });
      } catch (err) {
        setError(err.message || "Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchTicket();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const priceVal = parseFloat(formData.price);
      if (isNaN(priceVal) || priceVal < 0) {
        throw new Error("Price must be a valid number >= 0");
      }

      await adminTicketTypeService.updateTicket(params.id, {
        name: formData.name,
        description: formData.description,
        price: priceVal,
        display_order: parseInt(formData.display_order) || 0
      });

      router.push("/admin/ticket-types");
    } catch (err) {
      setError(err.message || "Failed to update ticket");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Activity size={48} className="animate-spin mb-4" />
        <p>Loading Ticket Data...</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/ticket-types" className="text-blue-600 hover:underline flex items-center gap-2 text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Back to Ticket Types
        </Link>
        <h1 className="text-2xl font-bold">Edit Ticket Type</h1>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ticket Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              disabled
              className="w-full border rounded-lg px-3 py-2 outline-none bg-gray-100 text-gray-500"
              title="Category codes cannot be changed after creation"
            />
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
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <input
              type="text"
              value={formData.status}
              disabled
              className="w-full border rounded-lg px-3 py-2 outline-none bg-gray-100 text-gray-500"
              title="Use the Enable/Disable button on the list page to change status"
            />
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
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
