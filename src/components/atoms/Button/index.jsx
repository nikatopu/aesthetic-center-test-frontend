import React from "react";
import "./Button.css";

export const Button = ({ children, variant = "primary", ...props }) => (
  <button className={`btn btn-${variant}`} {...props}>
    {children}
  </button>
);
