import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../utils/api";

const socket = io(import.meta.env.VITE_API_SOCKET);

const QueueTable = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [branchIdCS, setBranchIdCS] = useState(null);

  // Ambil branchId CS yang sedang login
  useEffect(() => {
    const fetchBranchId = async () => {
      try {
        const res = await api.get("/cs/profile");
        const id = res.data.cs.branch.id;
        setBranchIdCS(id);
      } catch (err) {
        console.error("Gagal mengambil branchId CS:", err);
      }
    };

    fetchBranchId();
  }, []);

  // Fungsi untuk fetch data antrian
  const fetchQueues = async () => {
    try {
      setLoading(true);
      const res = await api.get("/queue/waiting/cs");
      setQueues(res.data);
    } catch (err) {
      console.error("Gagal fetch data antrian:", err);
      setErrorMsg("Gagal memuat antrean.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branchIdCS === null) return;

    fetchQueues();

    const refreshIfSameBranch = (data) => {
      if (data.branchId === branchIdCS) {
        fetchQueues();
      }
    };

    // Saat antrean baru dibooking
    socket.on("queue:booked", (data) => {
      if (data.branchId !== branchIdCS) return;

      const newQueue = {
        ticketNumber: data.ticketNumber,
        status: data.status,
        bookingDate: data.bookedAt || "-",
        services: data.services.map((s) =>
          typeof s === "string" ? { serviceName: s } : s
        ),
      };

      setQueues((prev) => [newQueue, ...prev]);
    });

    // Listener perubahan status
    socket.on("queue:called", refreshIfSameBranch);
    socket.on("queue:skipped", refreshIfSameBranch);
    socket.on("queue:in-progress", refreshIfSameBranch);

    return () => {
      socket.off("queue:booked");
      socket.off("queue:called", refreshIfSameBranch);
      socket.off("queue:skipped", refreshIfSameBranch);
      socket.off("queue:in-progress", refreshIfSameBranch);
    };
  }, [branchIdCS]);

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
            <tr key={row.ticketNumber} className="border-t">
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
