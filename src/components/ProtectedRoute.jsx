import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Jika tidak ada token, redirect ke halaman login
  if (!token || !role) {
    return <Navigate to="/" replace />;
  }

  // Jika token ada, tampilkan halaman yang di-protect
  return children;
};

export default ProtectedRoute;
