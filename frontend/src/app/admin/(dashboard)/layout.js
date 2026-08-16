"use client";

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import "./dashboard-layout.css";

export default function DashboardLayout({ children }) {
  const { user } = useAdminAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Determine auth state instantly from localStorage to avoid redirect loops
    const token = localStorage.getItem("adminToken");
    const storedUserStr = localStorage.getItem("adminUser");

    if (!token || !storedUserStr) {
      router.replace("/admin/login");
      return;
    }

    try {
      const storedUser = JSON.parse(storedUserStr);
      if (storedUser.role !== "admin") {
        router.replace("/"); // Redirect unauthorized non-admins to public home
        return;
      }
      // If we reach here, user is valid and is an admin
      setIsAuthorized(true);
    } catch (e) {
      console.error("Invalid user data in localStorage");
      router.replace("/admin/login");
    }
  }, [router]); // We don't depend on `user` context here because it initializes as null on first render

  // Do not render protected content prematurely
  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f6f8" }}>
        Loading Admin Dashboard...
      </div>
    );
  }

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