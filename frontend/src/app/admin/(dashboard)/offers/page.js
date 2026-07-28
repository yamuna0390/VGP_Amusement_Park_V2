"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus } from "lucide-react";

import OfferTable from "@/components/admin/Offers/OfferTable";
import OfferDetailsModal from "@/components/admin/Offers/OfferDetailsModal";
import OfferForm from "@/components/admin/Offers/OfferForm";

// Helper to map DB offers to the frontend format expected by components
function mapDbOfferToFrontend(o) {
  return {
    id: o.id,
    name: o.offer_name,
    code: o.offer_code,
    type: o.offer_rule === "BOGO" ? "Birthday Offer" : (o.offer_rule === "B2G1" ? "Group Package" : "Seasonal"),
    description: o.description || `Database promotional offer with rule ${o.offer_rule}`,
    adultPrice: o.offer_rule === "BOGO" ? 0 : Math.max(0, 828.75 - Number(o.discount_value)),
    adultSaving: o.offer_rule === "BOGO" ? 828.75 : Number(o.discount_value),
    childPrice: o.offer_rule === "BOGO" ? 0 : Math.max(0, 648.55 - Number(o.discount_value)),
    childSaving: o.offer_rule === "BOGO" ? 648.55 : Number(o.discount_value),
    startDate: new Date(o.valid_from).toISOString().split("T")[0],
    endDate: new Date(o.valid_to).toISOString().split("T")[0],
    enabled: o.status === "Active",
    createdDate: new Date(o.created_at || new Date()).toISOString().split("T")[0],
    // keep raw DB fields for form editing
    raw: o
  };
}

// Helper to map frontend form inputs back to DB fields
function mapFrontendOfferToDb(f) {
  return {
    offer_name: f.name,
    offer_code: f.code,
    discount_type: f.type === "Birthday Offer" || f.type === "Group Package" ? "Flat" : "Percentage",
    discount_value: f.adultSaving || 0,
    minimum_amount: 0,
    valid_from: f.startDate,
    valid_to: f.endDate,
    status: f.enabled ? "Active" : "Inactive",
    offer_rule: f.type === "Birthday Offer" ? "BOGO" : (f.type === "Group Package" ? "B2G1" : "PERCENTAGE"),
    applicable_tickets: f.type === "Birthday Offer" || f.type === "Group Package" 
      ? "adult,child,senior,student" 
      : "adult,child,senior",
    min_qty: f.type === "Group Package" ? 2 : 1,
    free_qty: 1,
    priority: f.type === "Birthday Offer" ? 4 : (f.type === "Group Package" ? 7 : 1)
  };
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Fetch offers on load
  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/offers");
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch offers.");
      }
      const mapped = (result.data || []).map(mapDbOfferToFrontend);
      setOffers(mapped);
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
        offer.name.toLowerCase().includes(search.toLowerCase()) ||
        offer.code.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        type === "All" || offer.type === type;

      return matchesSearch && matchesType;
    });
  }, [offers, search, type]);

  function handleView(offer) {
    setSelectedOffer(offer);
    setShowDetails(true);
  }

  function handleAdd() {
    setEditingOffer(null);
    setShowForm(true);
  }

  function handleEdit(offer) {
    setEditingOffer(offer);
    setShowForm(true);
  }

  async function handleDelete(offer) {
    const confirmed = window.confirm(`Delete "${offer.name}"?`);
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/offers/${offer.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed.");
      }
      loadOffers();
    } catch (err) {
      alert("Error deleting offer: " + err.message);
    }
  }

  async function handleSave(offerInput) {
    try {
      const token = localStorage.getItem("token");
      const dbPayload = mapFrontendOfferToDb(offerInput);
      
      let url = "http://localhost:5000/api/offers";
      let method = "POST";

      if (editingOffer) {
        url = `http://localhost:5000/api/offers/${editingOffer.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dbPayload)
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Save failed.");
      }

      setShowForm(false);
      setEditingOffer(null);
      loadOffers();
    } catch (err) {
      alert("Error saving offer: " + err.message);
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Offers</h1>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={18} />
          Add Offer
        </button>
      </div>

      <div className="page-filters">
        <input
          type="text"
          placeholder="Search offer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>All</option>
          <option>Birthday Offer</option>
          <option>Group Package</option>
          <option>Seasonal</option>
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", fontWeight: "bold", padding: "40px" }}>Loading offers from database...</p>
      ) : error ? (
        <p style={{ color: "red", textAlign: "center", fontWeight: "bold", padding: "20px" }}>Error: {error}</p>
      ) : (
        <OfferTable
          offers={filteredOffers}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <OfferDetailsModal
        isOpen={showDetails}
        offer={selectedOffer}
        onClose={() => {
          setShowDetails(false);
          setSelectedOffer(null);
        }}
      />

      <OfferForm
        isOpen={showForm}
        offer={editingOffer}
        onClose={() => {
          setShowForm(false);
          setEditingOffer(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}