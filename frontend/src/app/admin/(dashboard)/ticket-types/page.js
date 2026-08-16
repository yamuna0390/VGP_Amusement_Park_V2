"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Search, CheckCircle, XCircle } from "lucide-react";
import { adminTicketTypeService } from "@/services/adminTicketTypeService";
import { fmt } from "@/utils/bookingCalc";
import "./ticket-types.css";

export default function TicketTypesPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await adminTicketTypeService.getTickets({
        search,
        status: statusFilter
      });
      setTickets(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [search, statusFilter]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const confirmed = confirm(`Are you sure you want to change this ticket to ${newStatus}?`);
    if (!confirmed) return;

    try {
      await adminTicketTypeService.updateTicketStatus(id, newStatus);
      fetchTickets();
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ticket Types</h1>
          <p className="text-gray-500">Manage park admission tickets</p>
        </div>
        <Link href="/admin/ticket-types/new" className="admin-btn-primary bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> Add Ticket
        </Link>
      </div>

      <div className="admin-table-controls flex gap-4 mb-4">
        <div className="search-box flex items-center border rounded-lg px-3 py-2 bg-white flex-1">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-select border rounded-lg px-3 py-2 bg-white outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {error && <div className="admin-error-box bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      <div className="admin-table-container overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="admin-table w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Ticket Name</th>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Category</th>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Price</th>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Status</th>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">Loading tickets...</td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">No tickets found.</td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-semibold text-gray-800">{t.name}</div>
                    <div className="text-xs text-gray-500">Order: {t.display_order}</div>
                  </td>
                  <td className="p-3 text-gray-600">{t.code}</td>
                  <td className="p-3 font-bold text-gray-800">{fmt(t.price)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <Link href={`/admin/ticket-types/${t.id}/edit`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
                        <Edit size={16} /> Edit
                      </Link>
                      <button
                        onClick={() => toggleStatus(t.id, t.status)}
                        className={`flex items-center gap-1 text-sm font-medium ${t.status === "Active" ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                        title={t.status === "Active" ? "Disable" : "Enable"}
                      >
                        {t.status === "Active" ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        {t.status === "Active" ? "Disable" : "Enable"}
                      </button>
                    </div>
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