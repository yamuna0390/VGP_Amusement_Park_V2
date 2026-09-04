"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Search, Trash2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { adminReviewService } from "@/services/adminReviewService";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await adminReviewService.getReviews();
      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (review) => {
    try {
      const newStatus = review.status === "Published" ? "Unpublished" : "Published";
      const confirmMsg = newStatus === "Unpublished" 
        ? `Are you sure you want to unpublish the review by "${review.customer_name}"?`
        : `Are you sure you want to publish the review by "${review.customer_name}"?`;
        
      if (!window.confirm(confirmMsg)) return;

      await adminReviewService.updateReviewStatus(review.id, newStatus);
      fetchReviews();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const deleteReview = async (review) => {
    try {
      if (!window.confirm(`Are you sure you want to delete the review by "${review.customer_name}"? This action cannot be undone.`)) return;
      await adminReviewService.deleteReview(review.id);
      fetchReviews();
    } catch (error) {
      alert("Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter((item) => {
    const matchesSearch = item.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (item.review_text && item.review_text.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === "" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page-container p-6">
      <div className="admin-page-header flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
          <p className="text-gray-500 mt-1">Manage customer testimonials displayed on the website.</p>
        </div>
        <Link href="/admin/reviews/new" className="admin-btn-primary bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shrink-0">
          <Plus size={18} /> Add Review
        </Link>
      </div>

      <div className="admin-table-controls flex flex-col md:flex-row gap-4 mb-6">
        <div className="search-box flex items-center border rounded-lg px-3 py-2 bg-white flex-1 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by customer name or text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-select border rounded-lg px-3 py-2 bg-white outline-none text-sm shadow-sm min-w-[150px]"
        >
          <option value="">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Unpublished">Unpublished</option>
        </select>
      </div>

      <div className="admin-table-container overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="admin-table w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Order</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500">Loading reviews...</td>
              </tr>
            ) : filteredReviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-16">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-lg font-medium mb-1">No reviews found</p>
                    <p className="text-sm mb-4">No customer reviews have been added yet.</p>
                    <Link href="/admin/reviews/new" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                      <Plus size={16} /> Add Review
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-500 font-medium">
                    {review.display_order}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{review.customer_name}</div>
                    {review.review_text && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xs" title={review.review_text}>
                        "{review.review_text}"
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {review.location || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <div className="text-yellow-400 text-sm tracking-widest">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({review.rating}/5)</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      review.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/admin/reviews/${review.id}/edit`} 
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium transition-colors"
                      >
                        <Edit size={16} /> Edit
                      </Link>
                      <button
                        onClick={() => toggleStatus(review)}
                        className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                          review.status === "Published" ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'
                        }`}
                        title={review.status === "Published" ? "Unpublish Review" : "Publish Review"}
                      >
                        {review.status === "Published" ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        {review.status === "Published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => deleteReview(review)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium transition-colors ml-2"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
