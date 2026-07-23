"""
PRAJNA - KSP Crime Intelligence Platform
Mock AI Query Engine (query_engine.py)
Pattern-matches investigator natural language queries & returns structured AI analysis with Graph Nodes/Edges.
"""

from mock_db import SUSPECTS, FIRS, EVIDENCE
from pressure_engine import get_all_zone_pressures
from memory_weaving import save_memory_thread

def build_full_network_graph():
    """
    Constructs the complete Crime Intelligence Graph containing all suspects, FIRs, locations, and evidence.
    """
    nodes = []
    edges = []
    node_set = set()

    # Suspect nodes
    for s_id, s in SUSPECTS.items():
        nodes.append({
            "id": s_id,
            "label": s["name"],
            "type": "suspect",
            "risk": s["risk_level"],
            "status": s["status"],
            "color": "#ef4444",  # Red
            "size": 24,
            "details": s
        })
        node_set.add(s_id)

        # Location node & edge
        loc_id = f"LOC-{s['location'].upper().replace(' ', '_')}"
        if loc_id not in node_set:
            nodes.append({
                "id": loc_id,
                "label": s["location"],
                "type": "location",
                "risk": "Jurisdiction",
                "status": "Active Surveillance",
                "color": "#10b981",  # Green
                "size": 18,
                "details": {"location": s["location"], "district": s["district"]}
            })
            node_set.add(loc_id)
        
        edges.append({
            "source": s_id,
            "target": loc_id,
            "label": "Operates in",
            "weight": 2
        })

    # FIR nodes & edges
    for f_id, f in FIRS.items():
        nodes.append({
            "id": f_id,
            "label": f["fir_number"],
            "type": "fir",
            "risk": f["crime_type"],
            "status": f["status"],
            "color": "#3b82f6",  # Blue
            "size": 20,
            "details": f
        })
        node_set.add(f_id)

        # Link suspects to FIR
        for s_name in f["suspects_named"]:
            for s_id, s in SUSPECTS.items():
                if s["name"] == s_name:
                    edges.append({
                        "source": s_id,
                        "target": f_id,
                        "label": "Named in FIR",
                        "weight": 3
                    })

    # Evidence nodes & edges
    for e_id, e in EVIDENCE.items():
        nodes.append({
            "id": e_id,
            "label": e["name"],
            "type": "evidence",
            "risk": e["type"],
            "status": "Seized",
            "color": "#f59e0b",  # Yellow
            "size": 16,
            "details": e
        })
        node_set.add(e_id)

        if e["linked_fir"] in FIRS:
            edges.append({
                "source": e_id,
                "target": e["linked_fir"],
                "label": "Recovered for FIR",
                "weight": 2
            })

    # Associate edges between suspects
    edges.append({"source": "SUSP-001", "target": "SUSP-002", "label": "Co-Accused / Partner", "weight": 4})
    edges.append({"source": "SUSP-001", "target": "SUSP-004", "label": "Hardware Syndicate", "weight": 4})
    edges.append({"source": "SUSP-002", "target": "SUSP-003", "label": "Burglary Cell", "weight": 3})

    return {"nodes": nodes, "edges": edges}

