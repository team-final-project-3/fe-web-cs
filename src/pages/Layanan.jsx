import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import GreetingHeader from "../components/GreetingHeader";
import QueueTable from "../components/QueueTable";

const Layanan = () => {
  const navigate = useNavigate();
  const [calledTicket, setCalledTicket] = useState("");
  const [calledTicketId, setCalledTicketId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showTakeModal, setShowTakeModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRecalling, setIsRecalling] = useState(false);

  useEffect(() => {
    const fetchCalledCustomer = async () => {
      try {
        const resCalling = await api.get("/queue/cs/called-customer");

        if (resCalling.data?.isCalling) {
          setCalledTicket(resCalling.data.ticketNumber);
          setCalledTicketId(resCalling.data.queueId);
          triggerNotification(resCalling.data.ticketNumber);
        } else {
          // Tidak melakukan fallback
          setCalledTicket("--");
          setCalledTicketId(null);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setErrorMsg("Gagal memuat data. Silakan coba beberapa saat lagi.");
      }
    };

    fetchCalledCustomer();
  }, []);

  const triggerNotification = (ticketNumber) => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleRecallClick = () => {
    if (calledTicket && calledTicket !== "--") {
      setIsRecalling(true);
      triggerNotification(calledTicket);
      setTimeout(() => {
        setIsRecalling(false);
      }, 3500);
    }
  };

  const handleSkipClick = () => setShowSkipModal(true);
  const handleTakeClick = () => setShowTakeModal(true);

  const handleSkipConfirm = async () => {
    setShowSkipModal(false);
    if (!calledTicketId) return alert("ID tiket tidak ditemukan.");
    try {
      await api.patch(`/queue/${calledTicketId}/skip`);
      navigate("/cs-dashboard?refresh=true");
    } catch (error) {
      console.error("Gagal skip antrean:", error);
      alert("Terjadi kesalahan saat skip antrean. Silakan coba lagi.");
      window.location.reload();
    }
  };

  const handleTakeConfirm = async () => {
    setShowTakeModal(false);
    if (!calledTicketId) return alert("ID tiket tidak ditemukan.");
    try {
      await api.patch(`/queue/${calledTicketId}/take`);
      navigate("/cs-detail-layanan");
    } catch (error) {
      console.error("Gagal mengambil antrean:", error);
      alert("Gagal mengambil antrean. Silakan coba lagi.");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navbar />
      <div className="p-6">
        <GreetingHeader />

        {errorMsg && (
          <p className="text-red-500 bg-red-100 px-4 py-2 rounded mb-4">
            {errorMsg}
          </p>
        )}

        <div
          className={`transition-all duration-700 transform ${
            showNotification
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5 pointer-events-none"
          }`}
        >
          {calledTicket && calledTicket !== "--" && (
            <div className="mb-4 bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded shadow">
              Sedang memanggil antrean <strong>{calledTicket}</strong>...
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-6 items-start">
          <div className="flex-1 min-w-[60%] bg-white rounded-md shadow p-4 max-h-[600px] overflow-auto">
            <QueueTable />
          </div>

          <div className="w-[300px] bg-white rounded-md shadow p-6 text-center flex flex-col items-center justify-center">
            <p className="text-sm mb-2">Antrean No :</p>
            <p className="text-5xl text-orange-500 font-bold mb-2">
              {calledTicket || "--"}
            </p>
            <button
              className={`w-full py-3 rounded-md mb-2 flex items-center justify-center gap-2 ${
                isRecalling
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              } text-white`}
              onClick={handleRecallClick}
              disabled={isRecalling || !calledTicketId}
            >
              {isRecalling ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Memanggil...
                </>
              ) : (
                "PANGGIL ULANG"
              )}
            </button>

            <button
              className="w-full bg-red-500 text-white py-3 rounded-md mb-2 hover:bg-red-600 cursor-pointer"
              onClick={handleSkipClick}
              disabled={!calledTicketId}
            >
              TIDAK HADIR
            </button>
            <button
              className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 cursor-pointer"
              onClick={handleTakeClick}
              disabled={!calledTicketId}
            >
              KERJAKAN
            </button>
          </div>
        </div>
      </div>

      {/* Modal Skip */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              KONFIRMASI
            </h2>
            <p className="mb-6 text-center">
              Apakah anda yakin <strong>TIDAK HADIR</strong> antrean
              <br />
              <strong className="text-xl">{calledTicket}</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded cursor-pointer"
                onClick={() => setShowSkipModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
                onClick={handleSkipConfirm}
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Take */}
      {showTakeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-green-600">
              KONFIRMASI
            </h2>
            <p className="mb-6 text-center">
              Apakah Anda yakin ingin <strong>mengambil</strong> antrean
              <br />
              <strong className="text-xl">{calledTicket}</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded cursor-pointer"
                onClick={() => setShowTakeModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer"
                onClick={handleTakeConfirm}
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layanan;
