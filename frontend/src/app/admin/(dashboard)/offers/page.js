"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminOfferService } from "@/services/adminOfferService";
import StatusBadge from "@/components/admin/Common/StatusBadge";

export default function AdminOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await adminOfferService.getOffers();
      setOffers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesSearch =
        offer.offer_name.toLowerCase().includes(search.toLowerCase()) ||
        (offer.offer_code || "").toLowerCase().includes(search.toLowerCase());

      const matchesType =
        type === "All" || offer.promotion_type === type;

      return matchesSearch && matchesType;
    });
  }, [offers, search, type]);

  async function handleToggleStatus(offer) {
    const newStatus = offer.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await adminOfferService.updateOfferStatus(offer.id, newStatus);
      setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Offers</h1>
        <button className="btn-primary" onClick={() => router.push('/admin/offers/new')}>
          <Plus size={18} />
          Add Offer
        </button>
      </div>

      <div className="page-filters">
        <input
          type="text"
          placeholder="Search name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="PERCENTAGE">PERCENTAGE</option>
          <option value="FLAT">FLAT</option>
          <option value="BUY_X_GET_Y">BUY X GET Y</option>
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", fontWeight: "bold", padding: "40px" }}>Loading offers from database...</p>
      ) : error ? (
        <p style={{ color: "red", textAlign: "center", fontWeight: "bold", padding: "20px" }}>Error: {error}</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Offer Name</th>
                <th>Code</th>
                <th>Promotion Type</th>
                <th>Validity</th>
                <th>Status</th>
                <th className="admin-text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-empty">No offers found.</td>
                </tr>
              ) : (
                filteredOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="admin-id">{offer.id}</td>
                    <td className="admin-name">
                      {offer.offer_name}
                    </td>
                    <td><span className="admin-pill" style={{backgroundColor: '#eee', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace'}}>{offer.offer_code || 'NONE'}</span></td>
                    <td>{offer.promotion_type}</td>
                    <td style={{ fontSize: '13px', color: '#555' }}>
                      {new Date(offer.valid_from).toLocaleDateString()} to {new Date(offer.valid_to).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={offer.status} />
                    </td>
                    <td className="admin-actions">
                      <button 
                        className="btn-secondary btn-sm" 
                        onClick={() => router.push(`/admin/offers/${offer.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button 
                        className={offer.status === 'Active' ? 'btn-danger btn-sm' : 'btn-secondary btn-sm'} 
                        onClick={() => handleToggleStatus(offer)}
                      >
                        {offer.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}