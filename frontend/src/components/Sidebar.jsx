import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAlerts } from "../utils/api";

const LINKS = [
  { to: "/app", label: "Home", icon: "⌂", end: true },
  { to: "/app/chat", label: "Case Canvas & Chat", icon: "◈" },
  { to: "/app/scanner", label: "Biometric Scanner", icon: "🛡️" },
  { to: "/app/pressure", label: "Pressure Map", icon: "◉" },
  { to: "/app/profile", label: "Officer Profile", icon: "◷" },
];

export default function Sidebar({ officer, onLogout }) {
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    getAlerts()
      .then((data) => setAlertCount((data.alerts || []).length))
      .catch(() => {});
  }, []);

  return (
    <aside className="w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-800">
        <h1 className="font-bold text-base tracking-wide">
          PRAJNA
          <span className="block text-xs font-normal text-blue-400 tracking-normal">
            Crime Intelligence Platform
          </span>
        </h1>
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
  );
}
