"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminBookingService } from "@/services/adminBookingService";
import "./bookings.css";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: "",
    visit_date: "",
    payment_status: "",
    booking_status: "",
    created_date: ""
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await adminBookingService.getBookings(params);
      setBookings(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [pagination.page]); // Refetch when page changes

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBookings();
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      visit_date: "",
      payment_status: "",
      booking_status: "",
      created_date: ""
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Run fetchBookings on clear filters (handled by a separate useEffect or just trigger manually)
  // To keep it simple, we'll just wait for the user to click apply or we can trigger it.
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="admin-bookings-container">
      <div className="bookings-header">
        <h1>Booking Management</h1>
      </div>

      <div className="bookings-filters">
        <div className="filter-group">
          <label>Search (Name, Mobile, Email, Booking/Inv #)</label>
          <input 
            type="text" 
            name="search" 
            value={filters.search} 
            onChange={handleFilterChange}
            placeholder="Search..."
          />
        </div>
        <div className="filter-group">
          <label>Visit Date</label>
          <input 
            type="date" 
            name="visit_date" 
            value={filters.visit_date} 
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label>Payment Status</label>
          <select name="payment_status" value={filters.payment_status} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Booking Status</label>
          <select name="booking_status" value={filters.booking_status} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        <div className="filter-group" style={{ flexDirection: "row", alignItems: "flex-end", gap: "10px" }}>
          <button className="action-btn" onClick={applyFilters}>Apply Filters</button>
          <button className="action-btn" style={{backgroundColor: '#6c757d'}} onClick={handleClearFilters}>Clear</button>
        </div>
      </div>

      <div className="bookings-table-container">
        {loading ? (
          <div className="loading-state">Loading bookings...</div>
        ) : error ? (
          <div className="loading-state" style={{color: 'red'}}>{error}</div>
        ) : bookings.length === 0 ? (
          <div className="loading-state">No bookings found matching your criteria.</div>
        ) : (
          <>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking No.</th>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Visit Date</th>
                  <th>Grand Total</th>
                  <th>Payment Status</th>
                  <th>Booking Status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>
                      <div><strong>{booking.booking_number}</strong></div>
                      {booking.invoice_number && <div style={{fontSize: '0.8rem', color: '#666'}}>{booking.invoice_number}</div>}
                    </td>
                    <td>{booking.guest_name}</td>
                    <td>{booking.guest_mobile}</td>
                    <td>{formatDate(booking.visit_date)}</td>
                    <td>₹{Number(booking.grand_total).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${booking.payment_status.toLowerCase()}`}>
                        {booking.payment_status}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${booking.booking_status.toLowerCase()}`}>
                        {booking.booking_status}
                      </span>
                    </td>
                    <td>{formatDate(booking.created_at)}</td>
                    <td>
                      <Link href={`/admin/bookings/${booking.id}`} className="action-btn">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="pagination">
              <div>
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </div>
              <div className="pagination-controls">
                <button 
                  className="pagination-btn" 
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({...prev, page: prev.page - 1}))}
                >
                  Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button 
                  className="pagination-btn" 
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination(prev => ({...prev, page: prev.page + 1}))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
