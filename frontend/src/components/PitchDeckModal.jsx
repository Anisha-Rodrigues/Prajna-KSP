import { useState } from "react";

export default function PitchDeckModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gray-900 border border-gray-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">PRAJNA Intelligence Systems</h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  VENTURE DECK 2026
                </span>
              </div>
              <p className="text-xs text-gray-400">
                GovTech &amp; Enterprise Security Intelligence SaaS — Business Expo Dossier
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 bg-gray-950/40 px-6 overflow-x-auto">
          {[
            { id: "overview", label: "Executive Summary" },
            { id: "market", label: "Market Size (TAM)" },
            { id: "business", label: "Revenue & Pricing" },
            { id: "roi", label: "Unit Economics & ROI" },
            { id: "moat", label: "Competitive Moat" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-300">
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/20 p-4 rounded-xl border border-blue-800/40">
                <h4 className="text-base font-bold text-white mb-1">
                  The Enterprise &amp; GovTech Security Problem
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Law enforcement agencies and high-security enterprise facilities (airports, tech corridors, banking networks) operate on disconnected, reactive data silos. Crimes taking place across adjacent police jurisdictions take an average of <span className="text-amber-300 font-bold">45 days</span> to correlate, costing over <span className="text-rose-400 font-bold">₹12,000 Cr</span> in unrecovered financial fraud and misallocated patrol resources annually.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <div className="text-2xl font-black text-blue-400 mb-1">45d → 4min</div>
                  <div className="text-xs font-bold text-white mb-1">Investigation Velocity</div>
                  <p className="text-[11px] text-gray-400">
                    Autonomous knowledge graph linking cross-district FIRs, suspects, and forensic evidence instantly.
                  </p>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <div className="text-2xl font-black text-emerald-400 mb-1">34%</div>
                  <div className="text-xs font-bold text-white mb-1">Patrol Cost Reduction</div>
                  <p className="text-[11px] text-gray-400">
                    Predictive crime pressure routing prevents wasted fuel and optimizes dynamic police deployment.
                  </p>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <div className="text-2xl font-black text-purple-400 mb-1">Zero-ID</div>
                  <div className="text-xs font-bold text-white mb-1">Biometric Triage</div>
                  <p className="text-[11px] text-gray-400">
                    Sub-second edge facial recognition &amp; NAFIS fingerprint matching for offenders concealing identity.
                  </p>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Target Customer Segments</h5>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/60">
                    <span className="font-bold text-white block mb-0.5">B2G: State Police &amp; ICJS</span>
                    <span className="text-gray-400 text-[11px]">Karnataka Police (KSP), CCTNS, State Crime Records Bureau (SCRB).</span>
                  </div>
                  <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/60">
                    <span className="font-bold text-white block mb-0.5">B2B: Private Enterprises</span>
                    <span className="text-gray-400 text-[11px]">Commercial Banks (ATM fraud), IT Tech Parks, Airports &amp; Logistics Hubs.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "market" && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-950 p-5 rounded-xl border border-blue-500/30">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">TAM</span>
                  <div className="text-2xl font-black text-blue-400 my-1">$45.8B</div>
                  <span className="text-xs text-gray-400">Global AI GovTech &amp; Public Safety Market</span>
                </div>
                <div className="bg-gray-950 p-5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">SAM</span>
                  <div className="text-2xl font-black text-emerald-400 my-1">$2.4B</div>
                  <span className="text-xs text-gray-400">Indian Smart City &amp; Surveillance Modernization</span>
                </div>
                <div className="bg-gray-950 p-5 rounded-xl border border-amber-500/30">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">SOM (Year 3)</span>
                  <div className="text-2xl font-black text-amber-400 my-1">₹85 Cr</div>
                  <span className="text-xs text-gray-400">30 Districts in Karnataka + Top 5 Metro Banking Grids</span>
                </div>
              </div>

              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">Industry Macro Tailwinds:</h5>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                  <li><strong className="text-white">Smart Cities Mission &amp; Safe City Project:</strong> Ministry of Home Affairs mandate for AI CCTV analytics across Tier-1 and Tier-2 Indian cities.</li>
                  <li><strong className="text-white">BNS / BNSS Judicial Modernization:</strong> New criminal code requires mandatory digital evidence logging and forensic custody tracking.</li>
                  <li><strong className="text-white">Commercial Bank Mandates:</strong> RBI requirements for ATM security telemetry to curb physical skimming and jackpotting fraud.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "business" && (
            <div className="space-y-5">
              <h4 className="text-sm font-bold text-white">Hybrid B2G &amp; B2B SaaS Licensing Model</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                      B2G MUNICIPAL
                    </span>
                    <div className="text-xl font-bold text-white mt-3">₹25L <span className="text-xs font-normal text-gray-400">/ district / yr</span></div>
                    <p className="text-xs text-gray-400 mt-2">
                      Full jurisdiction deployment: CCTNS sync, Case Canvas graph, Pressure Surface analytics, unlimited officer seats.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-500">
                    Target: 31 Districts in Karnataka
                  </div>
                </div>

                <div className="bg-gray-950 p-4 rounded-xl border border-emerald-500/40 ring-1 ring-emerald-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      B2B ENTERPRISE SHIELD
                    </span>
                    <div className="text-xl font-bold text-white mt-3">₹8L <span className="text-xs font-normal text-gray-400">/ campus / yr</span></div>
                    <p className="text-xs text-gray-400 mt-2">
                      Private commercial deployment: Tech corridors (Manyata, RMZ, E-City), ATM networks, perimeter biometric alerts.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-500">
                    Target: 140+ IT Parks &amp; Bank Hubs
                  </div>
                </div>

                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                      BIOMETRIC API CLOUD
                    </span>
                    <div className="text-xl font-bold text-white mt-3">₹1.50 <span className="text-xs font-normal text-gray-400">/ query</span></div>
                    <p className="text-xs text-gray-400 mt-2">
                      Pay-as-you-go microservice for background checks, airport security checkpoints, and judicial verify calls.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-500">
                    Target: 10M+ annual queries
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "roi" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Quantifiable Return on Investment (ROI) for Customers</h4>
              <div className="space-y-3">
                <div className="bg-gray-950 p-3.5 rounded-lg border border-gray-800 flex items-start justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-xs text-emerald-400">₹4.2 Cr Saved in Patrol Optimization</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                      By predicting high-pressure crime hotzones, police battalions cut random wandering patrols by 34%, drastically saving fuel and vehicle depreciation across Bengaluru Urban.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-white px-2 py-1 rounded bg-gray-900 border border-gray-800 shrink-0">
                    ROI: 6.8x
                  </span>
                </div>

                <div className="bg-gray-950 p-3.5 rounded-lg border border-gray-800 flex items-start justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-xs text-blue-400">₹14.8 Cr ATM Skimming Prevention</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Correlating ATM card reader telemetry and repeat suspects (Raju Kumar / S001) enables proactive shutdown before skimming syndicates execute cash extraction.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-white px-2 py-1 rounded bg-gray-900 border border-gray-800 shrink-0">
                    ROI: 12.4x
                  </span>
                </div>

                <div className="bg-gray-950 p-3.5 rounded-lg border border-gray-800 flex items-start justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-xs text-purple-400">70% Reduction in Cold Cases</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Cross-station intelligence linking connects inter-state warrants (e.g. Mumbai / Ranchi) within seconds without waiting for physical mail dossiers.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-white px-2 py-1 rounded bg-gray-900 border border-gray-800 shrink-0">
                    High Impact
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "moat" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Defensible Technology &amp; Competitive Moats</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                  <div className="font-bold text-blue-400 mb-1">1. Memory Weaving (IP)</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Unlike standard vector RAG, Memory Weaving threads contextual intelligence across different officers, shifts, and years so knowledge isn't lost on transfer.
                  </p>
                </div>
                <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                  <div className="font-bold text-emerald-400 mb-1">2. Bi-directional Dissent Engine</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Investigating officers can dissent against AI hypotheses. This eliminates hallucination liability and creates proprietary human-in-the-loop training data.
                  </p>
                </div>
                <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                  <div className="font-bold text-amber-400 mb-1">3. Offline-First Edge Resiliency</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Biometric scanner and forensic graph query engines operate without active cloud connections, critical for high-security and field police stations.
                  </p>
                </div>
                <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                  <div className="font-bold text-purple-400 mb-1">4. High B2G Switching Cost</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Once integrated into state police CCTNS and safe-city cameras, PRAJNA becomes the mission-critical core operating system for the entire department.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-800 bg-gray-950/80 flex items-center justify-between text-xs">
          <span className="text-gray-500 font-mono">
            Founder: Anisha Rodrigues · PRAJNA Intelligence Systems
          </span>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-1.5 rounded-lg transition"
          >
            Close Deck
          </button>
        </div>
      </div>
    </div>
  );
}