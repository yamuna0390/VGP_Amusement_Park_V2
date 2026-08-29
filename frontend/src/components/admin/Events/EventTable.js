"use client";

import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/AdminTable.css";
import "./EventTable.css";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

function formatDate(date) {
  if (!date) return "-";

  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EventTable({
  events,
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
              <th>Banner</th>
              <th>Event Name</th>
              <th>Type</th>
              <th>Venue</th>
              <th>Event Date</th>
              <th>Status</th>
              <th className="admin-text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {events.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="admin-empty"
                >
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id}>

                  <td className="admin-id">
                    {event.id}
                  </td>

                  <td>
                    {event.image_url ? (
                      <div className="event-banner-thumbnail">
                        <img 
                          src={event.image_url.startsWith('http') ? event.image_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${event.image_url}`} 
                          alt="Event Banner" 
                          style={{ width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover", display: "block" }} 
                        />
                      </div>
                    ) : (
                      <div className="event-banner-placeholder" style={{ width: "40px", height: "40px", borderRadius: "4px", background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#64748B" }}>
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="admin-name">
                    {event.name}
                  </td>

                  <td>
                    {event.type}
                  </td>

                  <td>
                    {event.venue}
                  </td>

                  <td>
                    {formatDate(event.startDate)}
                  </td>

                  <td>
                    <StatusBadge
                      status={event.status}
                    />
                  </td>

                  <td className="admin-actions">

                    <button
                      className="admin-action-btn admin-view"
                      onClick={() => onView(event)}
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="admin-action-btn admin-edit"
                      onClick={() => onEdit(event)}
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="admin-action-btn admin-delete"
                      onClick={() => onDelete(event)}
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