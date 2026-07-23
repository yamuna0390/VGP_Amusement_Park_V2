"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import adminPayments from "@/data/adminPayments";

import PaymentTable from "@/components/admin/Payments/PaymentTable";
import PaymentDetailsModal from "@/components/admin/Payments/PaymentDetailsModal";

export default function PaymentsPage() {
  const [payments, setPayments] = useState(adminPayments);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.customerName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        payment.bookingId
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        payment.id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" ||
        payment.paymentMethod === methodFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod
      );
    });
  }, [payments, search, statusFilter, methodFilter]);

  function handleView(payment) {
    setSelectedPayment(payment);
    setShowDetails(true);
  }

  function handleRefund(payment) {
    if (
      payment.status === "Refunded" ||
      payment.status === "Partially Refunded"
    ) {
      alert("Payment has already been refunded.");
      return;
    }

    if (
      window.confirm(
        `Refund payment ${payment.id}?`
      )
    ) {
      setPayments((prev) =>
        prev.map((item) =>
          item.id === payment.id
            ? {
                ...item,
                status: "Refunded",
                refundAmount: item.amount,
              }
            : item
        )
      );
    }
  }

  function handleDelete(payment) {
    if (
      window.confirm(
        `Delete payment ${payment.id}?`
      )
    ) {
      setPayments((prev) =>
        prev.filter((item) => item.id !== payment.id)
      );
    }
  }

  function handleExport() {
    alert("Export functionality will be connected to the backend.");
  }

  return (
    <div className="admin-page">

      <div className="page-header">
        <h1>Payments</h1>

        <button
          className="btn-primary"
          onClick={handleExport}
        >
          <Download size={18} />
          Export
        </button>
      </div>

      <div className="page-filters">

        <input
          type="text"
          placeholder="Search customer, booking or payment..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Failed</option>
          <option>Refunded</option>
          <option>Partially Refunded</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) =>
            setMethodFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>UPI</option>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>Net Banking</option>
          <option>Cash</option>
          <option>Wallet</option>
        </select>

      </div>

      <PaymentTable
        payments={filteredPayments}
        onView={handleView}
        onRefund={handleRefund}
        onDelete={handleDelete}
      />

      <PaymentDetailsModal
        isOpen={showDetails}
        payment={selectedPayment}
        onClose={() => {
          setShowDetails(false);
          setSelectedPayment(null);
        }}
      />

    </div>
  );
}