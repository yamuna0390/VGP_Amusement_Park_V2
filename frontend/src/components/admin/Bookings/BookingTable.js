"use client";

import {
  Eye,
  Printer,
  Ban,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CalendarX,
} from "lucide-react";

import StatusBadge from "@/components/admin/Common/StatusBadge";

import "@/components/admin/Common/AdminTable.css";
import "./BookingTable.css";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return "—";

  const d = new Date(dateStr + "T00:00:00");

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SortIcon({ column, sortConfig }) {
  if (sortConfig.key !== column) {
    return <ArrowUpDown size={13} className="bt-sort-icon" />;
  }

  return sortConfig.direction === "asc" ? (
    <ArrowUp size={13} className="bt-sort-icon bt-sort-active" />
  ) : (
    <ArrowDown size={13} className="bt-sort-icon bt-sort-active" />
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function BookingTable({
  bookings,
  sortConfig,
  onSort,
  onView,
  onPrint,
  onCancel,
}) {
  if (bookings.length === 0) {
    return (
      <div className="bt-empty-state">
        <CalendarX size={60} className="bt-empty-icon" />
        <h3>No bookings found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  function isCancelDisabled(booking) {
    return (
      booking.bookingStatus === "Cancelled" ||
      booking.bookingStatus === "Completed"
    );
  }

  return (
    <div className="admin-table-card">
      <div className="admin-table-scroll">

        <table className="admin-table">

          {/* Head */}

          <thead>
            <tr>
              <th
                className="bt-th-sortable"
                onClick={() => onSort("id")}
              >
                Booking ID
                <SortIcon
                  column="id"
                  sortConfig={sortConfig}
                />
              </th>

              <th
                className="bt-th-sortable"
                onClick={() => onSort("bookingDate")}
              >
                Booking Date
                <SortIcon
                  column="bookingDate"
                  sortConfig={sortConfig}
                />
              </th>

              <th
                className="bt-th-sortable"
                onClick={() => onSort("visitDate")}
              >
                Visit Date
                <SortIcon
                  column="visitDate"
                  sortConfig={sortConfig}
                />
              </th>

              <th>Ticket Type</th>

              <th className="admin-text-center">
                Qty
              </th>

              <th
                className="bt-th-sortable"
                onClick={() => onSort("totalAmount")}
              >
                Total Amount
                <SortIcon
                  column="totalAmount"
                  sortConfig={sortConfig}
                />
              </th>

              <th>Payment</th>

              <th>Status</th>

              <th className="admin-text-center">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="admin-id">
                  {booking.id}
                </td>

                <td>
                  {formatDate(booking.bookingDate)}
                </td>

                <td>
                  {formatDate(booking.visitDate)}
                </td>

                <td className="bt-ticket-type">
                  {booking.ticketType}
                </td>
                <td className="admin-text-center">
                  {booking.quantity}
                </td>

                <td className="admin-amount">
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </td>

                <td>
                  <StatusBadge
                    status={booking.paymentStatus}
                  />
                </td>

                <td>
                  <StatusBadge
                    status={booking.bookingStatus}
                  />
                </td>

                <td>
                  <div className="admin-actions">

                    <button
                      className="admin-action-btn admin-view"
                      onClick={() => onView(booking)}
                      title="View Booking"
                      type="button"
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      className="admin-action-btn admin-print"
                      onClick={() => onPrint(booking)}
                      title="Print Ticket"
                      type="button"
                    >
                      <Printer size={15} />
                    </button>

                    <button
                      className="admin-action-btn admin-delete"
                      onClick={() => onCancel(booking)}
                      title={
                        isCancelDisabled(booking)
                          ? `Cannot cancel — booking already ${booking.bookingStatus.toLowerCase()}`
                          : "Cancel Booking"
                      }
                      disabled={isCancelDisabled(booking)}
                      type="button"
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