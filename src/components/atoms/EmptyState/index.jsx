import React from "react";
import { NavLink } from "react-router-dom";

export const EmptyState = ({ message, linkText, linkTo }) => (
  <div
    style={{
      textAlign: "center",
      padding: "40px",
      background: "#fff",
      border: "1px dashed #ccc",
      borderRadius: "8px",
    }}
  >
    <p style={{ color: "#666" }}>{message}</p>
    {linkTo && (
      <NavLink
        to={linkTo}
        style={{ color: "var(--primary)", fontWeight: "bold" }}
      >
        {linkText}
      </NavLink>
    )}
  </div>
);
