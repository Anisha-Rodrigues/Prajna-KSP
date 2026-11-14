import json
import os
from copy import deepcopy
from typing import Any, Dict, List

from mock_db import (
    FIRS,
    SUSPECTS,
    LOCATIONS,
    EVIDENCE,
    PRESSURE_ZONES,
    get_network_data,
)
from pressure_engine import get_top_pressure_zones


def get_edges_for_nodes(node_ids: List[str]):
    """Return edges connected to selected nodes."""
    network = get_network_data()
    ids_set = set(node_ids)
    return [
        deepcopy(e)
        for e in network["edges"]
        if e["source"] in ids_set or e["target"] in ids_set
    ]


def query_groq_llm(query: str, language: str = "en-IN") -> Dict[str, Any] | None:
    """
    RAG over Crime Knowledge Graph using Groq Llama 3.3 70B.
    Uses direct HTTPS requests via the standard OpenAI/Groq REST API so it never
    fails on missing SDK dependencies.
    """
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        print("[PRAJNA AI] GROQ_API_KEY is not set.")
        return None

    try:
        import urllib.request
        import json

        # Construct comprehensive live context of all police records
        suspects_summary = [
            f"- Suspect: {s['name']} (ID: {s['id']}, Risk: {s['risk_level']}, Status: {s['status']}, Bail: {s['bail_status']}, Crimes: {', '.join(s['crime_types'])}, Locations: {', '.join(s['known_locations'])}, Description: {s.get('description', '')})"
            for s in SUSPECTS.values()
        ]
        firs_summary = [
            f"- FIR {f['fir_id']} (Crime: {f['crime_type']}, Location: {f['location']}, District: {f['district']}, Date: {f['date']}, Status: {f['status']}, Suspects: {', '.join(f['suspect_names'])}, Details: {f['description']})"
            for f in FIRS.values()
        ]
        zones_summary = [
            f"- Zone {z['zone_name']} (District: {z['district']}, ID: {z['zone_id']})"
            for z in PRESSURE_ZONES
        ]

        system_prompt = (
            "You are PRAJNA AI, an advanced AI crime intelligence assistant for the Karnataka State Police (KSP).\n"
            "You have complete access to the police intelligence database below:\n\n"
            "=== ACTIVE SUSPECTS ===\n" + "\n".join(suspects_summary) + "\n\n"
            "=== REGISTERED FIRS & INCIDENTS ===\n" + "\n".join(firs_summary) + "\n\n"
            "=== MONITORED HIGH-RISK ZONES ===\n" + "\n".join(zones_summary) + "\n\n"
            "OPERATING GUIDELINES:\n"
            "1. Answer ANY question asked by the officer thoroughly, naturally, and intelligently like ChatGPT/OpenAI.\n"
            "2. Distinguish clearly between concepts (e.g. 'high risk locations' vs 'high risk people/suspects').\n"
            "3. If asked general questions or greetings, converse naturally, professionally, and helpfully.\n"
            "4. If the query is in Kannada (or language is kn-IN), reply in fluent, respectful Kannada.\n"
            "5. Cite specific FIR numbers (e.g. KA/BLR/2024/001) and suspect names whenever relevant to the case.\n"
        )

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Language: {language}\nOfficer Query: {query}"}
            ],
            "temperature": 0.3,
            "max_tokens": 800,
        }

        req = urllib.request.Request(
            "https://api.groq.com/openai/v1/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "Prajna-App/1.0",
            },
            method="POST",
        )

        with urllib.request.urlopen(req, timeout=15) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            answer = res_json["choices"][0]["message"]["content"].strip()

        # Extract relevant nodes from response to show on Case Canvas
        network = get_network_data()
        matched_nodes = []
        cited_firs = []

        # Find any mentioned FIRs
        for fir_id in FIRS.keys():
            if fir_id.lower() in answer.lower() or fir_id.lower() in query.lower():
                cited_firs.append(fir_id)
                for n in network["nodes"]:
                    if n["id"] == f"FIR:{fir_id}":
                        matched_nodes.append(n)

        # Find any mentioned suspects
        for s_id, s_data in SUSPECTS.items():
            if (
                s_data["name"].lower() in answer.lower()
                or s_data["name"].lower() in query.lower()
                or s_id.lower() in query.lower()
            ):
                for n in network["nodes"]:
                    if n["id"] == s_id:
                        matched_nodes.append(n)

        # If asking about locations/zones, link location nodes
        for loc in LOCATIONS.values():
            if loc["name"].lower() in answer.lower() or loc["name"].lower() in query.lower():
                for n in network["nodes"]:
                    if n["id"] == loc["id"]:
                        matched_nodes.append(n)

        # Deduplicate nodes
        unique_nodes = {n["id"]: n for n in matched_nodes}.values()
        node_list = list(unique_nodes)
        node_ids = [n["id"] for n in node_list]

        return {
            "answer": answer,
            "nodes": node_list,
            "edges": get_edges_for_nodes(node_ids),
            "cited_firs": list(set(cited_firs)),
            "intent": "generative_ai_intelligence",
            "matched_entity": "llama-3.3-70b",
            "language": language,
        }

    except Exception as e:
        import traceback
        print(f"[PRAJNA AI] Direct Groq API error: {e}")
        traceback.print_exc()
        return None


