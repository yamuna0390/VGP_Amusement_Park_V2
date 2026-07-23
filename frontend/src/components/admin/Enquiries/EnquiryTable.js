"use client";

import { Eye, ArrowRightCircle } from "lucide-react";
import StatusBadge from "@/components/admin/Common/StatusBadge";
import "@/components/admin/Common/AdminTable.css";
import "./EnquiryTable.css";

export default function EnquiryTable({
  enquiries,
  onView,
  onStatusChange,
}) {
  function getNextStatus(status) {
    switch (status) {
      case "New":
        return "In Progress";
      case "In Progress":
        return "Resolved";
      case "Resolved":
        return "Closed";
      default:
        return null;
    }
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">

        <thead>
          <tr>
            <th>Enquiry ID</th>
            <th>Customer</th>
            <th>Subject</th>
            <th>Received</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          {enquiries.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
                No enquiries found.
              </td>
            </tr>
          ) : (
            enquiries.map((enquiry) => {
              const nextStatus = getNextStatus(enquiry.status);

              return (
                <tr key={enquiry.id}>

                  <td>
                    <span className="admin-id">
                      {enquiry.id}
                    </span>
                  </td>

                  <td>
                    <div className="enquiry-customer">
                      <strong>{enquiry.name}</strong>
                      <small>{enquiry.mobile}</small>
                    </div>
                  </td>

                  <td>
                    <strong>{enquiry.subject}</strong>
                    <small>{enquiry.email}</small>
                  </td>

                  <td>{enquiry.receivedDate}</td>

                  <td>
                    <StatusBadge status={enquiry.status} />
                  </td>

                  <td>

                    <div className="admin-actions">

                      <button
                        className="admin-action-btn admin-view"
                        title="View"
                        onClick={() => onView(enquiry)}
                      >
                        <Eye size={18} />
                      </button>

                      {nextStatus && (
                        <button
                          className="admin-action-btn admin-status"
                          title={`Mark as ${nextStatus}`}
                          onClick={() =>
                            onStatusChange(
                              enquiry.id,
                              nextStatus
                            )
                          }
                        >
                          <ArrowRightCircle size={18} />
                        </button>
                      )}

                    </div>

                  </td>

                </tr>
              );
            })
          )}

        </tbody>

      </table>
    </div>
  );
}