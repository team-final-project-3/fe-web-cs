import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layanan = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navbar />

      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">CABANG KCU JAKARTA KOTA</h2>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span className="text-lg">🕒</span>
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        </div>

        <p className="text-sm mb-4">
          Hallo, Selamat Datang{" "}
          <span className="font-semibold">Asep Kadal</span>
        </p>

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
                <tr className="border-t">
                  <td className="py-2">002</td>
                  <td className="py-2">09.02</td>
                  <td className="py-2">Buku Hilang, Riset Pin</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Panel Info Antrian */}
          <div className="w-[300px] bg-white rounded-md shadow p-6 text-center flex flex-col items-center justify-center">
            <p className="text-sm mb-2">Antrian No :</p>
            <p className="text-7xl text-orange-500 font-bold mb-2">001</p>
            <p className="text-sm mb-4">Buku Hilang, Riset Pin</p>
            <button
              className="w-full bg-red-500 text-white py-5   rounded-md mb-2 hover:bg-red-600 cursor-pointer"
              onClick={() => navigate("/cs-dashboard")}
            >
              SKIP
            </button>
            <button
              className="w-full bg-green-500 text-white py-5 rounded-md hover:bg-green-600 cursor-pointer"
              onClick={() => navigate("/cs-detail-layanan")}
            >
              TAKE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layanan;
