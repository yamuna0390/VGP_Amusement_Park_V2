"use client";

import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import "./Header.css";

export default function Header() {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  const pageTitle = useMemo(() => {
    const titles = {
      "/admin/dashboard": "Dashboard",
      "/admin/users": "Users",
      "/admin/attractions": "Attractions",
      "/admin/ticket-types": "Ticket Types",
      "/admin/food-items": "Food Items",
      "/admin/offers": "Offers",
      "/admin/events": "Events",
      "/admin/gallery": "Gallery",
      "/admin/contact": "Contact",
      "/admin/settings": "Settings",
    };

    return titles[pathname] || "Admin";
  }, [pathname]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1>{pageTitle}</h1>
        <p>{today}</p>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="profile-wrapper">
          <button
            className="profile-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="profile-avatar">
              <User size={18} />
            </div>

            <div className="profile-info">
              <strong>Administrator</strong>
              <small>admin@vgp.com</small>
            </div>

            <ChevronDown size={18} />
          </button>

          {showMenu && (
            <div className="profile-menu">
              <button>
                <User size={16} />
                My Profile
              </button>

              <button className="logout">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}