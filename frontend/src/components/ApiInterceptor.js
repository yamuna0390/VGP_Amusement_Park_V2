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

        // Check for 401 Unauthorized
        if (response.status === 401) {
          // Clone the response to read JSON without consuming it for the caller
          const clone = response.clone();
          try {
            const data = await clone.json();

            // Check if it's our session expired / unauthorized code
            if (data.code === "SESSION_EXPIRED" || data.code === "UNAUTHORIZED") {
              // Prevent multiple redirects and toasts
              if (!isLoggingOut) {
                isLoggingOut = true;

                const isAdmin = pathname.startsWith("/admin");

                if (isAdmin) {
                  localStorage.removeItem("adminToken");
                  localStorage.removeItem("adminUser");
                  showToast("Your session has expired. Please log in again.");
                  setTimeout(() => {
                    window.location.href = "/admin/login";
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

              // Reject the original request with a controlled error
              throw new Error("SESSION_EXPIRED");
            }
          } catch (e) {
            // Re-throw if it's our SESSION_EXPIRED error
            if (e.message === "SESSION_EXPIRED") {
              throw e;
            }
            // Not a JSON response or failed to parse, proceed normally
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
