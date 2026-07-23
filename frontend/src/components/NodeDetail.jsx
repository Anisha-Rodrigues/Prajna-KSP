import React from 'react';
import { X, ShieldAlert, FileText, MapPin, Box, User, AlertTriangle, ExternalLink } from 'lucide-react';

export default function NodeDetail({ node, onClose, onSearchRelated }) {
  if (!node) return null;

  const { id, label, type, risk, status, details } = node;

  const getTypeBadge = () => {
    switch (type) {
      case 'suspect':
        return <span class="px-2 py-0.5 rounded text-xs font-bold bg-red-950 text-red-300 border border-red-800/60 flex items-center gap-1"><User class="w-3 h-3"/> SUSPECT PROFILE</span>;
      case 'fir':
        return <span class="px-2 py-0.5 rounded text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800/60 flex items-center gap-1"><FileText class="w-3 h-3"/> FIR RECORD</span>;
      case 'location':
        return <span class="px-2 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1"><MapPin class="w-3 h-3"/> JURISDICTION</span>;
      case 'evidence':
        return <span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800/60 flex items-center gap-1"><Box class="w-3 h-3"/> EVIDENCE ARTIFACT</span>;
      default:
        return <span class="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">{type.toUpperCase()}</span>;
    }
  };

  return (
    <div class="fixed top-16 right-4 w-96 max-h-[calc(100vh-80px)] overflow-y-auto glass-panel rounded-xl p-5 shadow-2xl border border-slate-700/80 z-50 animate-slide-left">
      {/* Header */}
      <div class="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <div class="mb-1.5">{getTypeBadge()}</div>
          <h3 class="text-lg font-bold text-slate-100 font-display">{label}</h3>
          <p class="text-xs text-slate-400 font-mono">ID: {id}</p>
        </div>
        <button
          onClick={onClose}
          class="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      {/* Content based on type */}
      <div class="mt-4 space-y-4 text-xs">

        {/* Risk / Status Badge */}
        <div class="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Classification</span>
            <span class="font-semibold text-slate-200">{risk || 'N/A'}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Current Status</span>
            <span class="font-semibold text-sky-400">{status || 'Active'}</span>
          </div>
        </div>

        {/* SUSPECT DETAILS */}
        {type === 'suspect' && details && (
          <>
            {details.aliases && (
              <div>
                <span class="text-slate-400 block font-medium mb-1">Known Aliases</span>
                <div class="flex flex-wrap gap-1">
                  {details.aliases.map((alias, idx) => (
                    <span key={idx} class="px-2 py-0.5 bg-slate-800 rounded text-slate-300 text-[11px]">{alias}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span class="text-slate-400 block font-medium mb-1">Modus Operandi</span>
              <p class="p-2.5 bg-slate-900 rounded border border-slate-800/80 text-slate-300 leading-relaxed">{details.modus_operandi}</p>
            </div>

            <div>
              <span class="text-slate-400 block font-medium mb-1">Linked FIRs</span>
              <div class="flex flex-wrap gap-1.5">
                {details.firs?.map((fir, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSearchRelated(fir)}
                    class="px-2 py-1 bg-blue-950 hover:bg-blue-900 border border-blue-700/60 rounded text-blue-300 font-mono text-[11px] flex items-center gap-1 transition"
                  >
                    {fir} <ExternalLink class="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span class="text-slate-400 block font-medium mb-1">Known Associates</span>
              <div class="flex flex-wrap gap-1.5">
                {details.associates?.map((assoc, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSearchRelated(assoc)}
                    class="px-2 py-1 bg-red-950 hover:bg-red-900 border border-red-800/60 rounded text-red-300 text-[11px] flex items-center gap-1 transition"
                  >
                    {assoc} <ExternalLink class="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* FIR DETAILS */}
        {type === 'fir' && details && (
          <>
            <div>
              <span class="text-slate-400 block font-medium mb-1">Incident Title</span>
              <p class="font-semibold text-slate-200 text-sm">{details.title}</p>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="p-2 bg-slate-900 rounded border border-slate-800">
                <span class="text-slate-400 block text-[10px]">Location</span>
                <span class="text-slate-200 font-medium">{details.location}</span>
              </div>
              <div class="p-2 bg-slate-900 rounded border border-slate-800">
                <span class="text-slate-400 block text-[10px]">Stolen Value</span>
                <span class="text-amber-400 font-semibold">{details.stolen_property_value}</span>
              </div>
            </div>

            <div>
              <span class="text-slate-400 block font-medium mb-1">Incident Summary</span>
              <p class="p-2.5 bg-slate-900 rounded border border-slate-800/80 text-slate-300 leading-relaxed">{details.description}</p>
            </div>

            <div>
              <span class="text-slate-400 block font-medium mb-1">Named Suspects</span>
              <div class="flex flex-wrap gap-1.5">
                {details.suspects_named?.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSearchRelated(s)}
                    class="px-2 py-1 bg-red-950 hover:bg-red-900 border border-red-800/60 rounded text-red-300 text-[11px] flex items-center gap-1 transition"
                  >
                    {s} <ExternalLink class="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* EVIDENCE DETAILS */}
        {type === 'evidence' && details && (
          <>
            <div>
              <span class="text-slate-400 block font-medium mb-1">Evidence Description</span>
              <p class="p-2.5 bg-slate-900 rounded border border-slate-800/80 text-slate-300">{details.details}</p>
            </div>
            <div>
              <span class="text-slate-400 block font-medium mb-1">Linked FIR Case</span>
              <button
                onClick={() => onSearchRelated(details.linked_fir)}
                class="px-2.5 py-1 bg-blue-950 border border-blue-700/60 rounded text-blue-300 font-mono flex items-center gap-1"
              >
                {details.linked_fir} <ExternalLink class="w-3 h-3" />
              </button>
            </div>
          </>
        )}

        {/* Action Button */}
        <div class="pt-2 border-t border-slate-800">
          <button
            onClick={() => onSearchRelated(label)}
            class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow flex items-center justify-center gap-2 transition"
          >
            <ShieldAlert class="w-4 h-4" />
            <span>Query Intelligence Engine for {label}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
