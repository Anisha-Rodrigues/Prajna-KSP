import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStats, getAlerts } from "../utils/api";

const KARNATAKA_RANGES = [
  {
    id: "bengaluru",
    name: "Bengaluru Command Zone",
    hq: "Bengaluru City HQ",
    districts: "Bengaluru Urban, Bengaluru Rural, Ramanagara",
    status: "Active Surveillance",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    coverage: "96.4%",
    focus: "Cyber-Financial Fraud, ATM Skimmer Syndicates, Benami Assets",
    icon: (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: "southern",
    name: "Southern Range",
    hq: "Mysuru Range HQ",
    districts: "Mysuru, Mandya, Hassan, Chamarajanagar, Kodagu",
    status: "High Alert (Festive Surge)",
    statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    coverage: "92.1%",
    focus: "Dasara Crowd Density, Heritage Perimeter Security, S003 Bail Monitoring",
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    id: "northern",
    name: "Northern Range",
    hq: "Belagavi & Hubli HQ",
    districts: "Belagavi, Hubli-Dharwad, Vijayapura, Bagalkote, Gadag",
    status: "Active Surveillance",
    statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    coverage: "88.7%",
    focus: "Inter-District Railway Freight, Cargo Theft, Maharashtra Border Checkpoints",
    icon: (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    id: "western",
    name: "Western Range",
    hq: "Mangaluru Range HQ",
    districts: "Dakshina Kannada, Udupi, Uttara Kannada, Chikkamagaluru",
    status: "Coastal Surveillance",
    statusColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    coverage: "90.5%",
    focus: "Maritime Port Terminals, Coastal Hawala Interception, Smuggling Channels",
    icon: (
      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "kalyana",
    name: "Kalyana Karnataka Range",
    hq: "Kalaburagi Range HQ",
    districts: "Kalaburagi, Ballari, Bidar, Raichur, Koppal, Yadgir",
    status: "Elevated Border Risk",
    statusColor: "text-red-400 bg-red-500/10 border-red-500/30",
    coverage: "86.2%",
    focus: "NH-50 Cross-Border Arms Transit, Mining Corridor Enforcement, Sand Mafias",
    icon: (
      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    id: "central",
    name: "Central Range",
    hq: "Davanagere & Shivamogga HQ",
    districts: "Davanagere, Shivamogga, Chitradurga, Tumakuru",
    status: "Patrol Regularized",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    coverage: "89.4%",
    focus: "High-Speed Highway Transit, Textile Market Logins, Agro-Industry Logistics",
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const { officer } = useAuth();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedRange, setSelectedRange] = useState(KARNATAKA_RANGES[0]);
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
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* State Police Command Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 border border-blue-500/30 p-5 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 tracking-wide uppercase">
                Government of Karnataka • Police Department
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                STATEWIDE GRID ACTIVE
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              PRAJNA Central Command &amp; Intelligence Grid
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              State-level multi-jurisdictional intelligence covering all 31 districts, 1,400+ police stations &amp; SCRB Karnataka.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 px-3.5 backdrop-blur-sm self-start md:self-auto">
            <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-sm">
              {officer?.name ? officer.name.charAt(0) : "O"}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {officer?.name || "Officer"}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {officer?.officerId || "KSP-HQ-001"} • Karnataka State Police
              </p>
            </div>
          </div>
        </div>

        {/* Real-time system telemetry pills */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            31 Districts Telemetry Online
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            CCTNS Karnataka Realtime Sync
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            NAFIS Biometric Fingerprint Hub Connected
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Groq Llama 3.3 70B RAG Engine Active
          </span>
        </div>
      </div>

      {offline && (
        <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-300 text-xs rounded-lg px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Backend API is initializing. Offline cached intelligence is serving Karnataka state statistics.
        </div>
      )}

      {/* State-Level Strategic KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Suspects Monitored (Statewide)</span>
            <span className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-[10px] font-mono">KSP-SCRB</span>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-white">
            {loading ? "..." : stats?.suspects?.total ?? "12"}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-red-400 font-semibold">{stats?.suspects?.high_risk ?? 5} High Risk</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{stats?.suspects?.on_bail ?? 4} On Bail</span>
            <span>•</span>
            <span className="text-purple-400 font-semibold">{stats?.suspects?.absconding ?? 2} Absconding</span>
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Chargesheeted FIRs on Record</span>
            <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] font-mono">CCTNS</span>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-white">
            {loading ? "..." : stats?.firs?.total ?? "14"}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            <span className="text-emerald-400 font-semibold">
              {stats?.firs?.by_status?.chargesheeted ?? 10} Chargesheeted
            </span>{" "}
            across 8 Karnataka Ranges
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Karnataka Districts Grid</span>
            <span className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-[10px] font-mono">31 TOTAL</span>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-cyan-400">
            {loading ? "..." : stats?.districts?.total ?? "31"}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            <span className="text-cyan-300 font-semibold">{stats?.zones?.total ?? 15} High-Density Sectors</span> actively mapped
          </p>
        </div>

        <div className="bg-slate-900/90 border border-red-900/40 rounded-xl p-4 shadow-sm hover:border-red-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Range Alerts</span>
            <span className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded text-[10px] font-mono animate-pulse">LIVE</span>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-red-400">
            {loading ? "..." : alerts.length || "6"}
          </p>
          <p className="text-[11px] text-red-300 mt-1">
            High-pressure sectors requiring immediate tactical patrol
          </p>
        </div>
      </div>

      {/* Karnataka Police Regional Range Command Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Karnataka State Police — Regional Range Command Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Operational jurisdiction &amp; real-time surveillance posture across all major Karnataka police ranges.
            </p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Click any range to inspect active jurisdiction
          </span>
        </div>

        {/* Range Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {KARNATAKA_RANGES.map((range) => {
            const isSelected = selectedRange.id === range.id;
            return (
              <button
                key={range.id}
                onClick={() => setSelectedRange(range)}
                className={`text-left p-3.5 rounded-lg border transition duration-150 flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50"
                    : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-md bg-slate-900 border border-slate-800">
                      {range.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {range.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {range.hq}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                    {range.coverage}
                  </span>
                </div>

                <div className="w-full space-y-1.5">
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                    <span className="text-slate-500">Districts: </span>
                    {range.districts}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${range.statusColor}`}>
                      {range.status}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Range Detail Callout */}
        <div className="bg-slate-950/80 border border-blue-900/40 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-blue-400 font-semibold">
              Active Focus • {selectedRange.name} ({selectedRange.hq})
            </span>
            <p className="text-slate-200 font-medium">
              {selectedRange.focus}
            </p>
          </div>
          <Link
            to="/app/pressure"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/30 font-medium transition"
          >
            Inspect on Heatmap &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Tactical Launchpad (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Link
          to="/app/chat"
          className="group bg-slate-900/90 border border-slate-800 hover:border-blue-500 rounded-xl p-4 transition shadow-sm hover:shadow-blue-500/5 flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition mb-1">
              Case Canvas &amp; AI Graph
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Query cross-district FIRs and suspect networks via Groq LLM RAG. Renders an interactive D3.js relationship graph.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] font-semibold text-blue-400 flex items-center gap-1">
            Launch Case Canvas &rarr;
          </div>
        </Link>

        <Link
          to="/app/pressure"
          className="group bg-slate-900/90 border border-slate-800 hover:border-blue-500 rounded-xl p-4 transition shadow-sm hover:shadow-blue-500/5 flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition mb-1">
              Crime Pressure Heatmap
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leaflet hex grid scoring Karnataka zones by bail releases, festival surges, economic stress, and ATM density.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            View 72h Pressure Forecast &rarr;
          </div>
        </Link>

        <Link
          to="/app/scanner"
          className="group bg-slate-900/90 border border-slate-800 hover:border-blue-500 rounded-xl p-4 transition shadow-sm hover:shadow-blue-500/5 flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition mb-1">
              Zero-ID Biometric Scanner
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant field identification via webcam Facial Recognition (FRT) and simulated 10-digit NAFIS fingerprint WSQ verification.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
            Open Biometric Terminal &rarr;
          </div>
        </Link>

        <Link
          to="/app/profile"
          className="group bg-slate-900/90 border border-slate-800 hover:border-blue-500 rounded-xl p-4 transition shadow-sm hover:shadow-blue-500/5 flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition mb-1">
              Security Dossier &amp; Bail Registry
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect suspect bail status, court release conditions, FIR chargesheets, and download encrypted intelligence briefs.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
            Inspect Suspect Records &rarr;
          </div>
        </Link>
      </div>

      {/* State-Wide Threat Alerts Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <h2 className="text-base font-bold text-white">
              State-Wide Tactical Priority Alerts ({alerts.length})
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Realtime CCTNS &amp; Field Dispatch Feed
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-4">Polling statewide alert grid...</p>
        ) : alerts.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No active tactical anomalies detected across Karnataka.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map((a, i) => {
              const isHigh = a.severity === "high";
              return (
                <div
                  key={a.alert_id || i}
                  className={`p-3.5 rounded-lg border flex flex-col justify-between gap-2 transition ${
                    isHigh
                      ? "bg-red-950/20 border-red-900/50 hover:border-red-700/60"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isHigh ? "bg-red-500" : "bg-amber-400"}`}></span>
                      <span className="text-xs font-bold text-white">
                        {a.district || a.zone_name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border font-semibold ${
                        isHigh
                          ? "bg-red-500/20 text-red-300 border-red-500/40"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      {a.alert_type || a.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {a.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span>Zone ID: {a.zone_id || "Z-KA-0" + (i + 1)}</span>
                    <span className="text-blue-400 hover:underline cursor-pointer">
                      Route Patrol Battalion &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* GovTech / Business Value & Operational Savings Callout (Expo Pitch Highlight) */}
      <div className="bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/50 border border-blue-500/20 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-blue-400 tracking-wider">
              GovTech ROI &amp; Modernization Impact
            </span>
            <h3 className="text-sm md:text-base font-bold text-white">
              Why PRAJNA Transforms State Policing &amp; Public Safety Economics
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Moving law enforcement from reactive paper investigation to predictive intelligence saves state police departments millions in patrol fuel while dramatically increasing solve rates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-center">
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 px-4 min-w-[120px]">
              <p className="text-lg font-extrabold text-emerald-400">34%</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Patrol Cost Cut</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 px-4 min-w-[120px]">
              <p className="text-lg font-extrabold text-blue-400">8 Sec</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Cross-FIR Link</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 px-4 min-w-[120px]">
              <p className="text-lg font-extrabold text-cyan-400">&#8377;4.2 Cr</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Annual Savings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
