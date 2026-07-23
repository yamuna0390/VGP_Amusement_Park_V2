"use client";

import adminSettings from "@/data/adminSettings";
import SettingsForm from "@/components/admin/Settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>
            Manage park information, ticket pricing, branding and system
            configuration.
          </p>
        </div>
      </div>

      <SettingsForm settings={adminSettings} />

    </div>
  );
}