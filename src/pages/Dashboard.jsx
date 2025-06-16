import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api"; // axios instance with token

const sampleData = [
  { nomor: "002", time: "09.02", layanan: "Buku Hilang, Riset Pin" },
  {
    nomor: "003",
    time: "09.05",
    layanan: "Buku Hilang, Riset Pin Kartu, Riset m-banking",
  },
  { nomor: "004", time: "09.12", layanan: "Buku Hilang" },
  { nomor: "005", time: "09.13", layanan: "Buku Rusak" },
  { nomor: "006", time: "09.20", layanan: "Buku Hilang" },
  { nomor: "007", time: "09.32", layanan: "Buku Rusak" },
  { nomor: "008", time: "09.33", layanan: "Buku Hilang, Riset Pin" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/cs/profile");
        setProfile(res.data.cs);
      } catch (error) {
        console.error("Gagal mengambil profil CS:", error);
      }
    };

    fetchProfile();
  }, []);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

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

        {/* Konten */}
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
                {sampleData.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{row.nomor}</td>
                    <td className="py-2">{row.time}</td>
                    <td className="py-2 truncate max-w-[250px]">
                      {row.layanan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Panel Antrian Saat Ini */}
          <div className="w-[300px] bg-white rounded-md shadow p-6 text-center flex flex-col items-center justify-center">
            <p className="text-sm mb-2">Antrian No :</p>
            <p className="text-7xl text-orange-500 font-bold mb-4">001</p>
            <button
              className="bg-green-500 text-white px-10 py-4 text-lg font-semibold rounded-md hover:bg-green-600 cursor-pointer w-full"
              onClick={() => navigate("/cs-layanan")}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
