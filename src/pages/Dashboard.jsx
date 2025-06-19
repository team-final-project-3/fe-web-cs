import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTicketNumber, setModalTicketNumber] = useState("");
  const [nextQueueData, setNextQueueData] = useState(null);

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

  const fetchData = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isRefresh = queryParams.get("refresh") === "true";
    fetchData();

    // Jika soft-refresh, bersihkan URL setelah ambil data
    if (isRefresh) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [location.search]);

  const handleNext = async () => {
    if (isProcessing || !profile?.branchId) return;
    setIsProcessing(true);

    try {
      const res = await api.get(`/queue/waiting-oldest/${profile.branchId}`);
      const nextQueue = res.data;

      setNextQueueData(nextQueue);
      setModalTicketNumber(nextQueue.ticketNumber);
      setShowModal(true);
    } catch (error) {
      console.error("Gagal memanggil antrian:", error);
      alert("Terjadi kesalahan saat memanggil antrian.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalConfirm = () => {
    if (!nextQueueData) return;
    localStorage.setItem("calledTicketNumber", nextQueueData.ticketNumber);
    localStorage.setItem("calledTicketId", nextQueueData.id); // <== Tambahkan ini
    setShowModal(false);
    navigate("/cs-layanan");
  };
  const handleModalCancel = () => {
    setShowModal(false);
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
          Halo, Selamat Datang{" "}
          <span className="font-semibold capitalize">
            {profile?.name || "Loading..."}
          </span>
        </p>

        {errorMsg && (
          <p className="text-red-500 bg-red-100 px-4 py-2 rounded mb-4">
            {errorMsg}
          </p>
        )}

        {loading ? (
          <div className="text-center text-gray-500">Memuat data...</div>
        ) : (
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
                      <td
                        colSpan="3"
                        className="text-center py-4 text-gray-400"
                      >
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
              <p className="text-7xl text-orange-500 font-bold mb-4">
                {queues[0]?.ticketNumber || "--"}
              </p>
              <button
                onClick={handleNext}
                disabled={isProcessing}
                className={`${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 cursor-pointer"
                } text-white px-10 py-4 text-lg font-semibold rounded-md w-full`}
              >
                {isProcessing ? "Memproses..." : "NEXT"}
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg border-2 border-orange-300 w-80 p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">
              Apakah Anda Yakin Hendak Memanggil Antrian
            </h2>
            <p className="text-lg mb-6">
              Nomor <span className="font-bold">{modalTicketNumber}</span>
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleModalCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleModalConfirm}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