def process_query(query: str, language: str = "en-IN", officer_id: str = "OFF-4092", session_id: str = "SESS-8801"):
    """
    Main NLP pattern-matching function for investigator queries.
    """
    q = query.lower().strip()
    full_graph = build_full_network_graph()
    
    answer = ""
    nodes = []
    edges = []
    cited_firs = []
    outcome_tag = "Investigation Active"

    # Match 1: Raju / Raju Kumar
    if "raju" in q:
        raju = SUSPECTS["SUSP-001"]
        cited_firs = raju["firs"]
        answer = (
            f"**Subject Identification: {raju['name']} (Risk: {raju['risk_level']})**\n\n"
            f"• **Current Status**: {raju['status']}\n"
            f"• **Active FIRs**: {', '.join(raju['firs'])}\n"
            f"• **Known Co-Accused**: {', '.join(raju['associates'])}\n"
            f"• **Modus Operandi**: {raju['modus_operandi']}\n\n"
            f"**Intelligence Summary**: Raju Kumar was recently released on bail and has strong links to ATM Skimming in Whitefield (KA/BLR/2024/005) with absconding tech expert Vikram Shetty. Immediate beat monitoring recommended in Whitefield."
        )
        
        # Extract Raju & linked nodes
        target_ids = {"SUSP-001", "SUSP-002", "SUSP-004", "LOC-WHITEFIELD", "EVI-901", "EVI-902"} | set(raju["firs"])
        nodes = [n for n in full_graph["nodes"] if n["id"] in target_ids]
        edges = [e for e in full_graph["edges"] if e["source"] in target_ids and e["target"] in target_ids]
        outcome_tag = "Confirmed Link"

    # Match 2: Whitefield
    elif "whitefield" in q:
        cited_firs = ["KA/BLR/2024/001", "KA/BLR/2024/005"]
        answer = (
            "**Whitefield Crime Cluster Intelligence**\n\n"
            "• **Total Linked FIRs**: 2 (KA/BLR/2024/001 - Jewelry Theft, KA/BLR/2024/005 - ATM Skimming)\n"
            "• **Key Suspects**: Raju Kumar (High Risk), Suresh Naik (Medium Risk), Vikram Shetty (Absconding)\n"
            "• **Crime Pressure Score**: 76.4/100 (HIGH RISK - Alert Active)\n"
            "• **Critical Signal**: 8 bail releases this week + 14 new unmonitored ATM kiosks installed on ITPL road.\n\n"
            "**Recommendation**: Deploy night patrol unit #4 along ITPL road corridor."
        )
        target_ids = {"LOC-WHITEFIELD", "SUSP-001", "SUSP-002", "SUSP-004", "KA/BLR/2024/001", "KA/BLR/2024/005", "EVI-901"}
        nodes = [n for n in full_graph["nodes"] if n["id"] in target_ids]
        edges = [e for e in full_graph["edges"] if e["source"] in target_ids and e["target"] in target_ids]
        outcome_tag = "Cluster Analysis"

    # Match 3: Network / Associates
    elif "network" in q or "associates" in q or "graph" in q or "syndicate" in q:
        answer = (
            "**Full Crime Intelligence Graph loaded.**\n\n"
            "• **Network Breakdown**: 4 Suspects, 6 FIRs, 4 Jurisdictions, 4 Evidence Artifacts.\n"
            "• **Primary Syndicate**: Raju Kumar & Vikram Shetty (ATM Skimming & Fraud) connected to Suresh Naik & Mohammed Irfan (Burglary & Fencing cell).\n"
            "• **Absconding Node**: Vikram Shetty (Lookout circular active)."
        )
        nodes = full_graph["nodes"]
        edges = full_graph["edges"]
        cited_firs = list(FIRS.keys())
        outcome_tag = "Network Traversal"

    # Match 4: Theft
    elif "theft" in q or "stolen" in q or "burglary" in q:
        cited_firs = ["KA/BLR/2024/001", "KA/BLR/2024/003", "KA/BLR/2024/005"]
        answer = (
            "**Theft & Burglary Offense Analysis**\n\n"
            "• **Active Theft FIRs**: KA/BLR/2024/001 (Whitefield), KA/BLR/2024/003 (Indiranagar), KA/BLR/2024/005 (Whitefield ATM Skimming).\n"
            "• **Cumulative Property Stolen**: ₹ 43,80,000.\n"
            "• **Common Nexus**: Suresh Naik acts as common nexus between Whitefield theft crew and Indiranagar burglary crew."
        )
        target_ids = {"SUSP-001", "SUSP-002", "SUSP-003", "KA/BLR/2024/001", "KA/BLR/2024/003", "KA/BLR/2024/005", "EVI-904"}
        nodes = [n for n in full_graph["nodes"] if n["id"] in target_ids]
        edges = [e for e in full_graph["edges"] if e["source"] in target_ids and e["target"] in target_ids]
        outcome_tag = "Modus Operandi Match"

    # Match 5: Bail
    elif "bail" in q or "released" in q:
        answer = (
            "**Active Bail Monitoring List (High Recidivism Risk)**\n\n"
            "1. **Raju Kumar** (High Risk) - Released on bail 2026-07-20 (3 days ago). Linked FIRs: 001/002/005.\n"
            "2. **Suresh Naik** (Medium Risk) - Released on bail 2026-07-15. Linked FIRs: 001/003.\n"
            "3. **Mohammed Irfan** (Medium Risk) - Released on bail 2026-06-10. Linked FIRs: 003/MYS001.\n\n"
            "**Crime Pressure Impact**: Recent bail releases account for 40% of current pressure spike in Bengaluru East."
        )
        cited_firs = ["KA/BLR/2024/001", "KA/BLR/2024/002", "KA/BLR/2024/003", "KA/BLR/2024/005"]
        target_ids = {"SUSP-001", "SUSP-002", "SUSP-003", "KA/BLR/2024/001", "KA/BLR/2024/003"}
        nodes = [n for n in full_graph["nodes"] if n["id"] in target_ids]
        edges = [e for e in full_graph["edges"] if e["source"] in target_ids and e["target"] in target_ids]
        outcome_tag = "Bail Monitoring"

    # Match 6: Pressure / Hotspot
    elif "pressure" in q or "hotspot" in q or "risk" in q or "predict" in q:
        pressures = sorted(get_all_zone_pressures(), key=lambda x: x["score"], reverse=True)[:3]
        hotspot_str = "\n".join([f"{idx+1}. **{p['zone_name']}** — Score: **{p['score']}/100** ({p['level']} Risk)\n   • Reason: {p['explanation']}" for idx, p in enumerate(pressures)])
        
        answer = (
            f"**Top 3 High Crime Pressure Zones (Karnataka)**\n\n"
            f"{hotspot_str}\n\n"
            f"**Predictive Alert**: Bengaluru East requires immediate patrol reinforcement before upcoming festival weekend."
        )
        cited_firs = ["KA/BLR/2024/001", "KA/BLR/2024/005"]
        target_ids = {"LOC-WHITEFIELD", "SUSP-001", "KA/BLR/2024/005"}
        nodes = [n for n in full_graph["nodes"] if n["id"] in target_ids]
        edges = [e for e in full_graph["edges"] if e["source"] in target_ids and e["target"] in target_ids]
        outcome_tag = "Pressure Hotspot"

    # Fallback default
    else:
        answer = (
            f"**Query Received**: '{query}'\n\n"
            f"No exact match found in recent active case files. Suggestions to try:\n"
            f"• Ask about suspects: *'Show Raju Kumar network'*\n"
            f"• Ask about locations: *'Crime pressure in Whitefield'*\n"
            f"• Ask about offenses: *'Show recent theft FIRs'*\n"
            f"• Ask about risk vectors: *'Which suspects are currently on bail?'*\n"
            f"• Ask about predictions: *'Top crime pressure hotspots'*."
        )
        # Return default subset of graph
        target_ids = {"SUSP-001", "SUSP-002", "KA/BLR/2024/001"}
        nodes = [n for n in full_graph["nodes"] if n["id"] in target_ids]
        edges = [e for e in full_graph["edges"] if e["source"] in target_ids and e["target"] in target_ids]
        cited_firs = ["KA/BLR/2024/001"]
        outcome_tag = "General Query"

    # Save to memory thread
    memory_thread = save_memory_thread(
        officer_id=officer_id,
        query=query,
        response=answer,
        cited_firs=cited_firs,
        nodes_involved=[n["id"] for n in nodes],
        outcome_tag=outcome_tag,
        session_id=session_id
    )

    return {
        "answer": answer,
        "nodes": nodes,
        "edges": edges,
        "cited_firs": cited_firs,
        "memory_thread_id": memory_thread["thread_id"],
        "timestamp": memory_thread["timestamp"],
        "language": language
    }
