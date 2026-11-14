# PRAJNA

**Crime Intelligence Platform for Karnataka State Police**  
Built for KSP Datathon 2026 · Challenges 01 & 02

---

PRAJNA (Predictive Reasoning & Adaptive Justice Network for Action) gives investigators a conversational interface over crime data while command centers get real-time pressure analytics across Karnataka — both powered by a shared Crime Intelligence Graph.

The platform currently covers **8 suspects**, **11 FIRs**, and **10 monitored zones** across **5 districts** (Bengaluru Urban, Mysuru, Hubli-Dharwad, Kalaburagi, Mangaluru).

---

## Features

**Case Canvas & Chat**  
Officers type or speak a query in English or Kannada. The backend processes it, returns a text answer plus graph data, and the UI renders a live D3.js force-directed knowledge graph — connecting suspects, FIRs, locations, and evidence in real time.

**Crime Pressure Map**  
A Leaflet.js heatmap that scores districts by four risk factors — bail releases, upcoming festivals, economic stress, and new ATM installations. Zones above the alert threshold surface as active warnings on the dashboard.

**Memory Weaving**  
Every query and AI finding is logged as an immutable memory thread tied to the officer's session. Accessible later from the Officer Profile page for audit and review.

**Intelligence Brief Export**  
One-click PDF generation from the current session. Includes an Officer Dissent Flag field for inline disagreement with AI findings — supporting human-in-the-loop accountability.

**Auth & Sessions**  
Login screen with officer ID and name. Session data stored in localStorage — no backend auth table required for the demo. Swap in JWT when a real user store is available.

---

## Project Structure

```
prajna/
├── backend/
│   ├── main.py              # FastAPI routes, CORS, request models
│   ├── mock_db.py           # Crime dataset + get_stats(), get_network_data()
│   ├── query_engine.py      # Pattern-based NLP query processor
│   ├── pressure_engine.py   # District pressure score calculator
│   ├── memory_weaving.py    # Session memory logger
│   └── requirements.txt
├── frontend/
│   ├── index.html           # Loads Tailwind, D3, Leaflet, jsPDF via CDN
│   ├── vercel.json          # SPA rewrite rule for Vercel deployment
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── components/
│       │   ├── CaseCanvas.jsx        # D3 force graph
│       │   ├── ChatPanel.jsx         # Query interface + memory
│       │   ├── VoiceInput.jsx        # Web Speech API (en-IN, kn-IN)
│       │   ├── PressureMap.jsx       # Leaflet heatmap
│       │   ├── IntelligenceBrief.jsx # jsPDF export + dissent flag
│       │   ├── Sidebar.jsx           # Navigation + live alert badge
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── DashboardLayout.jsx
│       │   ├── HomePage.jsx          # Stats cards + alerts panel
│       │   ├── ChatCanvasPage.jsx
│       │   ├── PressureMapPage.jsx
│       │   └── ProfilePage.jsx
│       └── utils/
│           ├── api.js                # Fetch client (uses VITE_API_URL)
│           └── tts.js
└── render.yaml                       # Render deployment config (backend)
```

---

## Running Locally

**Requirements:** Python 3.9+, Node.js 18+

**Backend**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

The frontend reads `VITE_API_URL` for the backend address. In development it falls back to `http://localhost:8000/api` automatically.

---

## Deployment

**Frontend → Vercel**

1. Import the GitHub repo in [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com/api`
4. Deploy

The `vercel.json` in the frontend folder handles SPA routing automatically.

**Backend → Render**

1. Connect the GitHub repo in [render.com](https://render.com)
2. Create a new **Web Service**, root directory `backend`
3. Render reads `render.yaml` for build and start commands automatically
4. After deploy, copy the Render service URL and paste it into Vercel's `VITE_API_URL`
5. Add `CORS_ORIGINS=https://your-vercel-url.vercel.app` as an environment variable in Render

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | Platform-wide summary (suspects, FIRs, zones, alerts) |
| `POST` | `/api/query` | Process an investigator query |
| `GET` | `/api/network` | Full knowledge graph (nodes + edges) |
| `GET` | `/api/pressure` | Crime pressure scores for all zones |
| `GET` | `/api/alerts` | Active high-pressure zone alerts |
| `GET` | `/api/suspects` | All suspect records |
| `GET` | `/api/firs` | All FIR records |
| `GET` | `/api/suspect/{id}` | Single suspect with linked FIR details |
| `GET` | `/api/fir/{id}` | Single FIR record |
| `GET` | `/api/memory/{officer_id}` | Query history for an officer |
| `POST` | `/api/memory/dissent` | Record officer dissent on an AI finding |

---

## Sample Queries

| Query | Returns |
|-------|---------|
| `Show Raju Kumar network` | Suspect profile + connected FIRs and locations |
| `Crime in Whitefield` | All incidents linked to that jurisdiction |
| `Show recent theft FIRs` | Filtered FIR list by offense type |
| `Which suspects are on bail?` | Bail status across all suspects |
| `Absconding suspects` | Suspects with active warrant / absconding status |
| `Show cybercrime cases` | FIRs filtered by cybercrime type |
| `Top crime pressure hotspots` | Highest-scoring districts from the pressure engine |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 8, Tailwind CSS, React Router 6 |
| Visualization | D3.js v7 (CDN), Leaflet.js 1.9 |
| PDF Export | jsPDF |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Deployment | Vercel (frontend) + Render (backend) |

---

## License

MIT
