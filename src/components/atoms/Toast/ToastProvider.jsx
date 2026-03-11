import React, { createContext, useContext, useState, useEffect } from "react";
import "./ToastProvider.css";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const Toast = ({ toast, onRemove }) => {
  const { id, type, message, duration } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <div className={`toast toast--${type}`} onClick={() => onRemove(id)}>
      <div className="toast__icon">{getIcon()}</div>
      <div className="toast__message">{message}</div>
      <button className="toast__close" onClick={() => onRemove(id)}>
        ×
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts((prevToasts) => {
      // Keep only the last 2 toasts and add the new one (max 3)
      const updatedToasts = [...prevToasts.slice(-2), newToast];
      return updatedToasts;
    });
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message, duration) =>
    addToast(message, "success", duration);
  const showError = (message, duration) => addToast(message, "error", duration);
  const showWarning = (message, duration) =>
    addToast(message, "warning", duration);
  const showInfo = (message, duration) => addToast(message, "info", duration);

  // Developer utility for testing toasts (remove in production)
  const testToasts = () => {
    showSuccess("Operation completed successfully!");
    setTimeout(() => showWarning("This is a warning message"), 500);
    setTimeout(() => showError("An error occurred"), 1000);
  };
  // Test deleted services toasts (for development)
  const testDeletedServicesToasts = () => {
    showWarning("Some services from this reservation have been deleted");
    setTimeout(
      () => showError("Failed to load reservation with deleted services"),
      1000,
    );
    setTimeout(() => showSuccess("Reservation cleaned up successfully"), 2000);
  };
  return (
    <ToastContext.Provider
      value={{
        addToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        testToasts, // For testing only
        testDeletedServicesToasts, // For testing deleted services workflow
      }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
