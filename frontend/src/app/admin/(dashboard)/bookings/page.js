"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Download, CheckCircle, XCircle } from "lucide-react";

import { SAMPLE_BOOKINGS } from "@/data/bookings";
import SearchBar from "@/components/admin/Bookings/SearchBar";
import FilterBar from "@/components/admin/Bookings/FilterBar";
import BookingTable from "@/components/admin/Bookings/BookingTable";
import BookingDetailsModal from "@/components/admin/Bookings/BookingDetailsModal";
import Modal from "@/components/admin/Common/Modal";
import Pagination from "@/components/admin/Common/Pagination";

import "./bookings.css";

const ITEMS_PER_PAGE = 10;

/* ─── Initial State Shapes ────────────────────────────────────────────────── */

const INITIAL_APPLIED_FILTERS = {
  bookingStatus: "",
  paymentStatus: "",
  visitDateFrom: "",
  visitDateTo: "",
};

const INITIAL_SORT = {
  key: "bookingDate",
  direction: "desc",
};

/* ─── Page Component ─────────────────────────────────────────────────────── */

export default function BookingsPage() {

  /* ── Data ─────────────────────────────────────────────────────────────── */
  // Future: replace SAMPLE_BOOKINGS with → GET /api/admin/bookings
  const [bookings, setBookings] = useState(SAMPLE_BOOKINGS);

  /* ── Search (live) ────────────────────────────────────────────────────── */
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Applied Filters (committed on Apply/Reset) ───────────────────────── */
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_APPLIED_FILTERS);

  /* ── Sorting ──────────────────────────────────────────────────────────── */
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT);

  /* ── Pagination ───────────────────────────────────────────────────────── */
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Modals ───────────────────────────────────────────────────────────── */
  const [viewBooking, setViewBooking] = useState(null);    // booking object | null
  const [cancelBooking, setCancelBooking] = useState(null); // booking object | null

  /* ── Toast ────────────────────────────────────────────────────────────── */
  const [toast, setToast] = useState(null); // { type: "success"|"error"|"info", message }

  /* Auto-dismiss toast after 3.5 s */
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  /* ── Sort Handler ─────────────────────────────────────────────────────── */
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  /* ── Search Handler ───────────────────────────────────────────────────── */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  /* ── Filter Handlers ──────────────────────────────────────────────────── */
  const handleFilterApply = useCallback((filters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleFilterReset = useCallback(() => {
    setAppliedFilters(INITIAL_APPLIED_FILTERS);
    setCurrentPage(1);
  }, []);

  /* ── Cancel Booking ───────────────────────────────────────────────────── */
  const handleCancelConfirm = useCallback(() => {
    if (!cancelBooking) return;

    // Future: PATCH /api/admin/bookings/:id  { bookingStatus: "Cancelled" }
    setBookings((prev) =>
      prev.map((b) =>
        b.id === cancelBooking.id
          ? { ...b, bookingStatus: "Cancelled" }
          : b
      )
    );
    setCancelBooking(null);
    setToast({ type: "success", message: "Booking cancelled successfully." });
  }, [cancelBooking]);

  /* ── Print Ticket ─────────────────────────────────────────────────────── */
  const handlePrint = useCallback((booking) => {
    // Future: GET /api/admin/bookings/:id/ticket  → generate PDF
    setToast({ type: "success", message: `Ticket for ${booking.id} printed successfully.` });
  }, []);

  /* ── Export ───────────────────────────────────────────────────────────── */
  const handleExport = useCallback(() => {
    // Future: GET /api/admin/bookings/export?format=csv
    setToast({ type: "info", message: "Export feature coming soon." });
  }, []);

  /* ── Derived: Filtered → Sorted → Paginated ───────────────────────────── */
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // 1. Live search (Booking ID, Customer Name, Mobile, Email)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.mobile.includes(q) ||
          b.email.toLowerCase().includes(q)
      );
    }

    // 2. Booking Status filter
    if (appliedFilters.bookingStatus) {
      result = result.filter(
        (b) => b.bookingStatus === appliedFilters.bookingStatus
      );
    }

    // 3. Payment Status filter
    if (appliedFilters.paymentStatus) {
      result = result.filter(
        (b) => b.paymentStatus === appliedFilters.paymentStatus
      );
    }

    // 4. Visit Date — From
    if (appliedFilters.visitDateFrom) {
      result = result.filter(
        (b) => b.visitDate >= appliedFilters.visitDateFrom
      );
    }

    // 5. Visit Date — To
    if (appliedFilters.visitDateTo) {
      result = result.filter(
        (b) => b.visitDate <= appliedFilters.visitDateTo
      );
    }

    // Future: Booking Date range filters plug in here with no architecture changes.

    // 6. Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key] ?? "";
        let bVal = b[sortConfig.key] ?? "";
        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [bookings, searchQuery, appliedFilters, sortConfig]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="bookings-page">

      {/* ── Toast Notification ─────────────────────────────────────────── */}
      {toast && (
        <div className={`bookings-toast bookings-toast-${toast.type}`}>
          {toast.type === "error"
            ? <XCircle size={17} />
            : <CheckCircle size={17} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="bookings-page-header">
        <div>
          {/* <h1 className="bookings-page-title">Ticket Bookings</h1> */}
          <p className="bookings-page-sub"> <b> Manage all  park ticket bookings.</b>
          </p>
        </div>

        <button
          type="button"
          className="bookings-export-btn"
          onClick={handleExport}
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div className="bookings-toolbar">
        <SearchBar value={searchQuery} onChange={handleSearch} />
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <FilterBar onApply={handleFilterApply} onReset={handleFilterReset} />

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <BookingTable
        bookings={paginatedBookings}
        sortConfig={sortConfig}
        onSort={handleSort}
        onView={setViewBooking}
        onPrint={handlePrint}
        onCancel={setCancelBooking}
      />

      {/* ── Pagination ─────────────────────────────────────────────────── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredBookings.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        label="bookings"
      />

      {/* ── View Booking Modal ──────────────────────────────────────────── */}
      <BookingDetailsModal
        isOpen={!!viewBooking}
        booking={viewBooking}
        onClose={() => setViewBooking(null)}
      />

      {/* ── Cancel Confirmation Modal (reuses existing Common/Modal) ─────── */}
      <Modal
        isOpen={!!cancelBooking}
        title="Cancel Booking"
        onClose={() => setCancelBooking(null)}
      >
        <div className="bookings-confirm-body">
          <p className="bookings-confirm-message">
            Are you sure you want to cancel booking{" "}
            <strong>{cancelBooking?.id}</strong>?
          </p>
          <p className="bookings-confirm-warning">
            This action cannot be undone.
          </p>
          <div className="bookings-confirm-actions">
            <button
              type="button"
              className="bookings-confirm-secondary"
              onClick={() => setCancelBooking(null)}
            >
              Keep Booking
            </button>
            <button
              type="button"
              className="bookings-confirm-danger"
              onClick={handleCancelConfirm}
            >
              Yes, Cancel Booking
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
