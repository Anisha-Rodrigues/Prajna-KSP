"""
PRAJNA — Mock AI Query Engine
=============================

A deterministic mock AI engine for the KSP Datathon prototype.

The engine pattern-matches investigator queries and returns structured
intelligence responses.

It does NOT call a real LLM or external AI API.

The output format is designed so that a real LLM can replace this module
later without requiring major frontend changes.
"""

import json
import os
from copy import deepcopy
from typing import Any, Dict, List

from mock_db import (
    FIRS,
    SUSPECTS,
    LOCATIONS,
    EVIDENCE,
    get_network_data,
)
from pressure_engine import (
    get_top_pressure_zones,
)


def query_groq_llm(query: str, language: str = "en-IN") -> Dict[str, Any] | None:
    """
    RAG over Crime Knowledge Graph using Groq (Llama-3-70b/8b) or fallback.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("[PRAJNA AI] GROQ_API_KEY environment variable is not set.")
        return None

    try:
        from groq import Groq
        client = Groq(api_key=api_key.strip())

        # Build context snapshot
        suspects_summary = [
            f"- {s['name']} (ID: {s['id']}, Risk: {s['risk_level']}, Status: {s['status']}, Bail: {s['bail_status']}, Crimes: {', '.join(s['crime_types'])}, Locations: {', '.join(s['known_locations'])})"
            for s in SUSPECTS.values()
        ]
        firs_summary = [
            f"- FIR {f['fir_id']} ({f['crime_type']} at {f['location']}, status: {f['status']}, suspects: {', '.join(f['suspect_names'])})"
            for f in FIRS.values()
        ]

        system_prompt = (
            "You are PRAJNA AI, a specialized law enforcement intelligence analyst assistant for Karnataka State Police (KSP).\n"
            "You have access to the current active crime intelligence records:\n"
            "SUSPECTS:\n" + "\n".join(suspects_summary) + "\n\n"
            "FIRS & INCIDENTS:\n" + "\n".join(firs_summary) + "\n\n"
            "Instructions:\n"
            "1. Answer the officer's query accurately using the above intelligence.\n"
            "2. If queried in Kannada (or if language is kn-IN), reply in polite, professional Kannada.\n"
            "3. Return a clean, professional, concise response.\n"
            "4. Also identify any cited FIR IDs (e.g. KA/BLR/2024/001) or Suspect names mentioned.\n"
            "Format your reply as valid JSON with keys:\n"
            '{"answer": "...", "cited_firs": ["..."], "matched_suspect_ids": ["S001"]}'
        )

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Language: {language}\nInvestigator Query: {query}"}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
        )

        raw_content = chat_completion.choices[0].message.content.strip()
        
        # Try parsing JSON if model returned structured output, else use directly
        answer = raw_content
        cited_firs = []
        matched_suspect_ids = []

        try:
            # Handle markdown code blocks
            clean_json = raw_content
            if "```json" in clean_json:
                clean_json = clean_json.split("```json")[1].split("```")[0].strip()
            elif "```" in clean_json:
                clean_json = clean_json.split("```")[1].split("```")[0].strip()
            
            parsed = json.loads(clean_json)
            if isinstance(parsed, dict):
                answer = parsed.get("answer", raw_content)
                cited_firs = parsed.get("cited_firs", [])
                matched_suspect_ids = parsed.get("matched_suspect_ids", [])
        except Exception:
            # If not JSON, find cited FIRs and Suspects via regex/keywords
            for fir_id in FIRS.keys():
                if fir_id in raw_content:
                    cited_firs.append(fir_id)
            for s_id, s_data in SUSPECTS.items():
                if s_data["name"].lower() in raw_content.lower() or s_id in raw_content:
                    matched_suspect_ids.append(s_id)

        # Build dynamic nodes for canvas
        network = get_network_data()
        nodes = []
        matched_ids = set(matched_suspect_ids + [f"FIR:{f}" for f in cited_firs])
        for node in network["nodes"]:
            if node["id"] in matched_ids:
                nodes.append(node)

        return {
            "answer": answer,
            "nodes": nodes,
            "edges": get_edges_for_nodes([n["id"] for n in nodes]),
            "cited_firs": cited_firs,
            "intent": "llm_rag_groq",
            "matched_entity": "groq_llama3",
            "language": language,
        }
    except Exception as e:
        import traceback
        print(f"[PRAJNA AI] Groq inference error: {e}")
        traceback.print_exc()
        return None



def normalize_query(query: str):
    """
    Normalize investigator input for keyword matching.
    """

    return (
        query
        .strip()
        .lower()
    )


def build_suspect_nodes(
    suspect_ids: List[str],
):
    """
    Return graph nodes for selected suspects.
    """

    network = get_network_data()

    selected_ids = set(
        suspect_ids
    )

    return [
        deepcopy(node)
        for node in network["nodes"]
        if (
            node["id"]
            in selected_ids
        )
    ]


def build_related_network(
    suspect_ids: List[str],
):
    """
    Return selected suspect nodes and their directly connected nodes/edges.
    """

    network = get_network_data()

    selected_ids = set(
        suspect_ids
    )

    related_edges = []

    related_node_ids = set(
        selected_ids
    )

    for edge in network["edges"]:

        source = edge["source"]
        target = edge["target"]

        if (
            source in selected_ids
            or target in selected_ids
        ):

            related_edges.append(
                deepcopy(edge)
            )

            related_node_ids.add(
                source
            )

            related_node_ids.add(
                target
            )

    related_nodes = [
        deepcopy(node)
        for node in network["nodes"]
        if node["id"]
        in related_node_ids
    ]

    return (
        related_nodes,
        related_edges,
    )


def find_firs_by_location(
    location: str,
):
    """
    Find FIRs associated with a location.
    """

    return [
        deepcopy(fir)
        for fir in FIRS.values()
        if fir["location"].lower()
        == location.lower()
    ]


def find_firs_by_crime_type(
    crime_type: str,
):
    """
    Find FIRs containing a crime type.
    """

    results = []

    for fir in FIRS.values():

        crime_types = [
            crime.lower()
            for crime in fir.get(
                "crime_types",
                [],
            )
        ]

        if (
            crime_type.lower()
            in crime_types
        ):
            results.append(
                deepcopy(fir)
            )

    return results


def make_fir_nodes(
    firs: List[Dict[str, Any]],
):
    """
    Convert FIR records into graph nodes.
    """

    network = get_network_data()

    fir_ids = {
        f"FIR:{fir['fir_id']}"
        for fir in firs
    }

    return [
        deepcopy(node)
        for node in network["nodes"]
        if node["id"]
        in fir_ids
    ]


def make_location_nodes(
    firs: List[Dict[str, Any]],
):
    """
    Convert FIR locations into graph nodes.
    """

    network = get_network_data()

    locations = {
        fir["location"].lower()
        for fir in firs
    }

    return [
        deepcopy(node)
        for node in network["nodes"]
        if (
            node["type"] == "location"
            and node["label"].lower()
            in locations
        )
    ]


def get_edges_for_nodes(
    node_ids,
):
    """
    Return edges connected to selected nodes.
    """

    network = get_network_data()

    node_ids = set(
        node_ids
    )

    return [
        deepcopy(edge)
        for edge in network["edges"]
        if (
            edge["source"]
            in node_ids
            or edge["target"]
            in node_ids
        )
    ]


def process_query(
    query: str,
    language: str = "en-IN",
):
    """
    Main AI query processor with dynamic LLM inference, smart semantic search,
    and fallback handling.
    """
    # 1. First priority: Real ML / LLM Model (Groq Llama 3.3 70B)
    llm_result = query_groq_llm(query, language)
    if llm_result and llm_result.get("answer"):
        return llm_result

    normalized = normalize_query(query)

    # 2. Dynamic conversational greetings & common chatter ONLY if exact match
    if normalized in ["hi", "hello", "namaskara", "namaste", "hey", "good morning", "good evening", "hii"]:
        return {
            "answer": "Namaskara Officer. I am PRAJNA, your AI crime intelligence assistant powered by Llama 3. Ask me any question about suspects, crime trends, locations, FIRs, or predictive risk zones.",
            "nodes": [],
            "edges": [],
            "cited_firs": [],
            "intent": "greeting",
            "matched_entity": "system",
            "language": language,
        }

    # 3. Dynamic search across all locations (e.g. Bengaluru, Whitefield, Indiranagar, etc.)
    for loc_name in ["bengaluru", "bangalore", "whitefield", "marathahalli", "indiranagar", "mysuru", "electronic city", "hubli", "koramangala", "hsr", "kalaburagi", "mangaluru"]:
        if loc_name in normalized:
            # Match matching FIRs
            matching_firs = [
                deepcopy(f) for f in FIRS.values()
                if loc_name in f["location"].lower() or (loc_name in ["bengaluru", "bangalore"] and "bengaluru" in f["district"].lower())
            ]
            if matching_firs:
                fir_ids = [f["fir_id"] for f in matching_firs]
                fir_nodes = build_fir_nodes(matching_firs)
                suspect_ids = []
                for f in matching_firs:
                    suspect_ids.extend(f.get("suspect_ids", []))
                suspect_nodes = build_suspect_nodes(list(set(suspect_ids)))
                all_nodes = fir_nodes + suspect_nodes
                node_ids = [n["id"] for n in all_nodes]

                return {
                    "answer": f"Found {len(matching_firs)} incident(s) reported in the {loc_name.title()} jurisdiction. Linked offenses include {', '.join(set([f['crime_type'] for f in matching_firs]))} with primary suspects {', '.join(set([s['label'] for s in suspect_nodes])) or 'under review'}.",
                    "nodes": all_nodes,
                    "edges": get_edges_for_nodes(node_ids),
                    "cited_firs": fir_ids,
                    "intent": "location_investigation",
                    "matched_entity": loc_name,
                    "language": language,
                }

    # ---------------------------------------------------------------
    # RAJU QUERY
    # ---------------------------------------------------------------

    if (
        "raju" in normalized
        or "raju kumar" in normalized
    ):

        suspect = SUSPECTS["S001"]

        suspect_ids = [
            "S001",
            "S002",
            "S004",
        ]

        nodes, edges = build_related_network(
            suspect_ids
        )

        return {
            "answer": (
                "Raju Kumar is classified as a high-risk active suspect "
                "linked to three FIRs: KA/BLR/2024/001, "
                "KA/BLR/2024/002, and KA/BLR/2024/005. "
                "The network indicates direct associations with Suresh Naik "
                "and Vikram Shetty. Raju is currently marked as on bail and "
                "has known activity connected to Whitefield and Marathahalli."
            ),
            "nodes": nodes,
            "edges": edges,
            "cited_firs": deepcopy(
                suspect["linked_firs"]
            ),
            "intent": "suspect_profile",
            "matched_entity": "S001",
            "language": language,
        }

    # ---------------------------------------------------------------
    # WHITEFIELD QUERY
    # ---------------------------------------------------------------

    if "whitefield" in normalized:

        firs = find_firs_by_location(
            "Whitefield"
        )

        fir_nodes = make_fir_nodes(
            firs
        )

        location_nodes = make_location_nodes(
            firs
        )

        node_ids = [
            node["id"]
            for node in fir_nodes
        ] + [
            node["id"]
            for node in location_nodes
        ]

        edges = get_edges_for_nodes(
            node_ids
        )

        # Add suspects linked to these FIRs.
        suspect_ids = set()

        for fir in firs:
            suspect_ids.update(
                fir["suspect_ids"]
            )

        suspect_nodes = build_suspect_nodes(
            list(
                suspect_ids
            )
        )

        nodes = (
            suspect_nodes
            + fir_nodes
            + location_nodes
        )

        answer = (
            "Whitefield is associated with "
            f"{len(firs)} FIRs in the current intelligence dataset: "
            + ", ".join(
                fir["fir_id"]
                for fir in firs
            )
            + ". The cases include theft and ATM skimming activity. "
            "The linked suspects are Raju Kumar, Suresh Naik, and "
            "Vikram Shetty."
        )

        return {
            "answer": answer,
            "nodes": nodes,
            "edges": edges,
            "cited_firs": [
                fir["fir_id"]
                for fir in firs
            ],
            "intent": "location_search",
            "matched_entity": "Whitefield",
            "language": language,
        }

    # ---------------------------------------------------------------
    # NETWORK / ASSOCIATES QUERY
    # ---------------------------------------------------------------

    if (
        "network" in normalized
        or "associate" in normalized
        or "associates" in normalized
    ):

        network = get_network_data()

        suspect_nodes = [
            node
            for node in network["nodes"]
            if node["type"] == "suspect"
        ]

        suspect_names = [
            node["label"]
            for node in suspect_nodes
        ]

        return {
            "answer": (
                "The current criminal intelligence network contains "
                f"{len(suspect_nodes)} primary suspect nodes. "
                "The strongest direct suspect relationships are between "
                "Raju Kumar and Suresh Naik, Raju Kumar and Vikram Shetty, "
                "and Suresh Naik and Mohammed Irfan. "
                "The network also links suspects to FIRs, locations, "
                "and evidence records."
            ),
            "nodes": deepcopy(
                network["nodes"]
            ),
            "edges": deepcopy(
                network["edges"]
            ),
            "cited_firs": list(
                FIRS.keys()
            ),
            "intent": "network_analysis",
            "matched_entity": "criminal_network",
            "language": language,
        }

    # ---------------------------------------------------------------
    # THEFT QUERY
    # ---------------------------------------------------------------

    if "theft" in normalized:

        firs = find_firs_by_crime_type(
            "theft"
        )

        suspect_ids = set()

        for fir in firs:
            suspect_ids.update(
                fir["suspect_ids"]
            )

        suspect_nodes = build_suspect_nodes(
            list(
                suspect_ids
            )
        )

        fir_nodes = make_fir_nodes(
            firs
        )

        nodes = (
            suspect_nodes
            + fir_nodes
        )

        node_ids = [
            node["id"]
            for node in nodes
        ]

        edges = get_edges_for_nodes(
            node_ids
        )

        return {
            "answer": (
                "The intelligence dataset contains "
                f"{len(firs)} theft-related FIR records. "
                "These are "
                + ", ".join(
                    fir["fir_id"]
                    for fir in firs
                )
                + ". The linked suspects include "
                + ", ".join(
                    sorted(
                        {
                            name
                            for fir in firs
                            for name in fir["suspect_names"]
                        }
                    )
                )
                + "."
            ),
            "nodes": nodes,
            "edges": edges,
            "cited_firs": [
                fir["fir_id"]
                for fir in firs
            ],
            "intent": "crime_type_search",
            "matched_entity": "theft",
            "language": language,
        }

    # ---------------------------------------------------------------
    # BAIL QUERY
    # ---------------------------------------------------------------

    if "bail" in normalized:

        bail_suspects = [
            suspect
            for suspect in SUSPECTS.values()
            if suspect["bail_status"]
            == "on_bail"
        ]

        suspect_ids = [
            suspect["id"]
            for suspect in bail_suspects
        ]

        nodes = build_suspect_nodes(
            suspect_ids
        )

        edges = get_edges_for_nodes(
            suspect_ids
        )

        cited_firs = []

        for suspect in bail_suspects:
            cited_firs.extend(
                suspect["linked_firs"]
            )

        return {
            "answer": (
                "Two suspects in the current mock intelligence dataset "
                "are marked as currently on bail: Raju Kumar and "
                "Mohammed Irfan. Raju Kumar is linked to three FIRs, "
                "while Mohammed Irfan is linked to two FIRs."
            ),
            "nodes": nodes,
            "edges": edges,
            "cited_firs": sorted(
                set(
                    cited_firs
                )
            ),
            "intent": "bail_analysis",
            "matched_entity": "on_bail",
            "language": language,
        }

    # ---------------------------------------------------------------
    # PRESSURE / HOTSPOT QUERY
    # ---------------------------------------------------------------

    if (
        "pressure" in normalized
        or "hotspot" in normalized
    ):

        top_zones = get_top_pressure_zones(
            3
        )

        zone_names = [
            zone["zone_name"]
            for zone in top_zones
        ]

        nodes = []

        for zone in top_zones:
            nodes.append({
                "id": zone["zone_id"],
                "label": zone["zone_name"],
                "type": "location",
                "data": deepcopy(
                    zone
                ),
            })

        return {
            "answer": (
                "The current predictive crime pressure analysis identifies "
                "the following top zones: "
                + ", ".join(
                    zone_names
                )
                + ". "
                "The ranking combines bail-release activity, public events, "
                "economic stress, and infrastructure growth. "
                "These areas should be considered for preventive patrol "
                "prioritization and additional field intelligence."
            ),
            "nodes": nodes,
            "edges": [],
            "cited_firs": [],
            "pressure_zones": top_zones,
            "intent": "pressure_analysis",
            "matched_entity": "crime_pressure",
            "language": language,
        }

    # ---------------------------------------------------------------
    # GROQ LLM / ML RAG INTEGRATION & INTELLIGENT FALLBACK
    # ---------------------------------------------------------------
    llm_result = query_groq_llm(query, language)
    if llm_result:
        return llm_result

    return {
        "answer": (
            "I could not find a direct match for that query in the current "
            "PRAJNA intelligence dataset. Try asking about Raju Kumar, "
            "Whitefield, the criminal network, associates, theft cases, "
            "suspects on bail, or crime pressure hotspots."
        ),
        "nodes": [],
        "edges": [],
        "cited_firs": [],
        "intent": "no_match",
        "matched_entity": None,
        "suggested_queries": [
            "Show me Raju Kumar's profile",
            "What FIRs are linked to Whitefield?",
            "Show the criminal network",
            "Which suspects are currently on bail?",
            "What are the top crime pressure hotspots?",
            "Show all theft cases",
        ],
        "language": language,
    }