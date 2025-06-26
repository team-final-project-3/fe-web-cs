import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import LogoTemuCS from "../assets/temuCS long dark_crop.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <div className="h-16 bg-white flex items-center px-4 py-4 shadow-md z-10 justify-between">
        <div className="flex items-center gap-3">
          <img src={LogoTemuCS} alt="Logo" className="h-8" />
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          <IoExitOutline size={18} />
          Keluar
        </button>
      </div>

      {/* Modal Logout Confirmation */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-red-600 text-center mb-4">
              KONFIRMASI
            </h2>
            <p className="text-center mb-6">
              Apakah anda yakin hendak keluar?
              <br />
              <span className="text-sm text-gray-600">
                Pastikan anda telah menyelesaikan antrean yang dikerjakan
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded cursor-pointer"
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
                onClick={handleLogout}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
