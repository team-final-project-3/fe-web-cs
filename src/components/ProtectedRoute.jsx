import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import isTokenExpired from "../utils/isTokenExpired";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [statusChecked, setStatusChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    if (isTokenExpired(token)) {
      navigate("/session-expired", { replace: true });
      return;
    }

    setStatusChecked(true);
  }, [navigate]);

  // Jangan render apa pun sampai statusChecked selesai, kaladihapus console jadi rame eror pas session expired
  if (!statusChecked) return null;

  return children;
};

export default ProtectedRoute;
