"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminBookingService } from "@/services/adminBookingService";
import "../bookings.css";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await adminBookingService.getBookingDetails(id);
        setBooking(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const handleDownloadTicket = async () => {
    try {
      setDownloading(true);
      await adminBookingService.downloadTicketPdf(id, booking.booking_number);
    } catch (err) {
      alert("Failed to download ticket PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="admin-bookings-container"><div className="loading-state">Loading booking details...</div></div>;
  }

  if (error) {
    return (
      <div className="admin-bookings-container">
        <div className="loading-state" style={{color: 'red'}}>{error}</div>
        <Link href="/admin/bookings" className="action-btn">Back to Bookings</Link>
      </div>
    );
  }

  if (!booking) return null;

  const tickets = booking.items ? booking.items.filter(item => item.item_type === 'TICKET') : [];
  const foodAddons = booking.items ? booking.items.filter(item => item.item_type === 'MEAL' || item.item_type === 'ADDON') : [];

  const payments = booking.payments || [];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const fmt = (val) => `₹${Number(val || 0).toFixed(2)}`;

  return (
    <div className="admin-bookings-container">
      <div className="bookings-header">
        <h1>Booking Details: {booking.booking_number}</h1>
        <Link href="/admin/bookings" className="action-btn" style={{backgroundColor: '#6c757d'}}>
          Back to List
        </Link>
      </div>

      <div className="booking-details-container">

        <div className="details-grid">
          {/* Customer Info */}
          <div className="details-card">
            <h3>Customer Information</h3>
            <div className="detail-row">
              <span className="detail-label">Name</span>
              <span className="detail-value">{booking.guest_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{booking.guest_email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Mobile</span>
              <span className="detail-value">{booking.guest_mobile}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">User ID</span>
              <span className="detail-value">{booking.user_id || 'Guest'}</span>
            </div>
          </div>

          {/* Visit Info */}
          <div className="details-card">
            <h3>Visit Information</h3>
            <div className="detail-row">
              <span className="detail-label">Visit Date</span>
              <span className="detail-value">{new Date(booking.visit_date).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Booking No</span>
              <span className="detail-value">{booking.booking_number}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Invoice No</span>
              <span className="detail-value">{booking.invoice_number || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Booking Status</span>
              <span className="detail-value">
                <span className={`status-badge ${booking.booking_status.toLowerCase()}`}>
                  {booking.booking_status}
                </span>
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Created At</span>
              <span className="detail-value">{formatDate(booking.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          {/* Ticket Info */}
          <div className="details-card" style={{gridColumn: '1 / -1'}}>
            <h3>Tickets</h3>
            {tickets.length > 0 ? (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id}>
                      <td>{ticket.item_name}</td>
                      <td>{ticket.quantity}</td>
                      <td>{fmt(ticket.unit_price)}</td>
                      <td>{fmt(ticket.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No tickets found.</p>
            )}
          </div>
        </div>

        <div className="details-grid">
          {/* Food Info */}
          <div className="details-card">
            <h3>Food & Add-ons</h3>
            {foodAddons.length > 0 ? (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {foodAddons.map(food => (
                    <tr key={food.id}>
                      <td>{food.item_name}</td>
                      <td>{food.quantity}</td>
                      <td>{fmt(food.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No food or add-ons.</p>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="details-card">
            <h3>Pricing Summary</h3>
            <div className="detail-row">
              <span className="detail-label">Ticket Subtotal</span>
              <span className="detail-value">{fmt(booking.ticket_subtotal)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Food Subtotal</span>
              <span className="detail-value">{fmt(booking.meal_subtotal)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Discounts</span>
              <span className="detail-value" style={{color: '#2e7d32'}}>-{fmt(booking.total_discount)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Taxes</span>
              <span className="detail-value">{fmt(booking.total_tax)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Convenience Fee</span>
              <span className="detail-value">{fmt(booking.convenience_fee)}</span>
            </div>
            <hr style={{borderTop: '1px dashed #eee', margin: '10px 0'}} />
            <div className="detail-row" style={{fontSize: '1.1rem'}}>
              <span className="detail-label" style={{color: '#5e35b1', fontWeight: 800}}>Grand Total</span>
              <span className="detail-value" style={{color: '#5e35b1', fontWeight: 800}}>{fmt(booking.grand_total)}</span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          {/* Payment Info */}
          <div className="details-card">
            <h3>Payment Information</h3>
            <div className="detail-row">
              <span className="detail-label">Booking Payment Status</span>
              <span className="detail-value">
                <span className={`status-badge ${booking.payment_status.toLowerCase()}`}>
                  {booking.payment_status}
                </span>
              </span>
            </div>

            <hr style={{borderTop: '1px dashed #eee', margin: '15px 0'}} />
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Payment Attempts: {payments.length}</h4>

            {payments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {payments.map((payment, index) => {
                  const reconStatus = payment.reconciliation_status || 'NONE';
                  return (
                    <div key={payment.id || index} style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
                      <strong style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Attempt {index + 1}</strong>

                      <div className="detail-row" style={{ marginBottom: '4px' }}>
                        <span className="detail-label" style={{ fontSize: '0.9rem' }}>Payment Status</span>
                        <span className="detail-value" style={{ fontSize: '0.9rem' }}>{payment.payment_status}</span>
                      </div>

                      <div className="detail-row" style={{ marginBottom: '4px' }}>
                        <span className="detail-label" style={{ fontSize: '0.9rem' }}>Reconciliation Status</span>
                        <span className="detail-value" style={{
                          fontSize: '0.9rem',
                          color: reconStatus !== 'NONE' ? '#fb2020' : 'inherit'
                        }}>
                          {reconStatus}
                        </span>
                      </div>

                      <div className="detail-row" style={{ marginBottom: '4px' }}>
                        <span className="detail-label" style={{ fontSize: '0.9rem' }}>Gateway Payment ID</span>
                        <span className="detail-value" style={{ fontSize: '0.9rem' }}>{payment.gateway_payment_id || 'N/A'}</span>
                      </div>

                      <div className="detail-row" style={{ marginBottom: '4px' }}>
                        <span className="detail-label" style={{ fontSize: '0.9rem' }}>Paid At</span>
                        <span className="detail-value" style={{ fontSize: '0.9rem' }}>{formatDate(payment.paid_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No payment information found.</p>
            )}
          </div>

          {/* QR & Documents */}
          <div className="details-card">
            <h3>QR & Documents</h3>
            <div className="detail-row">
              <span className="detail-label">QR Token Status</span>
              <span className="detail-value">
                {booking.has_qr ? (
                  <span style={{color: '#2e7d32', fontWeight: 600}}>Available (Masked)</span>
                ) : (
                  <span style={{color: '#c62828'}}>Not Generated</span>
                )}
              </span>
            </div>

            <div className="documents-section">
              <button
                className="doc-btn"
                onClick={handleDownloadTicket}
                disabled={!booking.has_qr || downloading}
                style={{opacity: (!booking.has_qr || downloading) ? 0.5 : 1}}
              >
                {downloading ? 'Downloading...' : 'Download Ticket PDF'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
