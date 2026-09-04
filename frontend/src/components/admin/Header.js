"use client";

import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminNotificationService } from "@/services/adminNotificationService";

import "./Header.css";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const unreadCountRef = useRef(unreadCount);

  useEffect(() => {
    unreadCountRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    // Only fetch if we are actually in the admin panel and user is logged in
    if (user) {
      loadNotifications();

      const interval = setInterval(async () => {
        try {
          const newCount = await adminNotificationService.getUnreadCount();
          if (newCount !== null && newCount !== unreadCountRef.current) {
            loadNotifications();
          }
        } catch (error) {
          console.error("Error polling unread count", error);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await adminNotificationService.getNotifications();
      setNotifications(data || []);
      const count = data.filter(n => !n.isRead).length;
      setUnreadCount(count);
    } catch (error) {
      console.error("Error loading notifications", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await adminNotificationService.markAsRead(notification.id);
        
        // Optimistic update
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }

    // Close the notifications menu
    setShowNotifications(false);

    // Preserve metadata for future exact-message navigation
    const queryParams = new URLSearchParams();
    if (notification.type) queryParams.append("type", notification.type);
    
    const refId = notification.reference_id || notification.referenceId;
    if (refId) queryParams.append("id", refId);
    
    // Redirect to messages page
    const queryString = queryParams.toString();
    router.push(`/admin/messages${queryString ? `?${queryString}` : ""}`);
  };

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
      "/admin/bookings": "Bookings",
    };

    return titles[pathname] || "Admin";
  }, [pathname]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatNotificationTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1>{pageTitle}</h1>
        <p>{today}</p>
      </div>

      <div className="header-right">
        
        <div className="notification-wrapper">
          <button 
            className="notification-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMenu(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-menu">
              <div className="notification-menu-header">
                Notifications
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-title">
                        {notification.title}
                        {!notification.isRead && <span className="notification-new-badge">NEW</span>}
                      </div>
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      <div className="notification-time">
                        Received: {formatNotificationTime(notification.createdAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="notification-empty">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="profile-wrapper">
          <button
            className="profile-btn"
            onClick={() => {
              setShowMenu(!showMenu);
              setShowNotifications(false);
            }}
          >
            <div className="profile-avatar">
              <User size={18} />
            </div>

            <div className="profile-info">
              <strong>{user?.fullName || "Administrator"}</strong>
              <small>{user?.email || "admin@vgp.com"}</small>
            </div>

            <ChevronDown size={18} />
          </button>

          {showMenu && (
            <div className="profile-menu">
              <button>
                <User size={16} />
                My Profile
              </button>

              <button className="logout" onClick={handleLogout}>
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