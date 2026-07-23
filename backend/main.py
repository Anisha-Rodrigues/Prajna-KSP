"""
PRAJNA - KSP Crime Intelligence Platform
FastAPI Application Entry Point (main.py)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from mock_db import SUSPECTS, FIRS, EVIDENCE
from query_engine import process_query, build_full_network_graph
from pressure_engine import get_all_zone_pressures, get_active_alerts
from memory_weaving import save_memory_thread, get_officer_memories, record_dissent

app = FastAPI(
    title="PRAJNA - KSP Crime Intelligence API",
    description="Unified API for Case Canvas, Crime Pressure Analytics & Memory Weaving (KSP Datathon 2026)",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Pydantic Schemas
class QueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en-IN"
    officer_id: Optional[str] = "OFF-4092"
    session_id: Optional[str] = "SESS-8801"

class MemoryRequest(BaseModel):
    officer_id: str
    query: str
    response: str
    cited_firs: Optional[List[str]] = []
    outcome: Optional[str] = "Investigation Active"
    session_id: Optional[str] = "SESS-DEFAULT"

class DissentRequest(BaseModel):
    thread_id: str
    dissent_notes: str

@app.get("/")
def root():
    return {
        "platform": "PRAJNA - KSP Crime Intelligence Platform",
        "status": "Online",
        "version": "1.0.0",
        "challenges_addressed": ["Challenge 01: Conversational AI & Case Canvas", "Challenge 02: Crime Analytics & Pressure Map"]
    }

@app.post("/api/query")
def api_query(req: QueryRequest):
    """
    Executes natural language query and returns AI analysis + Graph Nodes/Edges + Memory Thread ID.
    """
    if not req.query:
        raise HTTPException(status_code=400, detail="Query text cannot be empty")
    return process_query(
        query=req.query,
        language=req.language,
        officer_id=req.officer_id,
        session_id=req.session_id
    )

@app.get("/api/network")
def api_network():
    """
    Returns full Crime Intelligence Graph (Nodes & Edges).
    """
    return build_full_network_graph()

@app.get("/api/fir/{fir_id:path}")
def api_fir(fir_id: str):
    """
    Returns full detail for a specific FIR.
    """
    if fir_id in FIRS:
        return FIRS[fir_id]
    raise HTTPException(status_code=404, detail=f"FIR {fir_id} not found")

@app.get("/api/suspect/{suspect_id}")
def api_suspect(suspect_id: str):
    """
    Returns suspect profile + linked FIR details.
    """
    # Direct ID match
    if suspect_id in SUSPECTS:
        s = SUSPECTS[suspect_id]
        linked_firs = [FIRS[f] for f in s["firs"] if f in FIRS]
        return {**s, "linked_fir_details": linked_firs}
    
    # Search by name/alias match
    for s_id, s in SUSPECTS.items():
        if s["name"].lower() == suspect_id.lower() or suspect_id.lower() in [a.lower() for a in s["aliases"]]:
            linked_firs = [FIRS[f] for f in s["firs"] if f in FIRS]
            return {**s, "linked_fir_details": linked_firs}

    raise HTTPException(status_code=404, detail=f"Suspect {suspect_id} not found")

@app.get("/api/pressure")
def api_pressure():
    """
    Returns zone pressure scores across all Karnataka zones.
    """
    return get_all_zone_pressures()

@app.post("/api/memory")
def api_save_memory(req: MemoryRequest):
    """
    Saves a custom memory thread.
    """
    thread = save_memory_thread(
        officer_id=req.officer_id,
        query=req.query,
        response=req.response,
        cited_firs=req.cited_firs,
        outcome_tag=req.outcome,
        session_id=req.session_id
    )
    return thread

@app.post("/api/memory/dissent")
def api_record_dissent(req: DissentRequest):
    """
    Records officer dissent feedback against an AI memory thread.
    """
    updated = record_dissent(req.thread_id, req.dissent_notes)
    if updated:
        return {"status": "success", "message": "Dissent recorded successfully", "thread": updated}
    raise HTTPException(status_code=404, detail=f"Memory thread {req.thread_id} not found")

@app.get("/api/memory/{officer_id}")
def api_get_memory(officer_id: str):
    """
    Returns memory thread history for a given officer ID.
    """
    return get_officer_memories(officer_id)

@app.get("/api/alerts")
def api_alerts():
    """
    Returns active anomaly alerts from pressure engine.
    """
    return get_active_alerts()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
