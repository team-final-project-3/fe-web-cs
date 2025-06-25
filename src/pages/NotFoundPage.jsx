import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    // Cek apakah user login atau tidak bisa ditambahkan di sini
    navigate("/cs-dashboard"); // Arahkan ke halaman dashboard
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#F7F6F2] px-6">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-2xl font-semibold mb-2">
        Oops! Halaman tidak ditemukan.
      </p>
      <p className="text-gray-600 mb-6">
        Halaman yang Anda cari mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <button
        onClick={handleBackToDashboard}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 cursor-pointer"
      >
        🔙 KEMBALI KE DASHBOARD
      </button>
    </div>
  );
};

export default NotFoundPage;
