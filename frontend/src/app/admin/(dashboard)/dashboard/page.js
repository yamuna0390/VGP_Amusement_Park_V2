"use client";

import { useEffect, useState } from "react";
import {
  IndianRupee,
  Users,
  Calendar,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

import StatCard from "@/components/admin/Dashboard/StatCard";
import { adminDashboardService } from "@/services/adminDashboardService";
import { fmt } from "@/utils/bookingCalc";
import "./dashboard.css";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await adminDashboardService.getDashboard();
      setData(dashboardData);
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Activity size={48} className="animate-spin mb-4" />
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <AlertCircle size={40} className="mx-auto mb-2" />
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  if (!data) return null;

  const { overview, upcomingVisits, bookingStats, revenue } = data;
  const todayStr = new Date().toLocaleDateString("en-IN", { dateStyle: "long" });

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Today — {todayStr}</p>
      </div>

      {/* SECTION 1: TODAY'S OVERVIEW */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Today's Overview</h2>
        <div className="dashboard-grid-5">
          <StatCard
            title="Bookings"
            value={overview.bookingsToday}
            color="#3b82f6"
            icon={<Calendar size={30} />}
          />
          <StatCard
            title="Visitors"
            value={overview.visitorsToday}
            color="#ea580c"
            icon={<Users size={30} />}
          />
          <StatCard
            title="Revenue"
            value={fmt(overview.revenueToday)}
            color="#16a34a"
            icon={<IndianRupee size={30} />}
          />
          <StatCard
            title="Success Payments"
            value={overview.successfulPayments}
            color="#10b981"
            icon={<CheckCircle size={30} />}
          />
          <StatCard
            title="Pending/Failed"
            value={overview.pendingFailedPayments}
            color="#ef4444"
            icon={<XCircle size={30} />}
          />
        </div>
      </section>

      {/* SECTION 2: UPCOMING VISITS */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Upcoming Visits (Next 7 Days)</h2>
        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Bookings</th>
                <th>Visitors</th>
                <th>Expected Revenue</th>
              </tr>
            </thead>
            <tbody>
              {upcomingVisits && upcomingVisits.length > 0 ? (
                upcomingVisits.map((day, idx) => (
                  <tr key={idx}>
                    <td>
                      {new Date(day.date).toLocaleDateString("en-IN", {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </td>
                    <td>{day.bookings}</td>
                    <td>{day.visitors}</td>
                    <td>{fmt(day.expectedRevenue)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "#6b7280" }}>
                    No upcoming visits found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: BOOKING STATISTICS */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Booking Statistics</h2>
        <div className="dashboard-stats-compact">
          <div className="stat-compact-item">
            <div className="stat-compact-label">Total</div>
            <div className="stat-compact-value">{bookingStats.total}</div>
          </div>
          <div className="stat-compact-item">
            <div className="stat-compact-label" style={{ color: '#16a34a' }}>Confirmed</div>
            <div className="stat-compact-value">{bookingStats.confirmed}</div>
          </div>
          <div className="stat-compact-item">
            <div className="stat-compact-label" style={{ color: '#eab308' }}>Pending</div>
            <div className="stat-compact-value">{bookingStats.pending}</div>
          </div>
          <div className="stat-compact-item">
            <div className="stat-compact-label" style={{ color: '#6b7280' }}>Cancelled</div>
            <div className="stat-compact-value">{bookingStats.cancelled}</div>
          </div>
          <div className="stat-compact-item">
            <div className="stat-compact-label" style={{ color: '#ef4444' }}>Failed</div>
            <div className="stat-compact-value">{bookingStats.failed}</div>
          </div>
        </div>
      </section>

      {/* SECTION 4: REVENUE SUMMARY */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Revenue Summary</h2>
        <div className="dashboard-grid-3">
          <StatCard
            title="Today"
            value={fmt(revenue.today)}
            color="#0ea5e9"
            icon={<TrendingUp size={30} />}
          />
          <StatCard
            title="This Week"
            value={fmt(revenue.thisWeek)}
            color="#8b5cf6"
            icon={<Calendar size={30} />}
          />
          <StatCard
            title="This Month"
            value={fmt(revenue.thisMonth)}
            color="#f59e0b"
            icon={<CreditCard size={30} />}
          />
        </div>
      </section>

    </div>
  );
}