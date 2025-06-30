import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import GreetingHeader from "../components/GreetingHeader";
import QueueTable from "../components/QueueTable";
import api from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [nextQueue, setNextQueue] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCallingQueue, setIsCallingQueue] = useState(false);

  // Ambil data antrean selanjutnya
  const fetchNextQueue = async () => {
    try {
      const res = await api.get("/queue/oldest-waiting/cs");
      setNextQueue(res.data);
    } catch (error) {
      console.error("Gagal mengambil antrean selanjutnya:", error);
      setNextQueue(null);
    }
  };

  useEffect(() => {
    fetchNextQueue();
  }, []);

  const handleNext = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await api.get("/queue/oldest-waiting/cs");
      const queue = res.data;

      setNextQueue(queue);
      setShowModal(true);
    } catch (error) {
      console.error("Gagal memanggil antrean:", error);
      alert("Tidak ada antrean yang tersedia saat ini.");
      window.location.reload();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalConfirm = async () => {
    if (!nextQueue) return;
    setIsCallingQueue(true);

    try {
      await api.patch(`/queue/${nextQueue.id}/call`);
      setShowModal(false);
      navigate("/cs-layanan");
    } catch (error) {
      console.error("Gagal mengubah status antrean:", error);
      alert("Terjadi kesalahan saat memanggil antrean. Silahkan coba lagi.");
      window.location.reload();
    } finally {
      setIsCallingQueue(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navbar />

      <div className="p-6">
        <GreetingHeader />

        <div className="flex flex-wrap gap-6 items-start">
          <div className="flex-1 min-w-[60%] bg-white rounded-md shadow p-4 max-h-[600px] overflow-auto">
            <QueueTable />
          </div>

          <div className="w-[300px] bg-white rounded-md shadow p-6 text-center flex flex-col items-center justify-center">
            <p className="text-sm mb-2">Antrean Selanjutnya :</p>
            <p className="text-5xl text-orange-500 font-bold mb-4">
              {nextQueue?.ticketNumber || "--"}
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
              {isProcessing ? "Memproses..." : "PANGGIL ANTREAN"}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg border-2 border-orange-300 w-80 p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">
              Apakah Anda Yakin Hendak Memanggil Antrean
            </h2>
            <p className="text-lg mb-6">
              Nomor <span className="font-bold">{nextQueue?.ticketNumber}</span>
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
