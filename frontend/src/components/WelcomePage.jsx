import React from 'react';
import { Cpu, Network, MessageSquare, Map, Shield, FileText, ArrowRight, Activity, Users, AlertTriangle, CheckCircle2, Sparkles, Database } from 'lucide-react';

export default function WelcomePage({ onNavigate }) {
  return (
    <div class="w-full min-h-full bg-slate-950 text-slate-100 p-6 md:p-10 space-y-10 font-sans">
      
      {/* Hero Section */}
      <div class="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-8 md:p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 shadow-2xl">
        <div class="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 max-w-4xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
            <Sparkles class="w-3.5 h-3.5 text-indigo-400" />
            <span>KSP Datathon 2026 (Challenges 01 & 02 Unified System)</span>
          </div>

          <h1 class="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
            PRAJNA — Predictive Reasoning & Adaptive Justice Network for Action
          </h1>

          <p class="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
            PRAJNA is a unified AI platform built for the Karnataka State Police. It bridges <strong class="text-sky-300">Challenge 01 (Conversational AI & Case Canvas)</strong> and <strong class="text-sky-300">Challenge 02 (Crime Analytics & Pressure Surface)</strong> into a single integrated intelligence ecosystem powered by a shared <strong class="text-indigo-300">Crime Intelligence Graph</strong>.
          </p>

          <div class="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('canvas')}
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <Network class="w-5 h-5" />
              <span>Launch Case Canvas</span>
              <ArrowRight class="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('chat')}
              class="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold rounded-xl shadow flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <MessageSquare class="w-5 h-5 text-indigo-400" />
              <span>Open AI Copilot Chat</span>
            </button>

            <button
              onClick={() => onNavigate('map')}
              class="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold rounded-xl shadow flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <Map class="w-5 h-5 text-emerald-400" />
              <span>Explore Pressure Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live System Metrics Bar */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tracked Suspects', value: '4 High/Med Risk', sub: 'Raju, Suresh, Irfan, Vikram', icon: Users, color: 'text-red-400', bg: 'bg-red-950/40 border-red-900/40' },
          { label: 'Active FIR Cases', value: '6 Registered FIRs', sub: 'Bengaluru & Mysuru Divisions', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-900/40' },
          { label: 'Crime Pressure Zones', value: '7 Zones Analyzed', sub: 'High risk: Whitefield (76.4 PSI)', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-900/40' },
          { label: 'Memory Threads', value: '100% Weaved', sub: 'Human-in-the-Loop Dissent Enabled', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-900/40' }
        ].map((stat, idx) => (
          <div key={idx} class={`p-5 rounded-2xl border ${stat.bg} glass-card space-y-2`}>
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</span>
              <stat.icon class={`w-5 h-5 ${stat.color}`} />
            </div>
            <p class="text-xl font-bold font-display text-white">{stat.value}</p>
            <p class="text-[11px] text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Pages / Modules Directory */}
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-bold font-display text-slate-100">Platform Modules & Dedicated Pages</h2>
          <p class="text-xs text-slate-400">Select any dedicated page below to navigate directly to that module.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Case Canvas */}
          <div
            onClick={() => onNavigate('canvas')}
            class="group cursor-pointer glass-card border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                <Network class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-100 font-display group-hover:text-indigo-400 transition">
                  Case Canvas Page
                </h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                  Full-screen D3 force-directed spatial node graph visualizing suspects, FIRs, locations, and evidence with interactive zoom, filtering, and node inspector.
                </p>
              </div>
            </div>
            <div class="pt-6 flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
              <span>Open Case Canvas</span>
              <ArrowRight class="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: AI Copilot Chat */}
          <div
            onClick={() => onNavigate('chat')}
            class="group cursor-pointer glass-card border border-slate-800 hover:border-sky-500/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between"
          >
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-xl bg-sky-950 border border-sky-700/60 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
                <MessageSquare class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-100 font-display group-hover:text-sky-400 transition">
                  AI Copilot Chat Page
                </h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                  Dedicated conversational interface with Web Speech API voice input (Kannada `kn-IN` & English `en-IN`), Memory Weaving log, and cited FIR tags.
                </p>
              </div>
            </div>
            <div class="pt-6 flex items-center text-xs font-semibold text-sky-400 group-hover:text-sky-300">
              <span>Open AI Chat</span>
              <ArrowRight class="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Crime Pressure Map */}
          <div
            onClick={() => onNavigate('map')}
            class="group cursor-pointer glass-card border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <Map class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-100 font-display group-hover:text-emerald-400 transition">
                  Crime Pressure Map Page
                </h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                  Interactive Leaflet Karnataka map visualizing crime pressure score breakdown (Bail releases, festivals, economic stress, new ATMs) and tactical patrol advice.
                </p>
              </div>
            </div>
            <div class="pt-6 flex items-center text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
              <span>Open Pressure Map</span>
              <ArrowRight class="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Memory & Briefs */}
          <div
            onClick={() => onNavigate('intelligence')}
            class="group cursor-pointer glass-card border border-slate-800 hover:border-amber-500/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-xl bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <Shield class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-100 font-display group-hover:text-amber-400 transition">
                  Memory & Briefs Page
                </h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                  Audit investigator interaction memory threads, review logged officer dissent feedback, and export official 1-page PDF Intelligence Briefs.
                </p>
              </div>
            </div>
            <div class="pt-6 flex items-center text-xs font-semibold text-amber-400 group-hover:text-amber-300">
              <span>Open Memory & Briefs</span>
              <ArrowRight class="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>
      </div>

      {/* Bidirectional Core USP Explanation */}
      <div class="p-6 md:p-8 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-indigo-950 border border-indigo-700/60 rounded-xl text-indigo-400">
            <Cpu class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-white font-display">Core USP: Bidirectional Intelligence Feedback Loop</h3>
            <p class="text-xs text-slate-400">How Challenge 01 and Challenge 02 empower each other in real-time</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
          <div class="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span class="font-bold text-sky-400 uppercase text-[10px] tracking-wider block">Flow A: Chat & Canvas &rarr; Analytics</span>
            <p>
              When investigators query suspects or weave memory threads on the Case Canvas, identified recidivism MOs and associate links feed directly into the zone pressure calculator, sharpening spatial threat predictions.
            </p>
          </div>
          <div class="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span class="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">Flow B: Analytics &rarr; Chat & Canvas</span>
            <p>
              When the Crime Pressure Map detects a zone anomaly (e.g. Whitefield pressure at 76.4/100), an automated alert signal triggers directly in the investigator AI Chat, proposing pre-emptive canvas queries.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
