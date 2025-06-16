import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Ambil profile dan queue
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resProfile = await api.get("/cs/profile");
        const csData = resProfile.data.cs;
        setProfile(csData);

        const resQueue = await api.get(`/queue/waiting/${csData.branchId}`);
        setQueues(resQueue.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setErrorMsg("Gagal memuat data. Silakan coba beberapa saat lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handleNext = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // TODO: call backend to process next queue
      navigate("/cs-layanan");
    } catch (error) {
      console.error("Gagal memproses antrian:", error);
      alert("Terjadi kesalahan saat memproses. Coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navbar />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">
            CABANG KCU {profile?.branch?.name?.toUpperCase() || "Loading..."}
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

        {/* Konten */}
        {loading ? (
          <div className="text-center text-gray-500">Memuat data...</div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {/* Tabel Antrian */}
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
                    queues.map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2">{row.ticketNumber}</td>
                        <td className="py-2">
                          {getTimeFromDate(row.bookingDate)}
                        </td>
                        <td className="py-2 truncate max-w-[250px]">
                          {row.services.map((s) => s.serviceName).join(", ")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Panel Antrian Saat Ini */}
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
    </div>
  );
};

export default Dashboard;
