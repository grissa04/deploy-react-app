import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // If no token, redirect to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, reason: "member_required" }}
      />
    );
  }

  // Otherwise, show the protected page
  return children;
}
