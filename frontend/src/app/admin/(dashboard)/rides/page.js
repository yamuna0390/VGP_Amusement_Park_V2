"use client";

import { useEffect, useState } from "react";
import { Plus, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { adminRideService } from "@/services/adminRideService";
import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/AdminTable.css";

export default function AdminRidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const data = await adminRideService.getRides();
      setRides(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (ride) => {
    try {
      const newStatus = ride.status === "Active" ? "Inactive" : "Active";
      const confirmMsg = newStatus === "Inactive" 
        ? `Are you sure you want to disable "${ride.name}"? It will be removed from the public website.`
        : `Are you sure you want to enable "${ride.name}"?`;
        
      if (!window.confirm(confirmMsg)) return;

      await adminRideService.updateRideStatus(ride.id, newStatus);
      fetchRides();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const filteredRides = rides.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.slug && item.slug.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-page">
      <div className="page-filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            <option value="family">Family Rides</option>
            <option value="adult">Adult Rides</option>
            <option value="child">Child Rides</option>
            <option value="water">Water Park</option>
            <option value="zoo">Petting Zoo</option>
          </select>
        </div>

        <Link href="/admin/rides/new" className="btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={18} />
          Add Ride
        </Link>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Ride Name</th>
                <th>Category</th>
                <th>Status</th>
                <th className="admin-text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="admin-empty">Loading rides...</td>
                </tr>
              ) : filteredRides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-empty">No rides found.</td>
                </tr>
              ) : (
                filteredRides.map((ride) => (
                  <tr key={ride.id}>
                    <td className="admin-id">{ride.id}</td>
                    <td>
                      {ride.card_image_url ? (
                        <img 
                          src={ride.card_image_url} 
                          alt={ride.name} 
                          style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <div style={{ width: '60px', height: '40px', backgroundColor: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          🎢
                        </div>
                      )}
                    </td>
                    <td className="admin-name">
                      {ride.name}
                      <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>/{ride.slug}</div>
                    </td>
                    <td><span style={{ textTransform: 'capitalize' }}>{ride.category}</span></td>
                    <td>
                      <StatusBadge status={ride.status} />
                    </td>
                    <td className="admin-actions">
                      <Link
                        href={`/admin/rides/${ride.id}`}
                        className="admin-action-btn admin-view"
                        title="View"
                      >
                        <Eye size={18} />
                      </Link>

                      <Link
                        href={`/admin/rides/${ride.id}/edit`}
                        className="admin-action-btn admin-edit"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        className="admin-action-btn"
                        onClick={() => toggleStatus(ride)}
                        title={ride.status === "Active" ? "Disable Ride" : "Enable Ride"}
                        style={{ color: ride.status === "Active" ? '#e74c3c' : '#27ae60' }}
                      >
                        {ride.status === "Active" ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
