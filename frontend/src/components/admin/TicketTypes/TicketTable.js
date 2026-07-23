"use client";

import "./TicketTable.css";
import { Pencil, Trash2 } from "lucide-react";
const tickets = [
  {
    id: 1,
    name: "Adult",
    category: "Regular",
    price: 950,
    status: "Active",
  },
  {
    id: 2,
    name: "Child",
    category: "Regular",
    price: 750,
    status: "Active",
  },
  {
    id: 3,
    name: "Senior Citizen",
    category: "Special",
    price: 650,
    status: "Active",
  },
  {
    id: 4,
    name: "School Group",
    category: "Group",
    price: 600,
    status: "Inactive",
  },
];

export default function TicketTable() {
  return (
    <div className="table-card">

      <table className="ticket-table">

        <thead>
          <tr>
            <th>Ticket Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {tickets.map((ticket) => (

            <tr key={ticket.id}>

              <td>{ticket.name}</td>

              <td>{ticket.category}</td>

              <td>₹ {ticket.price}</td>

              <td>
                <span
                  className={
                    ticket.status === "Active"
                      ? "status active"
                      : "status inactive"
                  }
                >
                  {ticket.status}
                </span>
              </td>

          <td>
  <button className="edit-btn" title="Edit Ticket">
    <Pencil size={18} />
  </button>

  <button className="delete-btn" title="Delete Ticket">
    <Trash2 size={18} />
  </button>
</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}