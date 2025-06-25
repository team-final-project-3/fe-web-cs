import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const RouteWithQueueCheck = ({ children }) => {
  const [allowAccess, setAllowAccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkQueue = async () => {
      try {
        const res = await api.get("/queue/cs/handling");

        if (res.data?.id === null) {
          // ✅ Tidak sedang menangani antrean
          setAllowAccess(true);
        } else {
          // ❌ Sedang menangani antrean
          setShowWarning(true);
        }
      } catch (error) {
        console.error("Gagal mengecek antrean aktif:", error);
      } finally {
        setChecking(false);
      }
    };

    checkQueue();
  }, []);

  if (checking) return null; // atau tampilkan spinner

  if (showWarning) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl text-center">
          <h2 className="text-lg font-semibold mb-4 text-orange-600">
            PERINGATAN
          </h2>
          <p className="mb-6">
            Masih terdapat antrean yang <strong>BELUM ANDA SELESAIKAN</strong>.
            Mohon selesaikan terlebih dahulu.
          </p>
          <button
            onClick={() => navigate("/cs-detail-layanan")}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return allowAccess ? children : null;
};

export default RouteWithQueueCheck;
