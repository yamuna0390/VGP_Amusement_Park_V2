"use client";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthModal.css";

export default function AuthModal({
  isOpen,
  onClose,
  isRegister,
  setIsRegister,
}) {
  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="auth-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="auth-header">
          <h2>
            {isRegister
              ? "Create Your Account"
              : "Welcome"}
          </h2>

          {!isRegister && (
            <p>VGP Universal Kingdom</p>
          )}
        </div>

        <div className="auth-body">
          {isRegister ? (
            <RegisterForm
              switchToLogin={() => setIsRegister(false)}
            />
          ) : (
            <LoginForm
              switchToRegister={() => setIsRegister(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}