import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAlerts, getPressure } from "../utils/api";

export default function HomePage() {
  const { officer } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [zoneCount, setZoneCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [alertData, pressureData] = await Promise.all([
          getAlerts(),
          getPressure(),
        ]);
        if (cancelled) return;
        setAlerts(alertData.alerts || []);
        setZoneCount((pressureData.zones || []).length);
      } catch {
        if (!cancelled) setOffline(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-xl font-bold mb-1">Welcome, {officer?.name}</h2>
      <p className="text-sm text-gray-500 mb-6">
        Officer ID: {officer?.officerId}
      </p>

      {offline && (
        <div className="mb-6 bg-yellow-900/30 border border-yellow-800 text-yellow-300 text-xs rounded px-3 py-2">
          Couldn't reach the backend on port 8000 — start it to see live
          alerts and pressure data.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/app/chat"
          className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-blue-500 transition"
        >
          <h3 className="font-semibold text-blue-400 mb-1">
            🧭 Case Canvas &amp; Chat
          </h3>
          <p className="text-xs text-gray-500">
            Ask the AI investigator about suspects, FIRs, or locations —
            by text or voice, in English or Kannada.
          </p>
        </Link>

        <Link
          to="/app/pressure"
          className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-blue-500 transition"
        >
          <h3 className="font-semibold text-blue-400 mb-1">
            🔥 Crime Pressure Map
          </h3>
          <p className="text-xs text-gray-500">
            {loading
              ? "Loading zone data..."
              : `${zoneCount} zones tracked across Karnataka.`}
          </p>
        </Link>
      </div>

      <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Active Anomaly Alerts</h3>
        {loading ? (
          <p className="text-xs text-gray-500">Loading...</p>
        ) : alerts.length === 0 ? (
          <p className="text-xs text-gray-500">No active alerts.</p>
        ) : (
          <ul className="space-y-1">
            {alerts.map((a, i) => (
              <li key={a.zone_id || i} className="text-xs text-yellow-400">
                ⚠ {a.district || a.zone_id || "Zone"}:{" "}
                {a.message || "elevated pressure score"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
