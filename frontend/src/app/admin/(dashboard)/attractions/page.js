"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import attractionsData from "@/data/attractions";

import AttractionTable from "@/components/admin/Attractions/AttractionTable";
import AttractionDetailsModal from "@/components/admin/Attractions/AttractionDetailsModal";
import AttractionForm from "@/components/admin/Attractions/AttractionForm";

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState(attractionsData);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [selectedAttraction, setSelectedAttraction] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [editingAttraction, setEditingAttraction] = useState(null);

  const filteredAttractions = useMemo(() => {
    return attractions.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [attractions, search, category]);

  function handleView(attraction) {
    setSelectedAttraction(attraction);
    setShowDetails(true);
  }

  function handleAdd() {
    setEditingAttraction(null);
    setShowForm(true);
  }

  function handleEdit(attraction) {
    setEditingAttraction(attraction);
    setShowForm(true);
  }

  function handleDelete(attraction) {
    const ok = window.confirm(
      `Delete "${attraction.name}" ?`
    );

    if (!ok) return;

    setAttractions((prev) =>
      prev.filter((item) => item.id !== attraction.id)
    );
  }

  function handleSave(attraction) {
    if (editingAttraction) {
      setAttractions((prev) =>
        prev.map((item) =>
          item.id === attraction.id ? attraction : item
        )
      );
    } else {
      const newAttraction = {
        ...attraction,
        id: `ATR${String(attractions.length + 1).padStart(3, "0")}`,
        createdDate: new Date().toISOString().split("T")[0],
      };

      setAttractions((prev) => [
        newAttraction,
        ...prev,
      ]);
    }

    setShowForm(false);
    setEditingAttraction(null);
  }

  return (
    <div className="admin-page">

     <div className="page-filters">

  <div className="filter-left">

    <input
      type="text"
      placeholder="Search attraction..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />

    <select
      value={category}
      onChange={(e) =>
        setCategory(e.target.value)
      }
    >
      <option>All</option>
      <option>Thrill Ride</option>
      <option>Family Ride</option>
      <option>Kids Ride</option>
      <option>Water Ride</option>
      <option>Indoor Attraction</option>
    </select>

  </div>

  <button
    className="btn-primary"
    onClick={handleAdd}
  >
    <Plus size={18} />
    Add Attraction
  </button>

</div>

      <AttractionTable
        attractions={filteredAttractions}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AttractionDetailsModal
        isOpen={showDetails}
        attraction={selectedAttraction}
        onClose={() => {
          setShowDetails(false);
          setSelectedAttraction(null);
        }}
      />

      <AttractionForm
        isOpen={showForm}
        attraction={editingAttraction}
        onClose={() => {
          setShowForm(false);
          setEditingAttraction(null);
        }}
        onSave={handleSave}
      />

    </div>
  );
}