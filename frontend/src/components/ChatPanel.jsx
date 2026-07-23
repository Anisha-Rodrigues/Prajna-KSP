import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, History, MessageSquare, ExternalLink, Sparkles, AlertCircle, RefreshCw, Bookmark } from 'lucide-react';
import VoiceInput from './VoiceInput';
import { sendQuery, getOfficerMemory } from '../utils/api';

export default function ChatPanel({ onQueryResponse, activeMemoryThreadId, onSelectFir }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'memory'
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "Welcome to **PRAJNA AI Investigator Assistant**.\n\nI can analyze case files, trace criminal networks, monitor bail releases, and predict crime pressure hotspots across Karnataka.\n\n*Try asking*: 'Show Raju Kumar network' or 'Crime pressure in Whitefield'.",
      cited_firs: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [memoryHistory, setMemoryHistory] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  // Load memory history on tab switch
  useEffect(() => {
    if (activeTab === 'memory') {
      loadMemoryHistory();
    }
  }, [activeTab]);

  const loadMemoryHistory = async () => {
    const memories = await getOfficerMemory('OFF-4092');
    setMemoryHistory(memories);
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    // Add user message to chat UI
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await sendQuery(query, selectedLang, 'OFF-4092', 'SESS-8801');
      
      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        cited_firs: res.cited_firs || [],
        memory_thread_id: res.memory_thread_id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      
      // Update parent canvas with new nodes and edges
      if (onQueryResponse) {
        onQueryResponse(res);
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'ai',
          text: '⚠️ API Connection Error. Please ensure backend server (`uvicorn main:app`) is running on port 8000.',
          cited_firs: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text) => {
    // Simple markdown-style bold and bullet parser
    return text.split('\n').map((line, idx) => {
      let formatted = line;
      // Bold handling
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} class={`${line.startsWith('•') ? 'ml-2 my-0.5' : 'my-1'}`}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} class="font-bold text-slate-100">{part.slice(2, -2)}</strong>;
            } else if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={pIdx} class="italic text-sky-300">{part.slice(1, -1)}</em>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div class="w-96 glass-panel border-r border-slate-800 flex flex-col h-full z-20 shadow-xl">
      {/* Top Header & Tab Toggle */}
      <div class="p-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 shadow-inner">
            <Bot class="w-5 h-5" />
          </div>
          <div>
            <h2 class="font-bold text-slate-100 text-sm font-display leading-tight">PRAJNA AI Copilot</h2>
            <p class="text-[10px] text-slate-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Memory Weaving Active
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div class="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            class={`px-2.5 py-1 rounded-md flex items-center gap-1 font-medium transition ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare class="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            class={`px-2.5 py-1 rounded-md flex items-center gap-1 font-medium transition ${
              activeTab === 'memory' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History class="w-3.5 h-3.5" />
            <span>Memory</span>
          </button>
        </div>
      </div>

      {/* CHAT TAB CONTENT */}
      {activeTab === 'chat' && (
        <>
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                class={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div class="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                  {msg.sender === 'ai' ? (
                    <>
                      <Sparkles class="w-3 h-3 text-indigo-400" />
                      <span class="font-semibold text-indigo-400">PRAJNA AI</span>
                    </>
                  ) : (
                    <>
                      <User class="w-3 h-3 text-slate-400" />
                      <span>Investigator (OFF-4092)</span>
                    </>
                  )}
                  <span>• {msg.timestamp}</span>
                </div>

                <div
                  class={`p-3.5 rounded-2xl max-w-[92%] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  {renderFormattedText(msg.text)}

                  {/* Cited FIR Badges */}
                  {msg.cited_firs && msg.cited_firs.length > 0 && (
                    <div class="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                      <span class="text-[10px] text-slate-400 uppercase font-semibold">Cited FIRs:</span>
                      {msg.cited_firs.map((fir, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => onSelectFir && onSelectFir(fir)}
                          class="px-2 py-0.5 bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-700/60 rounded font-mono text-[10px] flex items-center gap-1 transition"
                        >
                          {fir} <ExternalLink class="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.memory_thread_id && (
                    <div class="mt-2 text-[9px] text-slate-500 font-mono flex items-center justify-between">
                      <span>Thread: {msg.memory_thread_id}</span>
                      <span class="text-emerald-500">✓ Memory Weaved</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div class="flex items-center gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-sky-400 animate-pulse">
                <Sparkles class="w-4 h-4 animate-spin text-sky-400" />
                <span>PRAJNA Graph Reasoning Engine analyzing query...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Query Pills */}
          <div class="px-3 py-2 bg-slate-900/40 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span class="text-slate-500 text-[10px] font-semibold whitespace-nowrap">Suggested:</span>
            {['Raju Kumar', 'Whitefield', 'Full Network', 'Bail List'].map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(pill)}
                class="px-2.5 py-1 bg-slate-800/80 hover:bg-indigo-950 hover:border-indigo-700/60 text-slate-300 rounded-full border border-slate-700 whitespace-nowrap transition"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Input Container */}
          <div class="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
            <VoiceInput
              onQuerySubmit={handleSend}
              selectedLang={selectedLang}
              onLangChange={setSelectedLang}
            />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              class="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={selectedLang === 'kn-IN' ? 'ಪ್ರಶ್ನೆಯನ್ನು ಬರೆಯಿರಿ (Type query)...' : 'Type query (e.g., Show Raju Kumar network)...'}
                class="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                class="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg transition shadow"
              >
                <Send class="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}

      {/* MEMORY WEAVING TAB CONTENT */}
      {activeTab === 'memory' && (
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 class="font-bold text-xs text-slate-200 uppercase tracking-wider font-display">Memory Threads (Officer OFF-4092)</h3>
            <button
              onClick={loadMemoryHistory}
              class="p-1 rounded hover:bg-slate-800 text-slate-400 transition"
              title="Refresh Memory Log"
            >
              <RefreshCw class="w-3.5 h-3.5" />
            </button>
          </div>

          {memoryHistory.length === 0 ? (
            <p class="text-slate-500 text-xs text-center py-6">No saved memory threads found.</p>
          ) : (
            memoryHistory.map((mem) => (
              <div
                key={mem.thread_id}
                class="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs shadow-sm hover:border-slate-700 transition"
              >
                <div class="flex items-center justify-between text-[10px]">
                  <span class="font-mono text-indigo-400 font-bold">{mem.thread_id}</span>
                  <span class="text-slate-400">{mem.timestamp}</span>
                </div>

                <div>
                  <span class="text-slate-400 block text-[10px] font-semibold">Query:</span>
                  <p class="font-medium text-slate-200">{mem.query}</p>
                </div>

                <div class="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300">
                  {mem.response.substring(0, 140)}...
                </div>

                <div class="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span class={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    mem.dissent_flag
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {mem.dissent_flag ? '⚠️ Dissent Flagged' : `✓ ${mem.outcome_tag}`}
                  </span>

                  <button
                    onClick={() => handleSend(mem.query)}
                    class="text-[10px] text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Re-run Query
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
