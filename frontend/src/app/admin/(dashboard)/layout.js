import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

import "./dashboard-layout.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-content">
        <Header />

        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}