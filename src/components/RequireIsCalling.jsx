import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const RequireIsCalling = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [modalType, setModalType] = useState(null); // null | "not-finished" | "not-called"

  useEffect(() => {
    const checkCallingStatus = async () => {
      try {
        const resCalling = await api.get("/queue/cs/called-customer");

        if (resCalling.data?.isCalling) {
          setChecking(false); // Lolos akses
          return;
        }

        // Jika belum memanggil, cek apakah ada antrean yang sedang ditangani
        const resHandling = await api.get("/queue/cs/handling");

        if (resHandling.data?.status === "in progress") {
          setModalType("not-finished");
        } else {
          setModalType("not-called");
        }
      } catch (err) {
        console.error("Gagal memeriksa status antrean:", err);
        setModalType("not-called"); // fallback
      } finally {
        setChecking(false);
      }
    };

    checkCallingStatus();
  }, []);

  const handleRedirectToDashboard = () => {
    navigate("/cs-dashboard");
  };

  if (checking) return null;

  if (modalType === "not-finished") {
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
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  if (modalType === "not-called") {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl text-center">
          <h2 className="text-lg font-semibold mb-4 text-orange-600">
            PERINGATAN
          </h2>
          <p className="mb-6">
            Belum ada antrean yang anda panggil. Silakan panggil antrean
            terlebih dahulu.
          </p>
          <button
            onClick={handleRedirectToDashboard}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireIsCalling;
