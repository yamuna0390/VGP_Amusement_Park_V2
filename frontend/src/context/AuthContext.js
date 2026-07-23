"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ukdUser");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const login = (emailOrPhone, isOp, code) => {
    const newUser = { user: emailOrPhone, operator: isOp, code, ts: Date.now() };
    setUser(newUser);
    try {
      localStorage.setItem("ukdUser", JSON.stringify(newUser));
    } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("ukdUser");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
