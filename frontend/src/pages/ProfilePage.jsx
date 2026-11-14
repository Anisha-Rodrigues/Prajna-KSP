import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMemory } from "../utils/api";

export default function ProfilePage() {
  const { officer } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!officer?.officerId) return;
    let cancelled = false;

    async function load() {
      try {
        const data = await getMemory(officer.officerId);
        if (!cancelled) setThreads(data.threads || []);
      } catch {
        if (!cancelled) {
          setError(
            "Could not load memory history — check that the backend is running on port 8000."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [officer?.officerId]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-xl font-bold mb-4">Officer Profile</h2>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 max-w-md space-y-1">
        <p className="text-sm">
          <span className="text-gray-500">Name:</span> {officer?.name}
        </p>
        <p className="text-sm">
          <span className="text-gray-500">Officer ID:</span>{" "}
          {officer?.officerId}
        </p>
        <p className="text-sm">
          <span className="text-gray-500">Session:</span>{" "}
          {officer?.sessionId}
        </p>
        <p className="text-sm">
          <span className="text-gray-500">Logged in:</span>{" "}
          {officer?.loginAt ? new Date(officer.loginAt).toLocaleString() : "—"}
        </p>
      </div>

      <h3 className="font-semibold mb-2">Memory Weaving History</h3>
      {loading ? (
        <p className="text-xs text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : threads.length === 0 ? (
        <p className="text-xs text-gray-500">No queries logged yet.</p>
      ) : (
        <ul className="space-y-2">
          {threads.map((t) => (
            <li
              key={t.memory_thread_id}
              className="bg-gray-900 border border-gray-800 rounded p-3 text-xs"
            >
              <p className="text-gray-300">{t.query}</p>
              <p className="text-gray-600 mt-1">{t.outcome}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
