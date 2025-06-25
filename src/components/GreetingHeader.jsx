import React, { useEffect, useState } from "react";
import api from "../utils/api";

const GreetingHeader = () => {
  const [profile, setProfile] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/cs/profile");
        setProfile(res.data.cs);
      } catch (error) {
        console.error("Gagal mengambil profile CS:", error);
      }
    };

    fetchProfile();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // update tiap detik

    return () => clearInterval(timer); // cleanup interval saat unmount
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">
          BNI KCU {profile?.branch?.name?.toUpperCase() || "Loading..."}
        </h2>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span className="text-lg">🕒</span>
          {formatDate(currentTime)}, {formatTime(currentTime)}
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
