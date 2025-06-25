import React from "react";

const GreetingHeader = ({ branchName, csName, currentDate }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">
          BNI KCU {branchName?.toUpperCase() || "Loading..."}
        </h2>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span className="text-lg">🕒</span> {currentDate}
        </div>
      </div>

      <p className="text-sm">
        Halo, Selamat Datang{" "}
        <span className="font-semibold capitalize">
          {csName || "Loading..."}
        </span>
      </p>
    </div>
  );
};

export default GreetingHeader;
