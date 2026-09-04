"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  FerrisWheel,
  Ticket,
  UtensilsCrossed,
  BadgePercent,
  CalendarDays,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  BookOpenCheck,
  Star
} from "lucide-react";

import "./Sidebar.css";

export default function Sidebar() {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: BookOpenCheck,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Rides",
      href: "/admin/rides",
      icon: FerrisWheel,
    },
    {
      name: "Ticket Types",
      href: "/admin/ticket-types",
      icon: Ticket,
    },
    {
      name: "Add-ons",
      href: "/admin/food-items",
      icon: UtensilsCrossed,
    },
    {
      name: "Offers",
      href: "/admin/offers",
      icon: BadgePercent,
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: CalendarDays,
    },
    {
      name: "Media",
      href: "/admin/media",
      icon: ImageIcon,
    },
    {
      name: "Contact",
      href: "/admin/contact",
      icon: MessageSquare,
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
    },
    {
      name: "Reviews",
      href: "/admin/reviews",
      icon: Star,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-top">
        <Image
          src="/images/ukdlogo-1.png"
          alt="VGP Logo"
          width={80}
          height={80}
        />

        <h2>VGP Universal Kingdom</h2>

        <p>Admin Portal</p>
      </div>

      <nav className="sidebar-menu">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}