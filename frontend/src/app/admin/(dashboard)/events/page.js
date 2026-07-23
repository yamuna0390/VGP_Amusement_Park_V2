"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import eventsData from "@/data/events";

import EventTable from "@/components/admin/Events/EventTable";
import EventDetailsModal from "@/components/admin/Events/EventDetailsModal";
import EventForm from "@/components/admin/Events/EventForm";

export default function EventsPage() {
  const [events, setEvents] = useState(eventsData);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [editingEvent, setEditingEvent] = useState(null);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.id.toLowerCase().includes(search.toLowerCase()) ||
        event.venue.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        type === "All" || event.type === type;

      return matchesSearch && matchesType;
    });
  }, [events, search, type]);

  function handleView(event) {
    setSelectedEvent(event);
    setShowDetails(true);
  }

  function handleAdd() {
    setEditingEvent(null);
    setShowForm(true);
  }

  function handleEdit(event) {
    setEditingEvent(event);
    setShowForm(true);
  }

  function handleDelete(event) {
    const confirmed = window.confirm(
      `Delete "${event.name}"?`
    );

    if (!confirmed) return;

    setEvents((prev) =>
      prev.filter((item) => item.id !== event.id)
    );
  }

  function handleSave(event) {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((item) =>
          item.id === event.id ? event : item
        )
      );
    } else {
      const newEvent = {
        ...event,
        id: `EVT${String(events.length + 1).padStart(3, "0")}`,
        createdDate: new Date()
          .toISOString()
          .split("T")[0],
      };

      setEvents((prev) => [
        newEvent,
        ...prev,
      ]);
    }

    setShowForm(false);
    setEditingEvent(null);
  }

  return (
    <div className="admin-page">

      <div className="page-header">
        <h1>Events</h1>

        <button
          className="btn-primary"
          onClick={handleAdd}
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      <div className="page-filters">

        <input
          type="text"
          placeholder="Search events..."
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
          <option>Live Show</option>
          <option>Magic Show</option>
          <option>Dance Performance</option>
          <option>Music Concert</option>
          <option>Kids Show</option>
          <option>Festival</option>
          <option>Seasonal Event</option>
          <option>Special Event</option>
        </select>

      </div>

      <EventTable
        events={filteredEvents}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EventDetailsModal
        isOpen={showDetails}
        event={selectedEvent}
        onClose={() => {
          setShowDetails(false);
          setSelectedEvent(null);
        }}
      />

      <EventForm
        isOpen={showForm}
        event={editingEvent}
        onClose={() => {
          setShowForm(false);
          setEditingEvent(null);
        }}
        onSave={handleSave}
      />

    </div>
  );
}