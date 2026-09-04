"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { adminReviewService } from "@/services/adminReviewService";

export default function AddReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    location: "",
    rating: 5,
    review_text: "",
    status: "Unpublished",
    display_order: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" || name === "display_order" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminReviewService.createReview(formData);
      router.push("/admin/reviews");
    } catch (err) {
      setError(err.message || "Failed to create review");
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/reviews" className="text-blue-600 hover:underline flex items-center gap-2 text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Back to Reviews
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Review</h1>
        <p className="text-gray-500 mt-1">Add a customer testimonial that can be displayed on the VGP Universal Kingdom website.</p>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-8">
        
        {/* Customer Information Group */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
                placeholder="e.g. Priya R."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
                placeholder="e.g. Chennai"
              />
            </div>
          </div>
        </div>

        {/* Review Details Group */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Review Details</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating <span className="text-red-500">*</span></label>
              <select 
                name="rating" 
                value={formData.rating} 
                onChange={handleChange} 
                required
                className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm bg-white"
              >
                <option value={5}>★★★★★ 5 - Excellent</option>
                <option value={4}>★★★★☆ 4 - Good</option>
                <option value={3}>★★★☆☆ 3 - Average</option>
                <option value={2}>★★☆☆☆ 2 - Poor</option>
                <option value={1}>★☆☆☆☆ 1 - Terrible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Text <span className="text-red-500">*</span></label>
              <textarea
                name="review_text"
                value={formData.review_text}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
                placeholder="Review content here..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Publication Group */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Publication</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm bg-white"
              >
                <option value="Unpublished">Unpublished</option>
                <option value="Published">Published</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
                placeholder="Lower number appears first"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t">
          <Link 
            href="/admin/reviews" 
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 disabled:opacity-60 transition-colors"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
