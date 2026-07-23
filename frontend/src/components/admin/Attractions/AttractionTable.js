"use client";

import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/AdminTable.css";
import "./AttractionTable.css";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

export default function AttractionTable({
  attractions,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="admin-table-card">
      <div className="admin-table-scroll">

        <table className="admin-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Attraction Name</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Min Height</th>
              <th>Status</th>
              <th className="admin-text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {attractions.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="admin-empty"
                >
                  No attractions found.
                </td>
              </tr>
            ) : (
              attractions.map((attraction) => (
                <tr key={attraction.id}>

                  <td className="admin-id">
                    {attraction.id}
                  </td>

                  <td>
                    <div className="attraction-image-placeholder">
                      🎢
                    </div>
                  </td>

                  <td className="admin-name">
                    {attraction.name}
                  </td>

                  <td>
                    {attraction.category}
                  </td>

                  <td>
                    {attraction.duration}
                  </td>

                  <td>
                    {attraction.minHeight}
                  </td>

                  <td>
                    <StatusBadge
                      status={attraction.status}
                    />
                  </td>

                  <td className="admin-actions">

                    <button
                      className="admin-action-btn admin-view"
                      onClick={() => onView(attraction)}
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="admin-action-btn admin-edit"
                      onClick={() => onEdit(attraction)}
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="admin-action-btn admin-delete"
                      onClick={() => onDelete(attraction)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>

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