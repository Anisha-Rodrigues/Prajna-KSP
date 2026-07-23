import React, { useState, useEffect } from 'react';
import { History, Shield, FileSpreadsheet, RefreshCw, AlertTriangle, CheckCircle2, User, ExternalLink, MessageSquare } from 'lucide-react';
import { getOfficerMemory, submitOfficerDissent } from '../utils/api';
import IntelligenceBrief from './IntelligenceBrief';

export default function MemoryPage({ nodes = [], citedFirs = [], onNavigateToChat }) {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedThreadForDissent, setSelectedThreadForDissent] = useState(null);
  const [dissentNotes, setDissentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBriefModal, setShowBriefModal] = useState(false);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    setIsLoading(true);
    try {
      const data = await getOfficerMemory('OFF-4092');
      setMemories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDissentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedThreadForDissent || !dissentNotes.trim()) return;

    setIsSubmitting(true);
    try {
      await submitOfficerDissent(selectedThreadForDissent.thread_id, dissentNotes);
      setDissentNotes('');
      setSelectedThreadForDissent(null);
      await loadMemories();
    } catch (err) {
      console.error(err);
      alert('Failed to log officer dissent feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="min-h-full bg-slate-950 text-slate-100 overflow-y-auto p-6 md:p-10 space-y-8">
      
      {/* Top Banner */}
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60 uppercase">
              Memory Weaving & Audit
            </span>
            <span class="text-xs text-slate-400 font-mono">Officer ID: OFF-4092</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold font-display text-white">
            Memory Weaving & Intelligence Briefs
          </h1>
          <p class="text-xs text-slate-400">
            Immutable audit logs of investigator queries, AI findings, officer dissent flags & official PDF exports.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            onClick={loadMemories}
            class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw class="w-4 h-4 text-sky-400" />
            <span>Refresh Audit Log</span>
          </button>

          <button
            onClick={() => setShowBriefModal(true)}
            class="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg border border-amber-500/40 flex items-center gap-2 transition transform hover:scale-105"
          >
            <FileSpreadsheet class="w-4 h-4" />
            <span>Export Intelligence Brief PDF</span>
          </button>
        </div>
      </div>

      {/* Memory Threads Grid */}
      <div class="space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-2">
          <History class="w-4 h-4 text-indigo-400" />
          Investigator Interaction Threads ({memories.length})
        </h2>

        {isLoading ? (
          <div class="p-8 text-center text-slate-500 text-xs animate-pulse">
            Loading memory history...
          </div>
        ) : memories.length === 0 ? (
          <div class="p-8 text-center text-slate-500 text-xs">
            No memory threads recorded yet. Query the AI Copilot to generate memory threads.
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memories.map((mem) => (
              <div
                key={mem.thread_id}
                class="glass-panel border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition shadow-lg"
              >
                <div class="space-y-3 text-xs">
                  
                  {/* Header info */}
                  <div class="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-indigo-400 font-bold text-xs">{mem.thread_id}</span>
                      <span class="text-[10px] px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-400">
                        {mem.session_id}
                      </span>
                    </div>
                    <span class="text-[10px] text-slate-400">{mem.timestamp}</span>
                  </div>

                  {/* Query */}
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Investigator Query:</span>
                    <p class="font-semibold text-slate-100 text-xs">{mem.query}</p>
                  </div>

                  {/* Response */}
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">AI Copilot Finding:</span>
                    <p class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                      {mem.response}
                    </p>
                  </div>

                  {/* Cited FIRs */}
                  {mem.cited_firs && mem.cited_firs.length > 0 && (
                    <div class="flex flex-wrap items-center gap-1.5 pt-1">
                      <span class="text-[10px] text-slate-400 font-semibold">Cited Cases:</span>
                      {mem.cited_firs.map((fir, idx) => (
                        <span key={idx} class="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800/60 rounded font-mono text-[10px]">
                          {fir}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Officer Dissent Note display */}
                  {mem.dissent_flag && mem.dissent_notes && (
                    <div class="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-[11px] space-y-1">
                      <span class="font-bold flex items-center gap-1 text-[10px] uppercase text-red-400">
                        <AlertTriangle class="w-3.5 h-3.5" /> Logged Officer Dissent:
                      </span>
                      <p>{mem.dissent_notes}</p>
                    </div>
                  )}

                </div>

                {/* Footer Actions */}
                <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 ${
                    mem.dissent_flag
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {mem.dissent_flag ? (
                      <>
                        <AlertTriangle class="w-3 h-3" /> Dissent Logged
                      </>
                    ) : (
                      <>
                        <CheckCircle2 class="w-3 h-3" /> {mem.outcome_tag}
                      </>
                    )}
                  </span>

                  <div class="flex items-center gap-2">
                    {!mem.dissent_flag && (
                      <button
                        onClick={() => setSelectedThreadForDissent(mem)}
                        class="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/60 rounded-lg text-[11px] font-medium transition"
                      >
                        Flag Dissent
                      </button>
                    )}

                    <button
                      onClick={() => onNavigateToChat && onNavigateToChat(mem.query)}
                      class="px-2.5 py-1 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 rounded-lg text-[11px] font-medium flex items-center gap-1 transition"
                    >
                      <MessageSquare class="w-3 h-3" />
                      <span>Re-open in Chat</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dissent Modal Form */}
      {selectedThreadForDissent && (
        <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div class="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 shadow-2xl space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 class="font-bold text-sm text-slate-100 font-display flex items-center gap-2">
                <AlertTriangle class="w-4 h-4 text-amber-400" />
                Log Officer Dissent for {selectedThreadForDissent.thread_id}
              </h3>
              <button
                onClick={() => setSelectedThreadForDissent(null)}
                class="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed">
              Query: <em class="text-indigo-300">"{selectedThreadForDissent.query}"</em>
            </p>

            <form onSubmit={handleDissentSubmit} class="space-y-3">
              <textarea
                rows={3}
                required
                value={dissentNotes}
                onChange={(e) => setDissentNotes(e.target.value)}
                placeholder="Explain why you disagree with AI findings or provide alternate operational evidence..."
                class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <div class="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedThreadForDissent(null)}
                  class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !dissentNotes.trim()}
                  class="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition"
                >
                  {isSubmitting ? 'Saving...' : 'Submit Dissent Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Intelligence Brief PDF Generator Modal */}
      {showBriefModal && (
        <IntelligenceBrief
          nodes={nodes}
          citedFirs={citedFirs}
          activeMemoryThreadId="MEM-1001"
          onClose={() => setShowBriefModal(false)}
        />
      )}

    </div>
  );
}
