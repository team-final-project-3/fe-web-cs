import React, { useEffect, useState } from "react";
import api from "../utils/api";

const QueueTable = ({ onDataLoaded }) => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        setLoading(true);
        const res = await api.get("/queue/waiting/cs");
        setQueues(res.data);
        if (onDataLoaded) onDataLoaded(res.data); // kirim ke parent jika dibutuhkan
      } catch (err) {
        console.error("Gagal fetch data antrian:", err);
        setErrorMsg("Gagal memuat antrean.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();
  }, []);

  const getTimeFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="text-gray-500 text-sm">Memuat antrean...</div>;
  }

  if (errorMsg) {
    return (
      <div className="text-red-500 bg-red-100 p-2 rounded text-sm">
        {errorMsg}
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          <th className="pb-2">UPCOMING</th>
          <th className="pb-2">TIME</th>
          <th className="pb-2">LAYANAN</th>
        </tr>
      </thead>
      <tbody>
        {queues.length === 0 ? (
          <tr>
            <td colSpan="3" className="text-center py-4 text-gray-400">
              Belum ada antrean menunggu.
            </td>
          </tr>
        ) : (
          queues.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="py-2">{row.ticketNumber}</td>
              <td className="py-2">{getTimeFromDate(row.bookingDate)}</td>
              <td className="py-2 truncate max-w-[250px]">
                {row.services.map((s) => s.serviceName || "-").join(", ")}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default QueueTable;
