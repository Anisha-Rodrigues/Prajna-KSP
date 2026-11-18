import { useEffect, useRef } from "react";

const NODE_COLORS = {
  suspect: "#ef4444",
  fir: "#3b82f6",
  location: "#22c55e",
  evidence: "#eab308",
};

export default function CaseCanvas({ nodes, edges, onNodeClick }) {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const d3 = window.d3;
    if (!d3) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 600;
    const height = svgRef.current.clientHeight || 400;

    svg.selectAll("*").remove();

    if (!nodes || nodes.length === 0) {
      const g = svg.append("g");
      g.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#6b7280")
        .attr("font-size", "14px")
        .text("Case Canvas is empty. Query suspects or locations to map relationships.");
      return;
    }

    const container = svg.append("g");

    svg.call(
      d3.zoom()
        .scaleExtent([0.3, 4])
        .on("zoom", (event) => container.attr("transform", event.transform))
    );

    // Deep copy so D3 mutation doesn't fight React state
    const nodesCopy = (nodes || []).map((n) => ({ ...n }));
    const nodeIds = new Set(nodesCopy.map((n) => n.id));
    // Filter out edges that reference missing nodes to avoid D3 crash
    const edgesCopy = (edges || [])
      .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
      .map((e) => ({ ...e }));

    try {
      const simulation = d3
        .forceSimulation(nodesCopy)
        .force("link", d3.forceLink(edgesCopy).id((d) => d.id).distance(180))
        .force("charge", d3.forceManyBody().strength(-600))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(60));

      simulationRef.current = simulation;

    // Dynamic glow defs and modern styling
    const defs = svg.append("defs");
    
    // Grid pattern
    const pattern = defs.append("pattern")
      .attr("id", "canvasGrid")
      .attr("width", 30)
      .attr("height", 30)
      .attr("patternUnits", "userSpaceOnUse");
    pattern.append("circle")
      .attr("cx", 2)
      .attr("cy", 2)
      .attr("r", 0.8)
      .attr("fill", "#374151");

    container.append("rect")
      .attr("x", -2000)
      .attr("y", -2000)
      .attr("width", 5000)
      .attr("height", 5000)
      .attr("fill", "url(#canvasGrid)")
      .attr("opacity", 0.5);

    const link = container
      .append("g")
      .selectAll("line")
      .data(edgesCopy)
      .join("line")
      .attr("stroke", "#4b5563")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) => d.relationship?.includes("evidence") ? "4,3" : "none");

    // Clean, pill-style relationship labels that do NOT overlap
    const linkLabelGroup = container
      .append("g")
      .selectAll("g")
      .data(edgesCopy)
      .join("g")
      .style("pointer-events", "none");

    const linkLabelRect = linkLabelGroup
      .append("rect")
      .attr("fill", "#111827")
      .attr("rx", 3)
      .attr("stroke", "#374151")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.85);

    const linkLabelText = linkLabelGroup
      .append("text")
      .text((d) => d.relationship || "")
      .attr("font-size", 8.5)
      .attr("font-family", "system-ui, sans-serif")
      .attr("fill", "#9ca3af")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central");

    linkLabelGroup.each(function() {
      const text = d3.select(this).select("text");
      const bbox = text.node().getBBox();
      d3.select(this).select("rect")
        .attr("x", bbox.x - 3)
        .attr("y", bbox.y - 1.5)
        .attr("width", bbox.width + 6)
        .attr("height", bbox.height + 3);
    });

    // Modern node circles with outer rings
    const nodeG = container
      .append("g")
      .selectAll("g")
      .data(nodesCopy)
      .join("g")
      .style("cursor", "pointer")
      .on("click", (event, d) => onNodeClick && onNodeClick(d))
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Halo pulse ring
    nodeG.append("circle")
      .attr("r", 28)
      .attr("fill", (d) => NODE_COLORS[d.type] || "#a3a3a3")
      .attr("opacity", 0.15);

    // Inner core
    nodeG.append("circle")
      .attr("r", 20)
      .attr("fill", (d) => NODE_COLORS[d.type] || "#a3a3a3")
      .attr("stroke", "#030712")
      .attr("stroke-width", 2.5);

    // Render clean, vector SVG icons inside each node circle (no emoji artifacts)
    nodeG.each(function(d) {
      const g = d3.select(this);
      if (d.type === "suspect") {
        g.append("circle").attr("cx", 0).attr("cy", -4).attr("r", 4.5).attr("fill", "#ffffff");
        g.append("path").attr("d", "M -7,8 C -7,2 7,2 7,8 Z").attr("fill", "#ffffff");
      } else if (d.type === "fir") {
        g.append("path")
          .attr("d", "M -5,-7 L 2,-7 L 6,-3 L 6,7 L -5,7 Z")
          .attr("fill", "none")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 1.6);
        g.append("line").attr("x1", -2).attr("y1", 0).attr("x2", 3).attr("y2", 0).attr("stroke", "#ffffff").attr("stroke-width", 1.4);
        g.append("line").attr("x1", -2).attr("y1", 3).attr("x2", 1).attr("y2", 3).attr("stroke", "#ffffff").attr("stroke-width", 1.4);
      } else if (d.type === "evidence") {
        g.append("circle").attr("cx", -1).attr("cy", -2).attr("r", 4.5).attr("fill", "none").attr("stroke", "#ffffff").attr("stroke-width", 1.7);
        g.append("line").attr("x1", 2.5).attr("y1", 1.5).attr("x2", 6.5).attr("y2", 5.5).attr("stroke", "#ffffff").attr("stroke-width", 2).attr("stroke-linecap", "round");
      } else {
        // Location
        g.append("path").attr("d", "M 0,-8 C -4.5,-8 -4.5,-2 0,7 C 4.5,-2 4.5,-8 0,-8 Z").attr("fill", "#ffffff");
        g.append("circle").attr("cx", 0).attr("cy", -4).attr("r", 2).attr("fill", "#15803d");
      }
    });

    const label = nodeG
      .append("text")
      .text((d) => d.label || d.id)
      .attr("font-size", 10)
      .attr("font-family", "system-ui, sans-serif")
      .attr("font-weight", "500")
      .attr("fill", "#f3f4f6")
      .attr("text-anchor", "middle")
      .attr("dy", 36);

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        linkLabelGroup
          .attr("transform", (d) => `translate(${(d.source.x + d.target.x) / 2}, ${(d.source.y + d.target.y) / 2})`);

        nodeG.attr("transform", (d) => `translate(${d.x},${d.y})`);
      });
    } catch (simErr) {
      console.error("D3 simulation error:", simErr);
    }

    return () => simulationRef.current?.stop();
  }, [nodes, edges]);

  return (
    <svg ref={svgRef} className="w-full h-full bg-gray-950" />
  );
}