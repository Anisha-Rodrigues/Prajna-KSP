import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAlerts } from "../utils/api";
import PitchDeckModal from "./PitchDeckModal";

const LINKS = [
  {
    to: "/app",
    label: "Overview",
    end: true,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: "/app/chat",
    label: "Case Canvas & AI",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    to: "/app/scanner",
    label: "Biometric Scanner",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    to: "/app/pressure",
    label: "Pressure Heatmap",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    to: "/app/profile",
    label: "Security Dossier",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function Sidebar({ officer, onLogout }) {
  const [alertCount, setAlertCount] = useState(0);
  const [showPitchDeck, setShowPitchDeck] = useState(false);

  useEffect(() => {
    getAlerts()
      .then((data) => setAlertCount((data.alerts || []).length))
      .catch(() => {});
  }, []);

  return (
    <>
      <aside className="w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-800">
        <h1 className="font-bold text-base tracking-wide flex items-center gap-2">
          PRAJNA
          <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/40 px-1.5 py-0.2 rounded font-mono font-semibold">
            v2.4
          </span>
        </h1>
        <span className="block text-[11px] text-gray-400 mt-0.5 tracking-normal">
          Intelligence &amp; Public Safety
        </span>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center justify-between gap-2 px-3 py-2 rounded text-sm transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="flex items-center gap-2">
              <span className="text-base leading-none">{link.icon}</span>
              <span>{link.label}</span>
            </span>
            {link.to === "/app" && alertCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {alertCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-gray-800">
        <button
          onClick={() => setShowPitchDeck(true)}
          className="w-full bg-gradient-to-r from-blue-900/40 to-indigo-900/40 hover:from-blue-800/60 hover:to-indigo-800/60 border border-blue-500/30 text-blue-300 rounded-lg p-2 text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Startup Pitch &amp; ROI
        </button>
      </div>

      <div className="px-4 py-3 border-t border-gray-800">
        <p className="text-xs text-gray-300 truncate font-medium">
          {officer?.name || "Officer"}
        </p>
        <p className="text-[11px] text-gray-600 truncate mb-2">
          {officer?.officerId}
        </p>
        <button
          onClick={onLogout}
          className="text-xs text-red-400 hover:text-red-300 transition"
        >
          Sign out
        </button>
      </div>
    </aside>

    <PitchDeckModal isOpen={showPitchDeck} onClose={() => setShowPitchDeck(false)} />
  </>
  );
}
