/**
 * PRAJNA - KSP Crime Intelligence Platform
 * API Utilities Client (utils/api.js)
 */

const API_BASE = 'http://localhost:8000/api';

export async function sendQuery(queryText, language = 'en-IN', officerId = 'OFF-4092', sessionId = 'SESS-8801') {
  try {
    const res = await fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: queryText,
        language,
        officer_id: officerId,
        session_id: sessionId
      })
    });
    if (!res.ok) throw new Error(`Query failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error('API query error:', err);
    throw err;
  }
}

export async function getNetworkGraph() {
  try {
    const res = await fetch(`${API_BASE}/network`);
    if (!res.ok) throw new Error(`Network fetch failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error('API network error:', err);
    throw err;
  }
}

export async function getFirDetail(firId) {
  try {
    const res = await fetch(`${API_BASE}/fir/${encodeURIComponent(firId)}`);
    if (!res.ok) throw new Error(`FIR fetch failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error('API FIR error:', err);
    throw err;
  }
}

export async function getSuspectDetail(suspectId) {
  try {
    const res = await fetch(`${API_BASE}/suspect/${encodeURIComponent(suspectId)}`);
    if (!res.ok) throw new Error(`Suspect fetch failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error('API suspect error:', err);
    throw err;
  }
}

export async function getZonePressures() {
  try {
    const res = await fetch(`${API_BASE}/pressure`);
    if (!res.ok) throw new Error(`Pressure fetch failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error('API pressure error:', err);
    throw err;
  }
}

export async function getOfficerMemory(officerId = 'OFF-4092') {
  try {
    const res = await fetch(`${API_BASE}/memory/${encodeURIComponent(officerId)}`);
    if (!res.ok) throw new Error(`Memory fetch failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error('API memory error:', err);
    return [];
  }
}

export async function submitOfficerDissent(threadId, dissentNotes) {
  try {
    const res = await fetch(`${API_BASE}/memory/dissent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        thread_id: threadId,
        dissent_notes: dissentNotes
      })
    });
    if (!res.ok) throw new Error(`Dissent submit failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error('API dissent submission error:', err);
    throw err;
  }
}

export async function getActiveAlerts() {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error(`Alerts fetch failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error('API alerts error:', err);
    return [];
  }
}
