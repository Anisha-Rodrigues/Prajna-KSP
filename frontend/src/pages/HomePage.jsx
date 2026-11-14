import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStats, getAlerts } from "../utils/api";

function StatCard({ label, value, sub, to, accent }) {
  const inner = (
    <div
      className={`bg-gray-900 border rounded-lg p-4 transition ${
        to ? "hover:border-blue-500 cursor-pointer" : ""
      } ${accent ? "border-red-800" : "border-gray-800"}`}
    >
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accent ? "text-red-400" : "text-white"}`}>
        {value ?? "—"}
      </p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function HomePage() {
  const { officer } = useAuth();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [statsData, alertData] = await Promise.all([
          getStats(),
          getAlerts(),
        ]);
        if (cancelled) return;
        setStats(statsData);
        setAlerts(alertData.alerts || []);
      } catch {
        if (!cancelled) setOffline(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Welcome, {officer?.name}</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Officer ID: {officer?.officerId} &nbsp;·&nbsp; Session started{" "}
          {officer?.loginAt ? new Date(officer.loginAt).toLocaleTimeString() : "—"}
        </p>
      </div>

      {offline && (
        <div className="mb-6 bg-yellow-900/30 border border-yellow-800 text-yellow-300 text-xs rounded px-3 py-2">
          Backend unreachable on port 8000. Stats shown as placeholders — start
          the FastAPI server to see live data.
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Suspects Tracked"
          value={loading ? "…" : stats?.suspects?.total}
          sub={
            stats
              ? `${stats.suspects.high_risk} high-risk · ${stats.suspects.absconding} absconding`
              : null
          }
        />
        <StatCard
          label="FIRs on Record"
          value={loading ? "…" : stats?.firs?.total}
          sub={
            stats
              ? `${stats.firs.by_status?.chargesheeted ?? 0} chargesheeted`
              : null
          }
        />
        <StatCard
          label="Zones Monitored"
          value={loading ? "…" : stats?.zones?.total}
          sub={
            stats ? `Across ${stats.districts?.total} districts` : null
          }
        />
        <StatCard
          label="Active Alerts"
          value={loading ? "…" : alerts.length}
          sub={alerts.length > 0 ? "High-pressure zones detected" : "No anomalies"}
          accent={alerts.length > 0}
        />
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <Link
          to="/app/chat"
          className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-blue-500 transition"
        >
          <h3 className="font-semibold text-blue-400 text-sm mb-1">
            Case Canvas & Chat
          </h3>
          <p className="text-xs text-gray-500">
            Query suspects, FIRs, and locations by name or voice in English or
            Kannada. Results render as a live knowledge graph.
          </p>
        </Link>

        <Link
          to="/app/pressure"
          className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-blue-500 transition"
        >
          <h3 className="font-semibold text-blue-400 text-sm mb-1">
            Crime Pressure Map
          </h3>
          <p className="text-xs text-gray-500">
            {loading
              ? "Loading zone data…"
              : `${stats?.zones?.total ?? "—"} zones tracked across ${
                  stats?.districts?.total ?? "—"
                } districts. Heatmap updates each session.`}
          </p>
        </Link>
      </div>

      {/* Alerts Panel */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="font-semibold text-sm mb-3">Active Alerts</h3>
        {loading ? (
          <p className="text-xs text-gray-500">Loading…</p>
        ) : alerts.length === 0 ? (
          <p className="text-xs text-gray-500">No active alerts.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((a, i) => (
              <li
                key={a.zone_id || i}
                className="flex items-start gap-2 text-xs"
              >
                <span className="mt-0.5 text-red-400 flex-shrink-0">▲</span>
                <div>
                  <span className="text-yellow-300 font-medium">
                    {a.district || a.zone_name || a.zone_id}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {a.message || "Elevated pressure score detected."}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
