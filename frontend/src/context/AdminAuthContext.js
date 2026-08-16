"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("adminUser");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);

    try {
      localStorage.setItem("adminUser", JSON.stringify(userData));
      localStorage.setItem("adminToken", token);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    setUser(null);

    try {
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
    } catch (error) {
      console.error(error);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem("adminUser", JSON.stringify(userData));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
