"""
PRAJNA - KSP Crime Intelligence Platform
Memory Weaving Engine (memory_weaving.py)
Captures investigator query history, memory threads, and human-in-the-loop dissent flags.
"""

import time
import uuid

# In-memory memory thread database
MEMORY_THREADS = []

# Initial mock memory history for demo
INITIAL_THREADS = [
    {
        "thread_id": "MEM-1001",
        "officer_id": "OFF-4092",
        "session_id": "SESS-8801",
        "timestamp": "2026-07-22 14:30:12",
        "query": "Who are Raju Kumar's known co-accused in Whitefield thefts?",
        "response": "Raju Kumar is linked to Suresh Naik (KA/BLR/2024/001) and Vikram Shetty (KA/BLR/2024/005) across multiple incidents in Whitefield.",
        "cited_firs": ["KA/BLR/2024/001", "KA/BLR/2024/005"],
        "nodes_involved": ["SUSP-001", "SUSP-002", "SUSP-004", "KA/BLR/2024/001", "KA/BLR/2024/005"],
        "outcome_tag": "Confirmed Link",
        "dissent_flag": False,
        "dissent_notes": ""
    },
    {
        "thread_id": "MEM-1002",
        "officer_id": "OFF-4092",
        "session_id": "SESS-8801",
        "timestamp": "2026-07-22 15:15:44",
        "query": "Show crime pressure hotspots near Electronic City.",
        "response": "Electronic City zone (BLR_SOUTH) shows Medium pressure (61.2). Primary factor: 19 new ATM kiosks and financial fraud FIR KA/BLR/2024/004 involving Vikram Shetty.",
        "cited_firs": ["KA/BLR/2024/004"],
        "nodes_involved": ["BLR_SOUTH", "SUSP-004", "KA/BLR/2024/004"],
        "outcome_tag": "Follow-up Pending",
        "dissent_flag": False,
        "dissent_notes": ""
    }
]

MEMORY_THREADS.extend(INITIAL_THREADS)

def save_memory_thread(officer_id, query, response, cited_firs=None, nodes_involved=None, outcome_tag="Investigation Active", session_id="SESS-DEFAULT", dissent_flag=False, dissent_notes=""):
    """
    Saves an investigator interaction as a Memory Thread.
    """
    thread_id = f"MEM-{uuid.uuid4().hex[:6].upper()}"
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

    thread = {
        "thread_id": thread_id,
        "officer_id": officer_id or "OFF-4092",
        "session_id": session_id or "SESS-DEFAULT",
        "timestamp": timestamp,
        "query": query,
        "response": response,
        "cited_firs": cited_firs or [],
        "nodes_involved": nodes_involved or [],
        "outcome_tag": outcome_tag,
        "dissent_flag": dissent_flag,
        "dissent_notes": dissent_notes
    }

    MEMORY_THREADS.insert(0, thread)
    return thread

def get_officer_memories(officer_id):
    """
    Returns past memory threads for a given officer ID.
    """
    if not officer_id:
        return MEMORY_THREADS
    filtered = [m for m in MEMORY_THREADS if m["officer_id"] == officer_id]
    return filtered if filtered else MEMORY_THREADS

def record_dissent(thread_id, dissent_notes):
    """
    Updates a memory thread with officer dissent feedback.
    """
    for thread in MEMORY_THREADS:
        if thread["thread_id"] == thread_id:
            thread["dissent_flag"] = True
            thread["dissent_notes"] = dissent_notes
            thread["outcome_tag"] = "Dissent Flagged"
            return thread
    return None
