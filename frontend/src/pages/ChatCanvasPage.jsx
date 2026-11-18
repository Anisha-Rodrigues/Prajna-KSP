import { useState, useCallback } from "react";
import CaseCanvas from "../components/CaseCanvas";
import ChatPanel from "../components/ChatPanel";
import IntelligenceBrief from "../components/IntelligenceBrief";
import { useAuth } from "../context/AuthContext";

export default function ChatCanvasPage() {
  const { officer } = useAuth();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [citedFIRs, setCitedFIRs] = useState([]);
  const [aiFindings, setAiFindings] = useState("");
  const [showBrief, setShowBrief] = useState(false);

  const handleNodesReceived = useCallback((newNodes, newEdges) => {
    setNodes((prev) => {
      const existingIds = new Set(prev.map((n) => n.id));
      return [...prev, ...newNodes.filter((n) => !existingIds.has(n.id))];
    });
    setEdges((prev) => {
      const key = (e) => `${e.source}-${e.target}`;
      const existingKeys = new Set(prev.map(key));
      return [...prev, ...newEdges.filter((e) => !existingKeys.has(key(e)))];
    });
  }, []);

  const handleAiReply = useCallback((text, firs) => {
    setAiFindings(text);
    if (firs?.length) setCitedFIRs((prev) => [...new Set([...prev, ...firs])]);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between relative">
        <h2 className="font-semibold text-sm text-gray-300">
          Case Canvas &amp; Chat
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            Officer: {officer?.officerId}
          </span>
          <button
            onClick={() => setShowBrief((v) => !v)}
            className="text-xs text-blue-400 whitespace-nowrap"
          >
            {showBrief ? "Hide Brief" : "Intelligence Brief"}
          </button>
        </div>

        {showBrief && (
          <div className="fixed top-14 right-4 w-72 max-w-[90vw] max-h-[80vh] overflow-y-auto z-50">
            <IntelligenceBrief
              officerName={officer?.name}
              officerId={officer?.officerId}
              sessionId={officer?.sessionId}
              canvasNodes={nodes}
              citedFIRs={citedFIRs}
              aiFindings={aiFindings}
              alerts={[]}
            />
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-96 flex-shrink-0">
          <ChatPanel
            officerId={officer?.officerId}
            sessionId={officer?.sessionId}
            onNodesReceived={handleNodesReceived}
            onAiReply={handleAiReply}
          />
        </div>
        <div className="flex-1 relative">
          <CaseCanvas nodes={nodes} edges={edges} onNodeClick={setSelectedNode} />
          {selectedNode && (
            <div className="absolute top-4 right-4 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-4 w-80 shadow-2xl z-40 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  selectedNode.type === "suspect" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                  selectedNode.type === "fir" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                  selectedNode.type === "evidence" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                  "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}>
                  {selectedNode.type} Entity
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-white text-sm p-1"
                >
                  ✕
                </button>
              </div>

              <h3 className="font-bold text-base mt-2 text-white">{selectedNode.label}</h3>

              {/* Suspect profile photo */}
              {selectedNode.type === "suspect" && selectedNode.data?.photo_url && (
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-700 bg-black/40">
                  <div className="bg-gray-800/80 px-2 py-1 text-[10px] font-mono text-gray-300 flex justify-between items-center">
                    <span>KSP BIOMETRIC RECORD</span>
                    <span className="text-emerald-400 font-bold">ON FILE</span>
                  </div>
                  <img
                    src={selectedNode.data.photo_url}
                    alt={selectedNode.data?.name}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              {/* Evidence / photo proof */}
              {selectedNode.data?.image_url && (
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-700 bg-black/40">
                  <div className="bg-gray-800/80 px-2 py-1 text-[10px] font-mono text-gray-300 flex justify-between items-center">
                    <span>{selectedNode.data?.type?.toUpperCase() || "EVIDENCE"} — {selectedNode.data?.source?.split("—")[0]?.trim() || "VERIFIED EXHIBIT"}</span>
                    <span className="text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                  <img
                    src={selectedNode.data.image_url}
                    alt={selectedNode.label}
                    className="w-full h-44 object-cover"
                  />
                  {selectedNode.data.timestamp && (
                    <div className="p-2 text-[10px] font-mono text-gray-400 border-t border-gray-800">
                      <div>Logged: {selectedNode.data.timestamp}</div>
                      <div className="text-gray-500 truncate">Source: {selectedNode.data.source}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Description & Structured details */}
              <div className="mt-3 space-y-2 text-xs">
                {selectedNode.data?.description && (
                  <p className="text-gray-300 leading-relaxed bg-gray-950/60 p-2.5 rounded-lg border border-gray-800/80">
                    {selectedNode.data.description}
                  </p>
                )}

                {selectedNode.type === "suspect" && (
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    <div className="bg-gray-800/60 p-2 rounded">
                      <span className="text-gray-500 block">Risk Category</span>
                      <span className="font-semibold text-rose-400 uppercase">{selectedNode.data?.risk_level}</span>
                    </div>
                    <div className="bg-gray-800/60 p-2 rounded">
                      <span className="text-gray-500 block">Bail Status</span>
                      <span className="font-semibold text-amber-300">{selectedNode.data?.bail_status?.replace('_', ' ')}</span>
                    </div>
                    {selectedNode.data?.known_locations && (
                      <div className="col-span-2 bg-gray-800/60 p-2 rounded">
                        <span className="text-gray-500 block">Frequent Jurisdictions</span>
                        <span className="text-gray-200">{selectedNode.data.known_locations.join(", ")}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedNode.type === "fir" && (
                  <div className="space-y-2 pt-1 text-[11px]">
                    <div className="bg-gray-800/80 p-2.5 rounded-lg border border-gray-700">
                      <div className="text-[10px] font-mono text-blue-400 font-bold mb-1">OFFICIAL FIR DOSSIER SUMMARY</div>
                      <p className="text-gray-200 text-xs leading-relaxed mb-2">
                        {selectedNode.data?.description}
                      </p>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-400 pt-1.5 border-t border-gray-700/60">
                        <div><span className="text-gray-500">Police Station:</span> {selectedNode.data?.police_station}</div>
                        <div><span className="text-gray-500">Incident Date:</span> {selectedNode.data?.date}</div>
                        <div><span className="text-gray-500">IPC/BNS Offense:</span> <span className="text-amber-300 font-semibold uppercase">{selectedNode.data?.crime_type}</span></div>
                        <div><span className="text-gray-500">Case Status:</span> <span className="text-emerald-400 uppercase">{selectedNode.data?.status?.replace('_', ' ')}</span></div>
                      </div>
                    </div>

                    {/* Associated suspects in this FIR */}
                    {selectedNode.data?.suspect_names && (
                      <div className="bg-gray-950/80 p-2 rounded border border-gray-800">
                        <span className="text-gray-500 text-[10px] block">Chargesheeted Accused:</span>
                        <span className="text-rose-400 font-medium">{selectedNode.data.suspect_names.join(", ")}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
