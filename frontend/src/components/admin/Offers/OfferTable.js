"use client";

import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/AdminTable.css";
import "./OfferTable.css";

import { Eye, Pencil, Trash2 } from "lucide-react";

function getOfferStatus(offer) {
  if (!offer.enabled) return "Inactive";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(offer.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(offer.endDate);
  end.setHours(23, 59, 59, 999);

  if (today < start) return "Scheduled";
  if (today > end) return "Expired";

  return "Active";
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price) {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

export default function OfferTable({
  offers,
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
              <th>Code</th>
              <th>Offer Name</th>
              <th>Type</th>
              <th>Adult Price</th>
              <th>Child Price</th>
              <th>Validity</th>
              <th>Status</th>
              <th className="admin-text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {offers.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-empty">
                  No offers found.
                </td>
              </tr>
            ) : (
              offers.map((offer) => (
                <tr key={offer.id}>

                  <td className="admin-id">
                    {offer.code}
                  </td>

                  <td className="admin-name">
                    {offer.name}
                  </td>

                  <td>{offer.type}</td>

                  <td>{formatPrice(offer.adultPrice)}</td>

                  <td>{formatPrice(offer.childPrice)}</td>

                  <td>
                    {formatDate(offer.startDate)}
                    <br />
                    <small>
                      to {formatDate(offer.endDate)}
                    </small>
                  </td>

                  <td>
                    <StatusBadge
                      status={getOfferStatus(offer)}
                    />
                  </td>

                  <td className="admin-actions">

                    <button
                      className="admin-action-btn admin-view"
                      onClick={() => onView(offer)}
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="admin-action-btn admin-edit"
                      onClick={() => onEdit(offer)}
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="admin-action-btn admin-delete"
                      onClick={() => onDelete(offer)}
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