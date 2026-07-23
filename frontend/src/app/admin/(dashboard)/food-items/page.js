"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import foodItemsData from "@/data/foodItems";

import FoodItemTable from "@/components/admin/FoodItems/FoodItemTable";
import FoodItemDetailsModal from "@/components/admin/FoodItems/FoodItemDetailsModal";
import FoodItemForm from "@/components/admin/FoodItems/FoodItemForm";

export default function FoodItemsPage() {
  const [foodItems, setFoodItems] = useState(foodItemsData);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [selectedFoodItem, setSelectedFoodItem] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [editingFoodItem, setEditingFoodItem] = useState(null);

  const filteredFoodItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [foodItems, search, category]);

  function handleView(item) {
    setSelectedFoodItem(item);
    setShowDetails(true);
  }

  function handleAdd() {
    setEditingFoodItem(null);
    setShowForm(true);
  }

  function handleEdit(item) {
    setEditingFoodItem(item);
    setShowForm(true);
  }

  function handleDelete(item) {
    const ok = window.confirm(
      `Delete "${item.name}" ?`
    );

    if (!ok) return;

    setFoodItems((prev) =>
      prev.filter((food) => food.id !== item.id)
    );
  }

  function handleSave(item) {
    if (editingFoodItem) {
      setFoodItems((prev) =>
        prev.map((food) =>
          food.id === item.id ? item : food
        )
      );
    } else {
      const newFoodItem = {
        ...item,
        id: `FD${String(foodItems.length + 1).padStart(3, "0")}`,
        createdDate: new Date()
          .toISOString()
          .split("T")[0],
      };

      setFoodItems((prev) => [
        newFoodItem,
        ...prev,
      ]);
    }

    setShowForm(false);
    setEditingFoodItem(null);
  }

  return (
    <div className="admin-page">
<div className="page-filters">

  <div className="filter-left">

    <input
      type="text"
      placeholder="Search food item..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      <option>All</option>
      <option>Fast Food</option>
      <option>Snacks</option>
      <option>Beverages</option>
      <option>Ice Cream</option>
      <option>Meals</option>
    </select>

  </div>

  <button
    className="btn-primary"
    onClick={handleAdd}
  >
    <Plus size={18} />
    Add Food Item
  </button>

</div>

      <FoodItemTable
        foodItems={filteredFoodItems}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FoodItemDetailsModal
        isOpen={showDetails}
        foodItem={selectedFoodItem}
        onClose={() => {
          setShowDetails(false);
          setSelectedFoodItem(null);
        }}
      />

      <FoodItemForm
        isOpen={showForm}
        foodItem={editingFoodItem}
        onClose={() => {
          setShowForm(false);
          setEditingFoodItem(null);
        }}
        onSave={handleSave}
      />

    </div>
  );
}