import { useNavigate } from "react-router-dom";

const SessionExpired = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    localStorage.removeItem("token"); // Hapus token
    navigate("/"); // Arahkan ke login
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white text-center px-6">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Sesi Anda Telah Berakhir
      </h1>
      <p className="mb-6 text-gray-600">
        Silakan login kembali untuk melanjutkan.
      </p>
      <button
        onClick={handleBackToLogin}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Kembali ke Login
      </button>
    </div>
  );
};

export default SessionExpired;
