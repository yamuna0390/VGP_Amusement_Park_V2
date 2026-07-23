"use client";

import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/AdminTable.css";
import "./FoodItemTable.css";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

function FoodTypeBadge({ type }) {
  const badgeClass =
    type === "Veg"
      ? "food-type-veg"
      : type === "Non-Veg"
      ? "food-type-nonveg"
      : "food-type-mixed";

  return (
    <span className={`food-type-badge ${badgeClass}`}>
      {type}
    </span>
  );
}

function AvailabilityBadge({ availability }) {
  const badgeClass =
    availability === "Available"
      ? "food-available"
      : "food-unavailable";

  return (
    <span className={`food-availability ${badgeClass}`}>
      {availability}
    </span>
  );
}

export default function FoodItemTable({
  foodItems,
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
              <th>Food Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Type</th>
              <th>Availability</th>
              <th>Status</th>
              <th className="admin-text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {foodItems.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="admin-empty"
                >
                  No food items found.
                </td>
              </tr>
            ) : (
              foodItems.map((item) => (
                <tr key={item.id}>

                  <td className="admin-id">
                    {item.id}
                  </td>

                  <td>
                    <div className="food-image-placeholder">
                      🍔
                    </div>
                  </td>

                  <td className="admin-name">
                    {item.name}
                  </td>

                  <td>
                    {item.category}
                  </td>

                  <td className="admin-amount">
                    ₹{item.price.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <FoodTypeBadge
                      type={item.type}
                    />
                  </td>

                  <td>
                    <AvailabilityBadge
                      availability={item.availability}
                    />
                  </td>

                  <td>
                    <StatusBadge
                      status={item.status}
                    />
                  </td>

                  <td className="admin-actions">

                    <button
                      className="admin-action-btn admin-view"
                      onClick={() => onView(item)}
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="admin-action-btn admin-edit"
                      onClick={() => onEdit(item)}
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="admin-action-btn admin-delete"
                      onClick={() => onDelete(item)}
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