import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const RequireHandlingQueue = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [allow, setAllow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkHandling = async () => {
      try {
        const res = await api.get("/queue/cs/handling");

        // Jika tidak ada antrean yang sedang dikerjakan (semua null)
        if (!res.data?.id) {
          setShowModal(true);
        } else {
          setAllow(true); // boleh masuk
        }
      } catch (error) {
        console.error("Gagal mengecek antrean:", error);
      } finally {
        setChecking(false);
      }
    };

    checkHandling();
  }, []);

  const handleRedirect = () => {
    navigate("/cs-dashboard");
  };

  if (checking) return null;

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl text-center">
          <h2 className="text-lg font-semibold mb-4 text-red-600">
            PERINGATAN
          </h2>
          <p className="mb-1">Tidak antrean yang sedang anda kerjakan</p>
          <p className="mb-6">Anda akan dialihkan kembali ke Dashboard Home</p>
          <button
            onClick={handleRedirect}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return allow ? children : null;
};

export default RequireHandlingQueue;
