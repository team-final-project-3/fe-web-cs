import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const DetailLayanan = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [queueData, setQueueData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showDoneModal, setShowDoneModal] = useState(false);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProfile = await api.get("/cs/profile");
        setProfile(resProfile.data.cs);

        const resQueue = await api.get("/queue/inprogress/cs");
        setQueueData(resQueue.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setErrorMsg("Gagal memuat data. Silakan coba beberapa saat lagi.");
      }
    };

    fetchData();
  }, []);

  const handleDoneClick = () => {
    setShowDoneModal(true);
  };

  const handleConfirmDone = async () => {
    if (!queueData?.id) return alert("ID antrian tidak ditemukan.");
    setShowDoneModal(false);
    try {
      await api.patch(`/queue/${queueData.id}/done`);
      alert(`Antrian ${queueData.ticketNumber} telah selesai.`);
      navigate("/cs-dashboard?refresh=true");
    } catch (error) {
      console.error("Gagal menyelesaikan antrian:", error);
      alert("Gagal menyelesaikan antrian. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navbar />

      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">
            BNI KCU {profile?.branch?.name?.toUpperCase() || "Loading..."}
          </h2>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span className="text-lg">🕒</span>
            {currentDate}
          </div>
        </div>

        <p className="text-sm mb-4">
          Hallo, Selamat Datang{" "}
          <span className="font-semibold capitalize">
            {profile?.name || "Loading..."}
          </span>
        </p>

        {errorMsg && (
          <p className="text-red-500 bg-red-100 px-4 py-2 rounded mb-4">
            {errorMsg}
          </p>
        )}

        <div className="flex flex-wrap gap-6">
          {/* Box Kiri */}
          <div className="flex-1 min-w-[60%] bg-white rounded-md shadow p-6 text-left">
            <p className="text-lg mb-2 font-medium">
              Nomor Tiket :{" "}
              <span className="font-bold">
                {queueData?.ticketNumber || "--"}
              </span>
            </p>
            <p className="text-lg mb-2 font-medium">
              Nama :{" "}
              <span className="font-bold uppercase">
                {queueData?.name || "--"}
              </span>
            </p>
            <p className="text-lg font-medium">Layanan :</p>
            <ul className="list-disc list-inside text-orange-500 mt-1 ml-3 space-y-1">
              {queueData?.services?.length > 0 ? (
                queueData.services.map((item, i) => (
                  <li key={i}>{item.service?.serviceName || "-"}</li>
                ))
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>

          {/* Box Kanan */}
          <div className="w-[300px] bg-white rounded-md shadow p-6 text-center flex flex-col items-center justify-center">
            <p className="text-sm mb-2">Nomor Tiket :</p>
            <p className="text-7xl text-orange-500 font-bold mb-4">
              {queueData?.ticketNumber || "--"}
            </p>
            <button
              className="bg-green-500 text-white px-4 py-5 rounded-md hover:bg-green-600 w-full cursor-pointer"
              onClick={handleDoneClick}
            >
              DONE
            </button>
          </div>
        </div>
      </div>

      {showDoneModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-green-600">
              Konfirmasi Selesai
            </h2>
            <p className="mb-6">
              Apakah Anda yakin ingin <strong>MENYELESAIKAN</strong> antrian{" "}
              <strong>{queueData?.ticketNumber}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => setShowDoneModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                onClick={handleConfirmDone}
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

export default DetailLayanan;
