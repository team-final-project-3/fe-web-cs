import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const CheckCallingStatus = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  useEffect(() => {
    const checkCalling = async () => {
      try {
        const res = await api.get("/queue/cs/called-customer");

        if (res.data?.isCalling) {
          setTicketNumber(res.data.ticketNumber);
          setShowModal(true);
          setChecking(false); // ✅ Tambahkan agar modal bisa tampil
        } else {
          setChecking(false);
        }
      } catch (err) {
        console.error("Gagal cek status antrean:", err);
        setChecking(false);
      }
    };

    checkCalling();
  }, []);

  const handleOk = () => {
    navigate("/cs-layanan");
  };

  if (checking) return null;

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl text-center">
          <h2 className="text-lg font-semibold mb-4 text-orange-600">
            PERINGATAN
          </h2>
          <p className="mb-6">
            Perlu tindakan pada antrean nomor{" "}
            <strong>{ticketNumber || "--"}</strong>
          </p>
          <button
            onClick={handleOk}
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

export default CheckCallingStatus;
