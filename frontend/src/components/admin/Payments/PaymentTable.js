"use client";

import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/AdminTable.css";
import "./PaymentTable.css";

import { Eye, RotateCcw, Trash2 } from "lucide-react";

function formatPrice(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PaymentTable({
  payments,
  onView,
  onRefund,
  onDelete,
}) {
  return (
    <div className="admin-table-card">
      <div className="admin-table-scroll">
        <table className="admin-table">

          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Booking</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
              <th className="admin-text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-empty">
                  No payment records found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>

                  <td className="admin-id">
                    {payment.id}
                  </td>

                  <td>
                    <strong>{payment.bookingId}</strong>
                    <small>{payment.transactionId}</small>
                  </td>

                  <td>
                    <div className="payment-customer">
                      <strong>{payment.customerName}</strong>
                      <small>{payment.mobile}</small>
                    </div>
                  </td>

                  <td>
                    {formatPrice(payment.amount)}
                  </td>

                  <td>
                    {payment.paymentMethod}
                  </td>

                  <td>
                    {formatDate(payment.paymentDate)}
                  </td>

                  <td>
                    <StatusBadge
                      status={payment.status}
                    />
                  </td>

                  <td className="admin-actions">

                    <button
                      className="admin-action-btn admin-view"
                      title="View"
                      onClick={() => onView(payment)}
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="admin-action-btn admin-edit"
                      title="Refund"
                      onClick={() => onRefund(payment)}
                    >
                      <RotateCcw size={18} />
                    </button>

                    <button
                      className="admin-action-btn admin-delete"
                      title="Delete"
                      onClick={() => onDelete(payment)}
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