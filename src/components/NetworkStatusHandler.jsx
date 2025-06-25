import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NetworkStatusHandler = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      navigate(0); // ⬅️ refresh halaman saat ini
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate]);

  if (!isOnline) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-red-600 text-lg font-semibold mb-2">
            ⚠️ Anda sedang offline
          </p>
          <p className="text-gray-600 mb-4">Periksa koneksi internet Anda.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow cursor-pointer"
          >
            🔄 Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default NetworkStatusHandler;
