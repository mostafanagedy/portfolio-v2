"use client";

import { useCallback, useEffect, useState } from "react";

type VisitorEvent = {
  sessionId: string;
  eventName: string;
  path: string;
  referrerDomain?: string | null;
  deviceType?: string;
  createdAt: string;
};
type Report = { stats: { totalEvents: number; uniqueSessions: number; cvClicks: number; githubClicks: number }; events: VisitorEvent[] };

export default function VisitorDashboard() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/visitor-events", { cache: "no-store", credentials: "same-origin" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load visitor data.");
      setReport(result as Report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load visitor data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    window.location.assign("/admin/login");
  }

  return (
    <main className="admin-shell admin-shell--wide">
      <header className="admin-header">
        <div><p className="admin-eyebrow">NAGEDY / ADMIN</p><h1>Visitor Intelligence</h1><p>Anonymous sessions and engagement signals — not verified personal identities.</p></div>
        <div className="admin-header__actions"><button type="button" onClick={() => void load()}>Refresh</button><button type="button" className="admin-button--secondary" onClick={() => void logout()}>Sign out</button></div>
      </header>
      {error && <div className="admin-notice" role="alert">{error}</div>}
      {loading && <p>Loading visitor data…</p>}
      {report && <>
        <section className="admin-stats">
          <article><span>Total events</span><strong>{report.stats.totalEvents.toLocaleString()}</strong></article>
          <article><span>Unique session IDs</span><strong>{report.stats.uniqueSessions.toLocaleString()}</strong></article>
          <article><span>CV interactions</span><strong>{report.stats.cvClicks.toLocaleString()}</strong></article>
          <article><span>GitHub clicks</span><strong>{report.stats.githubClicks.toLocaleString()}</strong></article>
        </section>
        <section className="admin-table-panel">
          <div className="admin-table-heading"><h2>Recent events</h2><span>Last 100 · 30-day retention</span></div>
          <div className="admin-table-wrap"><table><thead><tr><th>Time</th><th>Session</th><th>Event</th><th>Page</th><th>Referrer</th><th>Device</th></tr></thead>
            <tbody>{report.events.map((event, index) => <tr key={event.sessionId + event.createdAt + event.eventName + index}>
              <td>{new Date(event.createdAt).toLocaleString()}</td><td><code>{event.sessionId}</code></td><td>{event.eventName}</td><td>{event.path}</td><td>{event.referrerDomain || "Direct / unavailable"}</td><td>{event.deviceType || "Unknown"}</td>
            </tr>)}</tbody></table>
          </div>
        </section>
      </>}
      <p className="admin-footnote">Company matching and personal identification are not enabled. A session identifier is not a real-world identity.</p>
    </main>
  );
}
