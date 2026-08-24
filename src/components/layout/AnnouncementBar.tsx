"use client";

import React, { useState, useEffect } from "react";

export default function AnnouncementBar() {
  const [message, setMessage] = useState("<strong>Dharma does not demand fear.</strong> It demands devotion.");

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        const res = await fetch("/api/public/announcements");
        if (res.ok) {
          const data = await res.json();
          if (data && data.message) {
            if (data.message.includes("demand fear")) {
              setMessage("<strong>Dharma does not demand fear.</strong> It demands devotion.");
            } else {
              setMessage(data.message);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load active announcement:", err);
      }
    }
    loadAnnouncement();
  }, []);

  if (!message) return null;

  return (
    <div className="announce select-none">
      <p
        className="ann-text font-sans"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
}


