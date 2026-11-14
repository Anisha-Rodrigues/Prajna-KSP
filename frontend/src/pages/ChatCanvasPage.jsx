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
            <div className="absolute top-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 w-72 shadow-xl">
              <button
                onClick={() => setSelectedNode(null)}
                className="float-right text-gray-500 hover:text-white"
              >
                ✕
              </button>
              <h3 className="font-semibold text-sm">{selectedNode.label}</h3>
              <p className="text-xs text-gray-400 capitalize">
                {selectedNode.type}
              </p>
              <pre className="text-xs mt-2 text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(selectedNode, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
