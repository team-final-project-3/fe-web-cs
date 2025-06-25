import React from "react";

const QueueTable = ({ queues }) => {
  const getTimeFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
              Belum ada antrian menunggu.
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
