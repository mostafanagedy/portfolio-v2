"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "nagedy_analytics_consent";

export default function AnalyticsConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(CONSENT_KEY));
  }, []);

  function choose(value: "accepted" | "rejected") {
    localStorage.setItem(CONSENT_KEY, value);
    document.cookie = `${CONSENT_KEY}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    setVisible(false);
    if (value === "accepted") window.location.reload();
  }

  if (!visible) return null;
  return (
    <aside role="dialog" aria-label="Analytics preferences" className="analytics-consent">
      <div>
        <strong>Privacy preferences</strong>
        <p>Allow privacy-conscious analytics to help improve this portfolio? Your choice can be changed by clearing this site preference.</p>
      </div>
      <div className="analytics-consent__actions">
        <button type="button" onClick={() => choose("rejected")}>Essential only</button>
        <button type="button" onClick={() => choose("accepted")}>Allow analytics</button>
      </div>
    </aside>
  );
}
