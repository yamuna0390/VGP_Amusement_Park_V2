"use client";

import { useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { usePathname } from "next/navigation";

// Module-level guard flag to prevent multiple simultaneous logout actions
let isLoggingOut = false;

export default function ApiInterceptor() {
  const { showToast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    // Save original fetch
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        // Check for 400 Bad Request
        if (response.status === 400) {
          const clone = response.clone();
          try {
            const data = await clone.json();
            if (data.code === "BOOKING_STEP_INCOMPLETE" && pathname.startsWith("/book")) {
              if (!isLoggingOut) {
                isLoggingOut = true;
                showToast("Your booking session was restarted in another tab. Please start again.");
                setTimeout(() => {
                  window.location.href = "/book";
                }, 1500);
              }
              throw new Error("BOOKING_SESSION_RESTARTED");
            }
          } catch (e) {
            if (e.message === "BOOKING_SESSION_RESTARTED") throw e;
          }
        }

        // Check for 401 Unauthorized
        if (response.status === 401) {
          const clone = response.clone();
          try {
            const data = await clone.json();
            if (data.code === "SESSION_EXPIRED" || data.code === "UNAUTHORIZED" || data.code === "SESSION_NOT_FOUND") {
              if (!isLoggingOut) {
                isLoggingOut = true;
                const isAdmin = pathname.startsWith("/admin");
                const isBooking = pathname.startsWith("/book");

                if (isAdmin) {
                  localStorage.removeItem("adminToken");
                  localStorage.removeItem("adminUser");
                  showToast("Your session has expired. Please log in again.");
                  setTimeout(() => {
                    window.location.href = "/admin/login";
                  }, 1500);
                } else if (isBooking) {
                  showToast("Your booking session has expired. Please start again.");
                  setTimeout(() => {
                    window.location.href = "/book";
                  }, 1500);
                } else {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  showToast("Your session has expired. Please log in again.");
                  setTimeout(() => {
                    window.location.href = "/";
                  }, 1500);
                }
              }
              throw new Error("SESSION_EXPIRED");
            }
          } catch (e) {
            if (e.message === "SESSION_EXPIRED") {
              throw e;
            }
          }
        }

        return response;
      } catch (err) {
        // Re-throw all errors to the original caller
        throw err;
      }
    };

    // Cleanup: restore original fetch on unmount
    return () => {
      window.fetch = originalFetch;
    };
  }, [pathname, showToast]);

  return null;
}
