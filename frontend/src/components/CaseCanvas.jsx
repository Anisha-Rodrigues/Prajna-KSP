import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, RotateCcw, Filter, FileSpreadsheet, Eye, User, FileText, MapPin, Box } from 'lucide-react';

export default function CaseCanvas({ graphData = { nodes: [], edges: [] }, onNodeSelect, onExportBrief }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'suspect' | 'fir' | 'location' | 'evidence'
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  useEffect(() => {
    if (!svgRef.current || !graphData.nodes) return;

    const width = containerRef.current ? containerRef.current.clientWidth : 1000;
    const height = containerRef.current ? containerRef.current.clientHeight : 700;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Setup zoom container
    const g = svg.append('g').attr('class', 'canvas-g');

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Filter nodes based on activeFilter
    const filteredNodes = graphData.nodes.filter(n => {
      if (activeFilter === 'all') return true;
      return n.type === activeFilter;
    });

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredEdges = graphData.edges.filter(e => {
      const sId = typeof e.source === 'object' ? e.source.id : e.source;
      const tId = typeof e.target === 'object' ? e.target.id : e.target;
      return filteredNodeIds.has(sId) && filteredNodeIds.has(tId);
    });

    // Deep copy for simulation
    const simNodes = filteredNodes.map(d => ({ ...d }));
    const simEdges = filteredEdges.map(d => ({ ...d }));

    // Define Arrow Marker
    svg.append('defs').append('marker')
      .attr('id', 'edge-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#475569');

    // Create D3 Force Simulation
    const simulation = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink(simEdges).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Render Edges
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(simEdges)
      .enter()
      .append('line')
      .attr('stroke', '#334155')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.label?.includes('Bail') ? '4,4' : '0')
      .attr('marker-end', 'url(#edge-arrow)');

    // Render Edge Labels
    const linkText = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(simEdges)
      .enter()
      .append('text')
      .text(d => d.label || '')
      .attr('font-size', '9px')
      .attr('fill', '#94a3b8')
      .attr('text-anchor', 'middle')
      .attr('font-weight', '500');

    // Drag behavior handlers
    const drag = (sim) => {
      function dragstarted(event, d) {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
    };

    // Node Groups
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('class', 'node-group cursor-pointer')
      .call(drag(simulation))
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNodeId(d.id);
        if (onNodeSelect) onNodeSelect(d);
      });

    // Outer Glow Ring for High Risk / Selected
    node.append('circle')
      .attr('r', d => (d.size || 20) + 6)
      .attr('fill', 'none')
      .attr('stroke', d => d.color || '#3b82f6')
      .attr('stroke-width', d => d.id === selectedNodeId ? 3 : 1)
      .attr('opacity', d => d.id === selectedNodeId ? 0.9 : 0.2)
      .attr('class', d => d.risk?.includes('High') ? 'animate-pulse' : '');

    // Main Circle
    node.append('circle')
      .attr('r', d => d.size || 20)
      .attr('fill', d => d.color || '#3b82f6')
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2.5)
      .attr('shadow-lg', true);

    // Node Type Labels inside node or below
    node.append('text')
      .text(d => {
        if (d.type === 'suspect') return '👤';
        if (d.type === 'fir') return '📜';
        if (d.type === 'location') return '📍';
        if (d.type === 'evidence') return '📦';
        return '🔹';
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '4px')
      .attr('font-size', '14px');

    // Main Node Text Label below
    node.append('text')
      .text(d => d.label)
      .attr('x', 0)
      .attr('y', d => (d.size || 20) + 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#f8fafc')
      .attr('paint-order', 'stroke')
      .attr('stroke', '#090d16')
      .attr('stroke-width', 3);

    // Sub-label (Status / Risk)
    node.append('text')
      .text(d => d.risk || d.status || '')
      .attr('x', 0)
      .attr('y', d => (d.size || 20) + 28)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('fill', '#94a3b8');

    // Simulation tick update
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkText
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 4);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Cleanup simulation on unmount
    return () => {
      simulation.stop();
    };
  }, [graphData, activeFilter, selectedNodeId]);

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(750).call(d3.zoom().transform, d3.zoomIdentity);
  };

  return (
    <div ref={containerRef} class="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col">
      
      {/* Top Floating Toolbar */}
      <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        
        {/* Left Toolbar: Category Filters */}
        <div class="flex items-center gap-1.5 p-1.5 glass-panel rounded-xl pointer-events-auto border border-slate-800 shadow-xl">
          <span class="text-[11px] text-slate-400 font-semibold px-2 flex items-center gap-1">
            <Filter class="w-3.5 h-3.5 text-indigo-400" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Nodes', color: 'bg-slate-700' },
            { id: 'suspect', label: 'Suspects (Red)', color: 'bg-red-600' },
            { id: 'fir', label: 'FIRs (Blue)', color: 'bg-blue-600' },
            { id: 'location', label: 'Locations (Green)', color: 'bg-emerald-600' },
            { id: 'evidence', label: 'Evidence (Yellow)', color: 'bg-amber-600' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              class={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeFilter === btn.id
                  ? `${btn.color} text-white shadow`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Right Toolbar: Export Brief & Canvas Controls */}
        <div class="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onExportBrief}
            class="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs rounded-xl shadow-lg border border-amber-500/40 flex items-center gap-2 transition transform hover:scale-105"
          >
            <FileSpreadsheet class="w-4 h-4" />
            <span>Export Intelligence Brief</span>
          </button>

          <div class="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-lg">
            <button
              onClick={handleResetZoom}
              class="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
              title="Reset View"
            >
              <RotateCcw class="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* D3 Canvas SVG Element */}
      <svg
        ref={svgRef}
        class="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Bottom Floating Legend */}
      <div class="absolute bottom-4 left-4 p-3 glass-panel rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-4 z-10">
        <span class="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Graph Legend:</span>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-red-500 inline-block shadow"></span>
          <span>Suspects ({graphData.nodes.filter(n=>n.type==='suspect').length})</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-blue-500 inline-block shadow"></span>
          <span>FIRs ({graphData.nodes.filter(n=>n.type==='fir').length})</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow"></span>
          <span>Locations ({graphData.nodes.filter(n=>n.type==='location').length})</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-amber-500 inline-block shadow"></span>
          <span>Evidence ({graphData.nodes.filter(n=>n.type==='evidence').length})</span>
        </div>
      </div>

    </div>
  );
}
