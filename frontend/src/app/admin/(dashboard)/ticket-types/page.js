"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import "./ticket-types.css";
import TicketForm from "@/components/admin/TicketTypes/TicketForm";
import TicketTable from "@/components/admin/TicketTypes/TicketTable";
import Modal from "@/components/admin/Common/Modal";

export default function TicketTypesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="ticket-types-page">

      <div className="page-header">
        <div>
        
          <p><b>Manage amusement park ticket types.</b></p>
        </div>

        <button
          className="add-ticket-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add Ticket Type</span>
        </button>
      </div>

      <TicketTable />

      <Modal
        isOpen={isModalOpen}
        title="Add Ticket Type"
        onClose={() => setIsModalOpen(false)}
      >
       <TicketForm onCancel={() => setIsModalOpen(false)} />
      </Modal>

    </div>
  );
}