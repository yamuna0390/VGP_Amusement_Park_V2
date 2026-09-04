"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { adminMessageService } from "@/services/adminMessageService";

import EnquiryTable from "@/components/admin/Enquiries/EnquiryTable";
import EnquiryDetailsModal from "@/components/admin/Enquiries/EnquiryDetailsModal";

function MessagesPageContent() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const searchParams = useSearchParams();
  const highlightType = searchParams.get("type");
  const highlightRefId = searchParams.get("id");

  const highlightedId = useMemo(() => {
    if (!highlightType || !highlightRefId) return null;
    if (highlightType === "GROUP_QUOTE") return `GQ-${highlightRefId}`;
    if (highlightType === "OPERATOR_ENQUIRY") return `OE-${highlightRefId}`;
    return null;
  }, [highlightType, highlightRefId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await adminMessageService.getMessages();
        setMessages(data || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!loading && highlightedId && messages.length > 0) {
      setTimeout(() => {
        const row = document.getElementById(`message-row-${highlightedId}`);
        if (row) {
          row.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [loading, highlightedId, messages]);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        (msg.name || "").toLowerCase().includes(keyword) ||
        (msg.email || "").toLowerCase().includes(keyword) ||
        (msg.mobile || "").toLowerCase().includes(keyword) ||
        (msg.subject || "").toLowerCase().includes(keyword);

      const matchesType =
        typeFilter === "All" ||
        msg.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [messages, search, typeFilter]);

  function handleView(msg) {
    setSelectedMessage(msg);
    setShowDetails(true);
  }

  function handleStatusChange(id, nextStatus) {
    setMessages((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: nextStatus }
          : item
      )
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Messages & Enquiries</h1>
      </div>

      <div className="page-filters">
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Group Quote">Group Quote</option>
          <option value="Operator Enquiry">Operator Enquiry</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: "20px" }}>Loading messages...</div>
      ) : (
        <EnquiryTable
          enquiries={filteredMessages}
          onView={handleView}
          onStatusChange={handleStatusChange}
          showType={true}
          highlightedId={highlightedId}
        />
      )}

      <EnquiryDetailsModal
        isOpen={showDetails}
        enquiry={selectedMessage}
        onClose={() => {
          setShowDetails(false);
          setSelectedMessage(null);
        }}
      />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div style={{ padding: "20px" }}>Loading page...</div>}>
      <MessagesPageContent />
    </Suspense>
  );
}
