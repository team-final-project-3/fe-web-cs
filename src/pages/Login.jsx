import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import LogoTemuNoBg from "../assets/temuCS long dark.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false); // ✅

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true); // ✅ mulai loading

    try {
      const response = await api.post("cs/login", { username, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      navigate("/cs-dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setErrorMsg("Username atau password salah");
      } else {
        setErrorMsg("Terjadi kesalahan. Coba lagi nanti.");
      }
    } finally {
      setLoading(false); // ✅ selesai loading
    }
  };

  return (
    <div className="bg-[#F6F5F2] h-screen flex flex-col justify-center items-center">
      <div className="cont w-80">
        <div className="flex justify-center mb-5">
          <img src={LogoTemuNoBg} alt="logo" className="h-45" />
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
            disabled={loading}
            className={`btn uppercase text-white py-2 rounded flex justify-center items-center gap-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F27F0C] hover:bg-[#d66d00]"
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
