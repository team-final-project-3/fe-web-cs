import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const Layanan = () => {
  const navigate = useNavigate();
  const [calledTicket, setCalledTicket] = useState("");
  const [calledTicketId, setCalledTicketId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showTakeModal, setShowTakeModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProfile = await api.get("/cs/profile");
        const csData = resProfile.data.cs;
        setProfile(csData);

        const resQueue = await api.get("/queue/waiting/cs");
        setQueues(resQueue.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setErrorMsg("Gagal memuat data. Silakan coba beberapa saat lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const ticket = localStorage.getItem("calledTicketNumber");
    const ticketId = localStorage.getItem("calledTicketId");
    if (ticket) {
      setCalledTicket(ticket);
      setCalledTicketId(ticketId);
      triggerNotification(ticket);
      localStorage.removeItem("calledTicketNumber");
      localStorage.removeItem("calledTicketId");
    }
  }, []);

  const triggerNotification = (ticketNumber) => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleRecallClick = () => {
    if (calledTicket) {
      triggerNotification(calledTicket);
    }
  };

  const handleSkipClick = () => setShowSkipModal(true);
  const handleTakeClick = () => setShowTakeModal(true);

  const handleSkipConfirm = async () => {
    setShowSkipModal(false);
    if (!calledTicketId) return alert("ID tiket tidak ditemukan.");
    try {
      await api.patch(`/queue/${calledTicketId}/skip`);
      alert(`Antrian ${calledTicket} telah di-skip.`);
      navigate("/cs-dashboard?refresh=true");
    } catch (error) {
      console.error("Gagal skip antrian:", error);
      alert("Gagal skip antrian. Silakan coba lagi.");
    }
  };

  const handleTakeConfirm = async () => {
    setShowTakeModal(false);
    if (!calledTicketId) return alert("ID tiket tidak ditemukan.");
    try {
      await api.patch(`/queue/${calledTicketId}/take`);
      alert(`Antrian ${calledTicket} telah diambil.`);
      navigate("/cs-detail-layanan");
    } catch (error) {
      console.error("Gagal mengambil antrian:", error);
      alert("Gagal mengambil antrian. Silakan coba lagi.");
    }
  };

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const getTimeFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <span className="text-lg">🕒</span> {currentDate}
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

        <div
          className={`transition-all duration-700 transform ${
            showNotification
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5 pointer-events-none"
          }`}
        >
          {calledTicket && (
            <div className="mb-4 bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded shadow">
              Sedang memanggil antrian <strong>{calledTicket}</strong>...
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[60%] bg-white rounded-md shadow p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">UPCOMING</th>
                  <th className="pb-2">TIME</th>
                  <th className="pb-2">LAYANAN</th>
                </tr>
              </thead>
              <tbody>
                {queues.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-400">
                      Belum ada antrian menunggu.
                    </td>
                  </tr>
                ) : (
                  queues.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="py-2">{row.ticketNumber}</td>
                      <td className="py-2">
                        {getTimeFromDate(row.bookingDate)}
                      </td>
                      <td className="py-2 truncate max-w-[250px]">
                        {row.services
                          .map((s) => s.serviceName || "-")
                          .join(", ")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="w-[300px] bg-white rounded-md shadow p-6 text-center flex flex-col items-center justify-center">
            <p className="text-sm mb-2">Antrian No :</p>
            <p className="text-7xl text-orange-500 font-bold mb-2">
              {calledTicket || queues[0]?.ticketNumber || "--"}
            </p>
            <p className="text-sm mb-4">
              {queues[0]?.services?.map((s) => s.serviceName).join(", ") ||
                "Layanan"}
            </p>

            <button
              className="w-full bg-blue-500 text-white py-3 rounded-md mb-2 hover:bg-blue-600"
              onClick={handleRecallClick}
            >
              🔊 Panggil Ulang
            </button>
            <button
              className="w-full bg-red-500 text-white py-3 rounded-md mb-2 hover:bg-red-600"
              onClick={handleSkipClick}
            >
              SKIP
            </button>
            <button
              className="w-full bg-green-500 text-white py-3 rounded-md mb-2 hover:bg-green-600"
              onClick={handleTakeClick}
            >
              TAKE
            </button>
            <button
              className="w-full bg-gray-500 text-white py-3 rounded-md hover:bg-gray-600"
              onClick={() => navigate("/cs-dashboard?refresh=true")}
            >
              🔄 Kembali
            </button>
          </div>
        </div>
      </div>

      {showSkipModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Konfirmasi Skip
            </h2>
            <p className="mb-6">
              Apakah Anda yakin ingin <strong>SKIP</strong> antrian{" "}
              <strong>{calledTicket}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => setShowSkipModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                onClick={handleSkipConfirm}
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

      {showTakeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-green-600">
              Konfirmasi Take
            </h2>
            <p className="mb-6">
              Apakah Anda yakin ingin <strong>mengambil</strong> antrian{" "}
              <strong>{calledTicket}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => setShowTakeModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
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