def process_query(
    query: str,
    language: str = "en-IN",
):
    """
    Unified AI query processor.
    Routes every query directly to Groq LLM (OpenAI-style generative AI).
    Falls back gracefully only if the LLM provider is unreachable.
    """
    # 1. Primary: True Generative AI / LLM
    llm_result = query_groq_llm(query, language)
    if llm_result and llm_result.get("answer"):
        return llm_result

    # 2. Smart contextual fallback if LLM key is absent or network fails
    q = query.strip().lower()

    if q in ["hi", "hello", "namaskara", "namaste", "hey", "hii"]:
        return {
            "answer": "Namaskara Officer. I am PRAJNA, your AI crime intelligence assistant. Ask me anything regarding suspects, FIRs, high risk locations, or crime trends across Karnataka.",
            "nodes": [],
            "edges": [],
            "cited_firs": [],
            "intent": "greeting",
            "matched_entity": "system",
            "language": language,
        }

    if "location" in q or "hotspot" in q or "area" in q or "zone" in q:
        top_zones = get_top_pressure_zones(3)
        zone_names = [z["zone_name"] for z in top_zones]
        return {
            "answer": f"Current top high-risk locations identified by predictive pressure analysis: {', '.join(zone_names)}. These zones show elevated risk based on bail releases, upcoming public events, and economic stress signals.",
            "nodes": [],
            "edges": [],
            "cited_firs": [],
            "intent": "high_risk_locations",
            "matched_entity": "pressure_engine",
            "language": language,
        }

    if "people" in q or "suspect" in q or "criminal" in q or "person" in q:
        high_risk_suspects = [s["name"] for s in SUSPECTS.values() if s["risk_level"] == "high"]
        return {
            "answer": f"Currently monitored high-risk individuals on file: {', '.join(high_risk_suspects)}. For individual details, ask about any suspect by name.",
            "nodes": [],
            "edges": [],
            "cited_firs": [],
            "intent": "high_risk_people",
            "matched_entity": "suspect_database",
            "language": language,
        }

    # Ultimate fallback
    return {
        "answer": (
            f"Understood Officer. Regarding your inquiry on '{query}': "
            "Please ensure GROQ_API_KEY is configured on your Render environment to enable full generative AI reasoning. "
            "In the meantime, you can ask about suspects (Raju Kumar, Vikram Shetty), locations (Whitefield, Indiranagar, Bengaluru), or high-risk zones."
        ),
        "nodes": [],
        "edges": [],
        "cited_firs": [],
        "intent": "fallback",
        "matched_entity": None,
        "language": language,
    }
