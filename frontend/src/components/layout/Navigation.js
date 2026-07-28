"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import UserDropdown from "./UserDropdown";

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const { user, logout } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const toggleDrawer = (state) => setDrawerOpen(state);

  const handleLogout = () => {
    logout();
    router.push("/");
    alert("Logged out successfully.");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Rides", href: "/rides" },
    { name: "Restaurant", href: "/restaurant" },
    { name: "Group", href: "/group" },
    { name: "Offers", href: "/offers" },
    { name: "Parks", href: "/parks" },
  ];

  return (
    <>
      <nav aria-label="Primary navigation">
        <div className="nav-inner">
          <Link href="/" className="logo" id="nav-logo">
            <img
              className="logo-img"
              src="/assets/ukd_logo_t.png"
              alt="VGP Universal Kingdom — Family Amusement Park"
            />
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
              id={`nav-${link.name.toLowerCase()}`}
            >
              {link.name}
            </Link>
          ))}

          <Link href="/book" className="btn-book" id="nav-book-btn">
            🎟️ Book Now
          </Link>

          {user ? (
            <UserDropdown user={user} logout={logout} />
          ) : (
            <button
              className="btn-login"
              id="nav-login-btn"
              onClick={() => {
                setIsRegister(false);
                setAuthOpen(true);
              }}
            >
              👤 Login
            </button>
          )}

          <button
            className="hamburger"
            id="nav-hamburger"
            onClick={() => toggleDrawer(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`overlay ${drawerOpen ? "show" : ""}`}
        onClick={() => toggleDrawer(false)}
      ></div>

      {/* Drawer */}
      <div className={`drawer ${drawerOpen ? "open" : ""}`} id="drawer">
        <button
          className="close"
          onClick={() => toggleDrawer(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        <Link href="/" onClick={() => toggleDrawer(false)}>
          🏰 Home
        </Link>

        <Link href="/rides" onClick={() => toggleDrawer(false)}>
          🎢 Rides
        </Link>

        <Link href="/restaurant" onClick={() => toggleDrawer(false)}>
          🍽️ Restaurant
        </Link>

        <Link href="/group" onClick={() => toggleDrawer(false)}>
          🚌 Group
        </Link>

        <Link href="/offers" onClick={() => toggleDrawer(false)}>
          🎁 Offers
        </Link>

        <Link href="/parks" onClick={() => toggleDrawer(false)}>
          🌴 Parks
        </Link>

        <Link href="/book" onClick={() => toggleDrawer(false)}>
          🎟️ Book Now
        </Link>

        {user ? (
          <>
            <div className="drawer-user-info" style={{ padding: "11px 14px", color: "#fff", fontWeight: "800", fontSize: "1.1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "8px" }}>
              👤 {user.fullName}
            </div>
            <Link href="/profile" onClick={() => toggleDrawer(false)}>
              👤 My Profile
            </Link>
            <Link href="/profile/bookings" onClick={() => toggleDrawer(false)}>
              🎟️ My Bookings
            </Link>
            <a
              onClick={() => {
                toggleDrawer(false);
                handleLogout();
              }}
              style={{ cursor: "pointer", color: "#ff8fa3" }}
            >
              🚪 Logout
            </a>
          </>
        ) : (
          <a
            onClick={() => {
              toggleDrawer(false);
              setIsRegister(false);
              setAuthOpen(true);
            }}
            style={{ cursor: "pointer" }}
          >
            🔑 Login
          </a>
        )}

        <Link href="/contact" onClick={() => toggleDrawer(false)}>
          📞 Contact Us
        </Link>

        <Link href="/events" onClick={() => toggleDrawer(false)}>
          🎪 Events
        </Link>

        <Link href="/banquet" onClick={() => toggleDrawer(false)}>
          💒 Banquet Hall — Sea Thru
        </Link>

        <Link href="/stay" onClick={() => toggleDrawer(false)}>
          🛏️ Stay — Room Bookings
        </Link>

        <Link href="/awards" onClick={() => toggleDrawer(false)}>
          🏆 Awards
        </Link>

        <Link href="/operator" onClick={() => toggleDrawer(false)}>
          🧳 Tour Operator&apos;s Login
        </Link>

        <Link href="/about" onClick={() => toggleDrawer(false)}>
          👑 About Us
        </Link>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
    </>
  );
}