"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserDropdown({ user, logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogoutClick = () => {
    logout();
    setIsOpen(false);
    router.push("/");
    alert("Logged out successfully.");
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  // Get the first name to display in the header (e.g. Maya)
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "Customer";

  return (
    <div className="user-dropdown-wrapper" ref={dropdownRef} data-open={isOpen}>
      <button 
        className="btn-login user-dropdown-btn" 
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        👤 {firstName} <span className="arrow">▼</span>
      </button>

      {isOpen && (
        <div className="user-dropdown-menu">
          <Link 
            href="/profile" 
            className="user-dropdown-item"
            onClick={handleItemClick}
          >
            👤 My Profile
          </Link>
          <hr className="user-dropdown-divider" />
          <button 
            onClick={handleLogoutClick} 
            className="user-dropdown-item logout-btn"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
