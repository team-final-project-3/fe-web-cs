import React, { useEffect, useState } from "react";
import api from "../utils/api";

const GreetingHeader = () => {
  const [profile, setProfile] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/cs/profile");
        setProfile(res.data.cs);
      } catch (error) {
        console.error("Gagal mengambil profile CS:", error);
      }
    };

    const updateClock = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const time = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentDate(`${formattedDate}, ${time}`);
    };

    fetchProfile();
    updateClock();
    const interval = setInterval(updateClock, 60000); // update tiap 1 menit

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">
          BNI KCU {profile?.branch?.name?.toUpperCase() || "Loading..."}
        </h2>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span className="text-lg">🕒</span> {currentDate}
        </div>
      </div>

      <p className="text-sm">
        Halo, Selamat Datang{" "}
        <span className="font-semibold capitalize">
          {profile?.name || "Loading..."}
        </span>
      </p>
    </div>
  );
};

export default GreetingHeader;
