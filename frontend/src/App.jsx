import React, { useState, useEffect } from 'react';
import { Home, Network, MessageSquare, Map, Shield, Cpu, AlertTriangle, ChevronRight, FileSpreadsheet } from 'lucide-react';
import WelcomePage from './components/WelcomePage';
import CaseCanvas from './components/CaseCanvas';
import ChatPanel from './components/ChatPanel';
import PressureMap from './components/PressureMap';
import MemoryPage from './components/MemoryPage';
import NodeDetail from './components/NodeDetail';
import IntelligenceBrief from './components/IntelligenceBrief';
import { getNetworkGraph, getActiveAlerts, sendQuery } from './utils/api';

export default function App() {
  // Navigation active route: 'welcome' | 'canvas' | 'chat' | 'map' | 'intelligence'
  const [activeScreen, setActiveScreen] = useState('welcome');
  
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [citedFirs, setCitedFirs] = useState(['KA/BLR/2024/001', 'KA/BLR/2024/005']);
  const [activeMemoryThreadId, setActiveMemoryThreadId] = useState('MEM-1001');

  // Initial load
  useEffect(() => {
    loadInitialGraph();
    loadAlerts();
  }, []);

  const loadInitialGraph = async () => {
    try {
      const data = await getNetworkGraph();
      setGraphData(data);
    } catch (err) {
      console.error('Failed to load graph:', err);
    }
  };

  const loadAlerts = async () => {
    try {
      const alerts = await getActiveAlerts();
      setActiveAlerts(alerts);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    }
  };

  // Handle AI query response & update Case Canvas graph
  const handleQueryResponse = (response) => {
    if (!response) return;

    if (response.cited_firs && response.cited_firs.length > 0) {
      setCitedFirs(prev => Array.from(new Set([...prev, ...response.cited_firs])));
    }
    if (response.memory_thread_id) {
      setActiveMemoryThreadId(response.memory_thread_id);
    }

    if (response.nodes && response.nodes.length > 0) {
      setGraphData(prevGraph => {
        const existingNodeIds = new Set(prevGraph.nodes.map(n => n.id));
        const newNodes = response.nodes.filter(n => !existingNodeIds.has(n.id));

        const existingEdgeKeys = new Set(prevGraph.edges.map(e => `${e.source.id || e.source}->${e.target.id || e.target}`));
        const newEdges = (response.edges || []).filter(e => {
          const key = `${e.source.id || e.source}->${e.target.id || e.target}`;
          return !existingEdgeKeys.has(key);
        });

        return {
          nodes: [...prevGraph.nodes, ...newNodes],
          edges: [...prevGraph.edges, ...newEdges]
        };
      });
    }
  };

  // Quick query navigation trigger
  const handleQuickQuery = async (keyword, targetScreen = 'canvas') => {
    setActiveScreen(targetScreen);
    try {
      const res = await sendQuery(keyword, 'en-IN', 'OFF-4092', 'SESS-8801');
      handleQueryResponse(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div class="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden text-slate-100 font-sans">
      
      {/* Top Main Navigation Bar */}
      <header class="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 shadow-md">
        
        {/* Brand & Logo */}
        <div
          onClick={() => setActiveScreen('welcome')}
          class="flex items-center gap-2.5 cursor-pointer group"
        >
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
            <Cpu class="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 class="font-extrabold text-sm tracking-wider font-display text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-200 to-indigo-300">
              PRAJNA
            </h1>
            <p class="text-[9px] font-mono text-slate-400 -mt-1 tracking-widest uppercase">
              KSP Crime Platform
            </p>
          </div>
        </div>

        {/* Dedicated Page Navigation Tabs */}
        <nav class="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
          {[
            { id: 'welcome', label: 'Overview', icon: Home },
            { id: 'canvas', label: 'Case Canvas', icon: Network },
            { id: 'chat', label: 'AI Copilot Chat', icon: MessageSquare },
            { id: 'map', label: 'Pressure Map', icon: Map, badge: activeAlerts.length > 0 },
            { id: 'intelligence', label: 'Memory & Briefs', icon: Shield }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id)}
              class={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeScreen === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon class="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span class="w-2 h-2 rounded-full bg-red-500 animate-ping ml-0.5"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Area: Alerts & Officer Badge */}
        <div class="flex items-center gap-3">
          
          {/* Export Brief Quick Action */}
          <button
            onClick={() => setShowBriefModal(true)}
            class="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 rounded-lg text-amber-300 text-xs font-semibold shadow transition"
          >
            <FileSpreadsheet class="w-3.5 h-3.5 text-amber-400" />
            <span>PDF Brief</span>
          </button>

          {/* Active Anomaly Alerts Badge */}
          {activeAlerts.length > 0 && (
            <div
              onClick={() => setActiveScreen('map')}
              class="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 bg-red-950/80 border border-red-800/80 rounded-lg text-red-300 text-[11px] font-semibold hover:bg-red-900 transition animate-pulse"
              title="Click to view pressure map"
            >
              <AlertTriangle class="w-3.5 h-3.5 text-red-400" />
              <span>{activeAlerts.length} Alerts</span>
            </div>
          )}

          {/* Officer Profile Badge */}
          <div class="flex items-center gap-2 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="font-medium text-slate-300 text-[11px]">Insp. K. V. Sharma</span>
            <span class="text-slate-500 font-mono text-[9.5px]">OFF-4092</span>
          </div>

        </div>

      </header>

      {/* Anomaly Signal Bar */}
      {activeAlerts.length > 0 && activeScreen !== 'welcome' && (
        <div class="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border-b border-red-900/40 px-4 py-1.5 text-xs text-red-200 flex items-center justify-between z-20">
          <div class="flex items-center gap-2">
            <AlertTriangle class="w-3.5 h-3.5 text-red-400 animate-bounce" />
            <span class="font-bold uppercase tracking-wider text-[10px] text-red-400">ANOMALY ALERT:</span>
            <span>{activeAlerts[0].message}</span>
          </div>
          <button
            onClick={() => handleQuickQuery(activeAlerts[0].zone_name.split(' ')[0], 'chat')}
            class="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 underline"
          >
            <span>Query Copilot for {activeAlerts[0].zone_name.split(' ')[0]}</span>
            <ChevronRight class="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Dedicated Screen View Area */}
      <div class="flex-1 flex overflow-hidden relative">
        
        {/* PAGE 1: Welcome & Overview */}
        {activeScreen === 'welcome' && (
          <main class="w-full h-full overflow-y-auto">
            <WelcomePage onNavigate={(screen) => setActiveScreen(screen)} />
          </main>
        )}

        {/* PAGE 2: Dedicated Case Canvas Graph Page */}
        {activeScreen === 'canvas' && (
          <main class="w-full h-full relative overflow-hidden">
            <CaseCanvas
              graphData={graphData}
              onNodeSelect={(node) => setSelectedNode(node)}
              onExportBrief={() => setShowBriefModal(true)}
            />
          </main>
        )}

        {/* PAGE 3: Dedicated AI Copilot Chat Page */}
        {activeScreen === 'chat' && (
          <main class="w-full h-full flex justify-center bg-slate-950 p-4 md:p-6 overflow-hidden">
            <div class="w-full max-w-4xl h-full rounded-2xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
              <ChatPanel
                onQueryResponse={handleQueryResponse}
                activeMemoryThreadId={activeMemoryThreadId}
                onSelectFir={(fir) => handleQuickQuery(fir, 'chat')}
              />
            </div>
          </main>
        )}

        {/* PAGE 4: Dedicated Crime Pressure Map Page */}
        {activeScreen === 'map' && (
          <main class="w-full h-full relative overflow-hidden">
            <PressureMap
              onSelectZoneForQuery={(zoneKeyword) => handleQuickQuery(zoneKeyword, 'chat')}
            />
          </main>
        )}

        {/* PAGE 5: Dedicated Memory & Intelligence Briefs Page */}
        {activeScreen === 'intelligence' && (
          <main class="w-full h-full overflow-y-auto">
            <MemoryPage
              nodes={graphData.nodes}
              citedFirs={citedFirs}
              onNavigateToChat={(query) => handleQuickQuery(query, 'chat')}
            />
          </main>
        )}

        {/* Node Detail Side Inspector Modal */}
        {selectedNode && (
          <NodeDetail
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onSearchRelated={(keyword) => {
              setSelectedNode(null);
              handleQuickQuery(keyword, 'chat');
            }}
          />
        )}

        {/* Intelligence Brief PDF Exporter Modal */}
        {showBriefModal && (
          <IntelligenceBrief
            nodes={graphData.nodes}
            citedFirs={citedFirs}
            activeMemoryThreadId={activeMemoryThreadId}
            onClose={() => setShowBriefModal(false)}
          />
        )}

      </div>

    </div>
  );
}
