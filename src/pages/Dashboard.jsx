import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import GreetingHeader from "../components/GreetingHeader";
import QueueTable from "../components/QueueTable";
import api from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTicketNumber, setModalTicketNumber] = useState("");
  const [nextQueueData, setNextQueueData] = useState(null);
  const [isCallingQueue, setIsCallingQueue] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isRefresh = queryParams.get("refresh") === "true";

    const fetchData = async () => {
      try {
        setLoading(true);
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

    if (isRefresh) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [location.search]);

  const handleNext = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await api.get("/queue/oldest-waiting/cs");
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

  const handleModalConfirm = async () => {
    if (!nextQueueData) return;
    setIsCallingQueue(true);

    try {
      await api.patch(`/queue/${nextQueueData.id}/call`);
      localStorage.setItem("calledTicketNumber", nextQueueData.ticketNumber);
      localStorage.setItem("calledTicketId", nextQueueData.id);

      setShowModal(false);
      navigate("/cs-layanan");
    } catch (error) {
      console.error("Gagal mengubah status antrian:", error);
      alert("Terjadi kesalahan saat memanggil antrian.");
    } finally {
      setIsCallingQueue(false);
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

        {loading ? (
          <div className="text-center text-gray-500">Memuat data...</div>
        ) : (
          <div className="flex flex-wrap gap-6 items-start">
            <div className="flex-1 min-w-[60%] bg-white rounded-md shadow p-4 max-h-[600px] overflow-auto">
              <QueueTable queues={queues} />
            </div>

            <div className="w-[300px] bg-white rounded-md shadow p-6 text-center flex flex-col items-center justify-center">
              <p className="text-sm mb-2">Antrian Selanjutnya :</p>
              <p className="text-5xl text-orange-500 font-bold mb-4">
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
                {isProcessing ? "Memproses..." : "PANGGIL ANTRIAN"}
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
                onClick={() => setShowModal(false)}
                disabled={isCallingQueue}
                className={`${
                  isCallingQueue
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-400 hover:bg-gray-500"
                } text-white font-semibold px-4 py-2 rounded cursor-pointer`}
              >
                Batal
              </button>

              <button
                onClick={handleModalConfirm}
                disabled={isCallingQueue}
                className={`${
                  isCallingQueue
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-semibold px-4 py-2 rounded cursor-pointer`}
              >
                {isCallingQueue ? "Memproses..." : "Ya"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
