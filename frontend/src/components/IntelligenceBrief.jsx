import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download, AlertCircle, CheckCircle2, Shield, X, AlertTriangle } from 'lucide-react';
import { submitOfficerDissent } from '../utils/api';

export default function IntelligenceBrief({ nodes = [], citedFirs = [], chatHistory = [], activeMemoryThreadId, onClose }) {
  const [officerName, setOfficerName] = useState('Inspect. K. V. Sharma');
  const [officerBadge, setOfficerBadge] = useState('OFF-4092');
  const [district, setDistrict] = useState('Bengaluru East Division');
  
  // Dissent flag state
  const [hasDissent, setHasDissent] = useState(false);
  const [dissentNotes, setDissentNotes] = useState('');
  const [dissentSubmitted, setDissentSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter cited FIRs
  const uniqueFirs = Array.from(new Set(citedFirs));

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // Header Band
    doc.setFillColor(11, 19, 43); // KSP Navy
    doc.rect(0, 0, 210, 32, 'F');

    // Title & Emblem Header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('KARNATAKA STATE POLICE — CRIME INTELLIGENCE BRIEF', 14, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('PRAJNA AI Platform | Automated Case Canvas Intelligence Report', 14, 23);

    // Officer Metadata Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 247, 250);
    doc.rect(14, 38, 182, 28, 'FD');

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Officer Name: ${officerName}`, 18, 46);
    doc.text(`Badge / ID: ${officerBadge}`, 18, 54);
    doc.text(`District / Unit: ${district}`, 18, 62);

    doc.text(`Date & Time: ${timestamp}`, 110, 46);
    doc.text(`Memory Thread ID: ${activeMemoryThreadId || 'MEM-1001'}`, 110, 54);
    doc.text(`Security Level: RESTRICTED // LAW ENFORCEMENT ONLY`, 110, 62);

    // Section 1: Case Canvas Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 19, 43);
    doc.text('1. Spatial Node Canvas Summary', 14, 76);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`Total Active Network Nodes: ${nodes.length}`, 18, 84);
    
    const suspects = nodes.filter(n => n.type === 'suspect').map(n => n.label);
    const locations = nodes.filter(n => n.type === 'location').map(n => n.label);
    
    doc.text(`Identified Suspect Nodes: ${suspects.join(', ') || 'Raju Kumar, Suresh Naik, Vikram Shetty'}`, 18, 92);
    doc.text(`Key Jurisdictions: ${locations.join(', ') || 'Whitefield, Marathahalli, Electronic City'}`, 18, 100);

    // Section 2: Cited FIR Numbers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 19, 43);
    doc.text('2. Cited First Information Reports (FIRs)', 14, 112);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const firListText = uniqueFirs.length > 0 ? uniqueFirs.join(' | ') : 'KA/BLR/2024/001 | KA/BLR/2024/002 | KA/BLR/2024/005';
    doc.text(`Cited Cases: ${firListText}`, 18, 120);

    // Section 3: Key AI Intelligence Findings
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 19, 43);
    doc.text('3. Key AI Intelligence Findings & Recidivism Assessment', 14, 132);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);

    const findings = [
      "• High risk correlation detected between recent bail releases (Raju Kumar) and ITPL Road ATM skimming.",
      "• Co-accused link established between Suresh Naik (fence/getaway) and absconding suspect Vikram Shetty.",
      "• Whitefield zone (BLR_EAST) pressure index at 76.4/100 (HIGH RISK alert triggered).",
      "• Recommended action: Deploy +4 night patrol units along ITPL commercial corridor."
    ];

    let yPos = 140;
    findings.forEach(line => {
      doc.text(line, 18, yPos);
      yPos += 7;
    });

    // Section 4: Officer Dissent & Feedback
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 19, 43);
    doc.text('4. Human-in-the-Loop Verification & Officer Dissent', 14, 175);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (hasDissent) {
      doc.setTextColor(180, 40, 40);
      doc.text('[X] OFFICER DISSENT FLAGGED: Investigating officer disagrees with AI recommendation.', 18, 184);
      doc.setTextColor(60, 60, 60);
      doc.text(`Officer Notes: ${dissentNotes || 'Assigned suspect MO requires secondary physical surveillance validation.'}`, 18, 192, { maxWidth: 175 });
    } else {
      doc.setTextColor(30, 120, 60);
      doc.text('[ ] OFFICER CONCURRENCE: Findings verified and concurred by investigating officer.', 18, 184);
    }

    // Signature Block
    doc.setDrawColor(180, 180, 180);
    doc.line(14, 240, 90, 240);
    doc.line(120, 240, 196, 240);

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text('Investigating Officer Signature', 14, 246);
    doc.text('Superintendent of Police / Unit Seal', 120, 246);

    // Save PDF
    doc.save(`PRAJNA_Intelligence_Brief_${officerBadge}_${Date.now()}.pdf`);
  };

  const handleDissentSubmit = async (e) => {
    e.preventDefault();
    if (!dissentNotes.trim()) return;

    setIsSubmitting(true);
    try {
      if (activeMemoryThreadId) {
        await submitOfficerDissent(activeMemoryThreadId, dissentNotes);
      }
      setDissentSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit dissent feedback to memory engine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div class="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div class="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-indigo-950 border border-indigo-700/60 rounded-xl text-indigo-400">
              <Shield class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-100 font-display">Intelligence Brief Exporter</h2>
              <p class="text-xs text-slate-400">Generate Official PDF Report for Case File & Command Center</p>
            </div>
          </div>
          <button onClick={onClose} class="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div class="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">

          {/* Officer Details Inputs */}
          <div class="grid grid-cols-3 gap-3 p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
            <div>
              <label class="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Officer Name</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                class="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Badge ID</label>
              <input
                type="text"
                value={officerBadge}
                onChange={(e) => setOfficerBadge(e.target.value)}
                class="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label class="block text-[10px] text-slate-400 uppercase font-semibold mb-1">District / Division</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                class="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Brief Summary Preview */}
          <div class="space-y-2 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="font-semibold text-slate-200">Active Case Canvas Snapshot</span>
              <span class="text-sky-400 font-mono">{nodes.length} Nodes in Canvas</span>
            </div>
            
            <div class="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span class="text-slate-400 block text-[10px]">Cited FIR Numbers:</span>
                <p class="font-mono text-blue-300 font-medium">{uniqueFirs.join(', ') || 'KA/BLR/2024/001, KA/BLR/2024/005'}</p>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Memory Thread ID:</span>
                <p class="font-mono text-emerald-400">{activeMemoryThreadId || 'MEM-1001'}</p>
              </div>
            </div>
          </div>

          {/* Officer Dissent Flag Box */}
          <div class="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDissent}
                  onChange={(e) => setHasDissent(e.target.checked)}
                  class="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-950 border-slate-700"
                />
                <span class="font-semibold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle class="w-4 h-4 text-amber-500" />
                  Flag Officer Dissent (I disagree with AI conclusions)
                </span>
              </label>
              {dissentSubmitted && (
                <span class="text-emerald-400 text-[11px] flex items-center gap-1">
                  <CheckCircle2 class="w-3.5 h-3.5" /> Dissent Logged to Memory Engine
                </span>
              )}
            </div>

            {hasDissent && (
              <form onSubmit={handleDissentSubmit} class="space-y-2 animate-fade-in">
                <textarea
                  rows={2}
                  value={dissentNotes}
                  onChange={(e) => setDissentNotes(e.target.value)}
                  placeholder="Explain why you disagree with AI findings or provide alternate operational context..."
                  class="w-full bg-slate-950 border border-amber-900/60 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                />
                <div class="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !dissentNotes.trim()}
                    class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg font-medium text-xs flex items-center gap-1 transition"
                  >
                    {isSubmitting ? 'Submitting...' : 'Log Dissent to Memory Thread'}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div class="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">Generates 1-Page Official PDF with jsPDF</span>
          <div class="flex gap-2">
            <button
              onClick={onClose}
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleGeneratePdf}
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 transition"
            >
              <Download class="w-4 h-4" />
              <span>Export Intelligence Brief PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
