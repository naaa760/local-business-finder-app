"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode.react";

export default function QRCodeGenerator({ url, businessName }) {
  const [showQR, setShowQR] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowQR(!showQR)}
        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
      >
        {showQR ? "Hide QR Code" : "Show QR Code"}
      </button>

      {showQR && (
        <div className="mt-3 p-4 bg-white rounded-lg shadow-md inline-block">
          <QRCode value={url} size={150} includeMargin={true} level={"H"} />
          <p className="mt-2 text-xs text-center text-gray-500">
            Scan to view {businessName}
          </p>
        </div>
      )}
    </div>
  );
}
