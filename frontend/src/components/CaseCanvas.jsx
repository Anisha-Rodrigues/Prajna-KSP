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
        .force("link", d3.forceLink(edgesCopy).id((d) => d.id).distance(120))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(40));

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
      .attr("stroke", "#374151")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => d.relationship?.includes("evidence") ? "4,3" : "none");

    const linkLabel = container
      .append("g")
      .selectAll("text")
      .data(edgesCopy)
      .join("text")
      .text((d) => d.relationship || "")
      .attr("font-size", 8)
      .attr("font-family", "monospace")
      .attr("fill", "#6b7280");

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

    // Icon or short letter badge in node center
    nodeG.append("text")
      .text((d) => {
        if (d.type === "suspect") return "👤";
        if (d.type === "fir") return "📄";
        if (d.type === "evidence") return "🔍";
        return "📍";
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", 12);

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

        linkLabel
          .attr("x", (d) => (d.source.x + d.target.x) / 2)
          .attr("y", (d) => (d.source.y + d.target.y) / 2);

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