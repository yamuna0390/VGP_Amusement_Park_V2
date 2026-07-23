"use client";

import {
  Eye,
  Ban,
} from "lucide-react";

import "./UserTable.css";

function formatDate(dateStr) {
  if (!dateStr) return "—";

  const d = new Date(dateStr + "T00:00:00");

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  return (
    <span
      className={
        status === "Active"
          ? "ut-badge ut-badge-green"
          : "ut-badge ut-badge-red"
      }
    >
      {status}
    </span>
  );
}

export default function UserTable({
  users,
  onView,
  onBlock,
}) {
  if (!users.length) {
    return (
      <div className="ut-empty-state">
        <h3>No users found</h3>
        <p>No customer records available.</p>
      </div>
    );
  }

  return (
    <div className="ut-card">
      <div className="ut-scroll-wrapper">

        <table className="ut-table">

          <thead>
            <tr>
              <th>User ID</th>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Total Bookings</th>
              <th>Last Visit</th>
              <th>Status</th>
              <th className="ut-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user.id}>

                <td className="ut-user-id">
                  {user.id}
                </td>

                <td className="ut-user-name">
                  {user.name}
                </td>

                <td>
                  {user.mobile}
                </td>

                <td className="ut-center">
                  {user.totalBookings}
                </td>

                <td>
                  {formatDate(user.lastVisit)}
                </td>

                <td>
                  <StatusBadge status={user.status} />
                </td>

                <td>

                  <div className="ut-action-group">

                    <button
                      className="ut-action-btn ut-btn-view"
                      type="button"
                      title="View User"
                      onClick={() => onView?.(user)}
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      className="ut-action-btn ut-btn-block"
                      type="button"
                      title={
                        user.status === "Blocked"
                          ? "Unblock User"
                          : "Block User"
                      }
                      onClick={() => onBlock?.(user)}
                    >
                      <Ban size={15} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}