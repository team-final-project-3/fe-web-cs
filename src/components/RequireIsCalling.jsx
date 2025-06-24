// src/middleware/RequireIsCalling.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const RequireIsCalling = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [allowAccess, setAllowAccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkIsCalling = async () => {
      try {
        const res = await api.get("/queue/cs/is-calling");
        if (res.data?.isCalling) {
          setAllowAccess(true); // lanjutkan ke children
        } else {
          setShowModal(true); // tampilkan peringatan dan redirect
        }
      } catch (error) {
        console.error("Gagal cek is-calling:", error);
        setShowModal(true); // jika error, anggap belum memanggil
      } finally {
        setChecking(false);
      }
    };

    checkIsCalling();
  }, []);

  const handleOk = () => {
    navigate("/cs-dashboard");
  };

  if (checking) return null;

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl text-center">
          <h2 className="text-lg font-semibold mb-4 text-orange-600">
            Peringatan
          </h2>
          <p className="mb-6">
            Belum ada antrean yang Anda panggil. Silakan panggil antrean
            terlebih dahulu.
          </p>
          <button
            onClick={handleOk}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return allowAccess ? children : null;
};

export default RequireIsCalling;
