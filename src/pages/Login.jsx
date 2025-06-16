import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import LogoTemuNoBg from "../assets/logo_temu_no_bg.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await api.post("cs/login", { username, password });
      const { token, csId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("csId", csId);
      localStorage.setItem("role", "cs");

      navigate("/cs-dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setErrorMsg("Username atau password salah.");
      } else {
        setErrorMsg("Terjadi kesalahan. Coba lagi nanti.");
      }
    }
  };

  return (
    <div className="bg-[#F6F5F2] h-screen flex flex-col justify-center items-center">
      <div className="cont w-80">
        <div className="flex justify-center mb-5">
          <img src={LogoTemuNoBg} alt="logo" className="h-20" />
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <h1 className="text-center font-bold text-xl">Login CS</h1>

          {errorMsg && (
            <p className="text-red-500 text-center text-sm">{errorMsg}</p>
          )}

          <input
            className="input border px-3 py-2 rounded"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="input border px-3 py-2 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn bg-[#F27F0C] uppercase text-white py-2 rounded hover:bg-[#d66d00]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
