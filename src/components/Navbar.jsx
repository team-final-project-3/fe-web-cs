import React from "react";
import { useNavigate } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import LogoTemuCS from "../assets/temuCS long dark_crop.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus token dan informasi pengguna
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Redirect ke halaman login
    navigate("/");
  };

  return (
    <div className="h-16 bg-white flex items-center px-4 py-4 shadow-md z-10 justify-between">
      <div className="flex items-center gap-3">
        <img src={LogoTemuCS} alt="Logo" className="h-8" />
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        <IoExitOutline size={18} />
        Logout
      </button>
    </div>
  );
};

export default Navbar;
