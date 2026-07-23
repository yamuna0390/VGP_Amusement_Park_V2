"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { SAMPLE_USERS } from "@/data/users";

import UserTable from "@/components/admin/Users/UserTable";
import UserDetailsModal from "@/components/admin/Users/UserDetailsModal";

import "./users.css";

export default function UsersPage() {

  const [users] = useState(SAMPLE_USERS);

  const [selectedUser, setSelectedUser] = useState(null);

  const handleView = (user) => {
    setSelectedUser(user);
  };

  const handleBlock = (user) => {
    console.log(user);
  };

  const handleExport = () => {
    console.log("Export");
  };

  return (
    <div className="users-page">

      <div className="users-page-header">

        <div>

          <p className="users-page-subtitle"> 
           <b>Manage all registered park customers.</b> 
          </p>

        </div>

        <button
          className="users-export-btn"
          type="button"
          onClick={handleExport}
        >
          <Download size={16} />
          Export
        </button>

      </div>

      <UserTable
        users={users}
        onView={handleView}
        onBlock={handleBlock}
      />

      <UserDetailsModal
        isOpen={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

    </div>
  );
}