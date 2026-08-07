import React from "react";

export default function AnnouncementBar() {
  return (
    <div className="announce select-none">
      <div className="wrap">
        <p className="announce-text font-sans">
          <strong>Dharma doesn&apos;t demand fear</strong> — it demands pure devotion.
        </p>
        <div className="announce-links">
          <span className="announce-link font-sans cursor-not-allowed">Scripture References</span>
          <span className="announce-link font-sans cursor-not-allowed">Authenticity</span>
          <span className="announce-link font-sans cursor-not-allowed">About The Tapa Co.</span>
        </div>
      </div>
    </div>
  );
}
