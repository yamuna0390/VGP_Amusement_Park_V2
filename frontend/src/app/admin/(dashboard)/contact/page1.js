"use client";

import { useMemo, useState } from "react";

import adminEnquiries from "@/data/adminEnquiries";

import EnquiryTable from "@/components/admin/Enquiries/EnquiryTable";
import EnquiryDetailsModal from "@/components/admin/Enquiries/EnquiryDetailsModal";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState(adminEnquiries);

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enquiry) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        enquiry.name.toLowerCase().includes(keyword) ||
        enquiry.email.toLowerCase().includes(keyword) ||
        enquiry.mobile.toLowerCase().includes(keyword) ||
        enquiry.subject.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        enquiry.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

  function handleView(enquiry) {
    setSelectedEnquiry(enquiry);
    setShowDetails(true);
  }

  function handleStatusChange(id, nextStatus) {
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
            }
          : item
      )
    );
  }

  return (
    <div className="admin-page">

      <div className="page-header">
        <h1>Enquiries</h1>
      </div>

      <div className="page-filters">

        <input
          type="text"
          placeholder="Search name, email, mobile or subject..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>New</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>

      </div>

      <EnquiryTable
        enquiries={filteredEnquiries}
        onView={handleView}
        onStatusChange={handleStatusChange}
      />

      <EnquiryDetailsModal
        isOpen={showDetails}
        enquiry={selectedEnquiry}
        onClose={() => {
          setShowDetails(false);
          setSelectedEnquiry(null);
        }}
      />

    </div>
  );
}