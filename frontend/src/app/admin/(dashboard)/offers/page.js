"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import adminOffersData from "@/data/adminOffers";

import OfferTable from "@/components/admin/Offers/OfferTable";
import OfferDetailsModal from "@/components/admin/Offers/OfferDetailsModal";
import OfferForm from "@/components/admin/Offers/OfferForm";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState(adminOffersData);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const [selectedOffer, setSelectedOffer] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [editingOffer, setEditingOffer] = useState(null);

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

  function handleDelete(offer) {
    const confirmed = window.confirm(
      `Delete "${offer.name}"?`
    );

    if (!confirmed) return;

    setOffers((prev) =>
      prev.filter((item) => item.id !== offer.id)
    );
  }

  function handleSave(offer) {
    if (editingOffer) {
      setOffers((prev) =>
        prev.map((item) =>
          item.id === offer.id ? offer : item
        )
      );
    } else {
      const newOffer = {
        ...offer,
        id: `OFF${String(offers.length + 1).padStart(3, "0")}`,
        createdDate: new Date()
          .toISOString()
          .split("T")[0],
      };

      setOffers((prev) => [
        newOffer,
        ...prev,
      ]);
    }

    setShowForm(false);
    setEditingOffer(null);
  }

  return (
    <div className="admin-page">

      <div className="page-header">

        <h1>Admin Offers</h1>

        <button
          className="btn-primary"
          onClick={handleAdd}
        >
          <Plus size={18} />
          Add Offer
        </button>

      </div>

      <div className="page-filters">

        <input
          type="text"
          placeholder="Search offer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option>All</option>
          <option>2-Day Pass</option>
          <option>Family Package</option>
          <option>Seasonal</option>
          <option>Birthday Offer</option>
          <option>Student Offer</option>
          <option>Group Package</option>
          <option>Weekend Offer</option>
          <option>Advance Booking</option>
          <option>Premium</option>
          <option>Festival Offer</option>
        </select>

      </div>

      <OfferTable
        offers={filteredOffers}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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