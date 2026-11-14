# PRAJNA

**Crime Intelligence Platform for Karnataka State Police**  
Built for KSP Datathon 2026 · Challenges 01 & 02

---

PRAJNA (Predictive Reasoning & Adaptive Justice Network for Action) is a full-stack intelligence platform that gives investigators a conversational interface over crime data, while command centers get real-time pressure analytics across Karnataka — both powered by a shared Crime Intelligence Graph.

---

## Features

**Case Canvas**  
A zoomable, force-directed graph built with D3.js. Nodes are color-coded by entity type — suspects, FIRs, locations, and evidence. Click any node to inspect linked records.

**AI Chat & Voice Query**  
Officers query the graph by typing or speaking. Voice input uses the browser's Web Speech API and supports English (`en-IN`) and Kannada (`kn-IN`).

**Crime Pressure Map**  
A Leaflet.js heatmap that scores districts by risk factors — bail releases, upcoming festivals, economic stress, and new ATM installations — updated on each session load.

**Memory Weaving Engine**  
Every query and AI finding is logged as a persistent memory thread tied to the officer's session, surfaced later in the Officer Profile page.

**Intelligence Brief Export**  
One-click PDF generation via jsPDF. Includes an Officer Dissent Flag field for inline feedback on AI findings.

---

## Project Structure

```
prajna/
├── backend/
│   ├── main.py              # FastAPI application, routes, CORS
│   ├── mock_db.py           # Crime dataset — suspects, FIRs, zones
│   ├── query_engine.py      # Pattern-based NLP query processor
│   ├── pressure_engine.py   # District pressure score calculator
│   ├── memory_weaving.py    # Session memory logger
│   └── requirements.txt
├── frontend/
│   ├── index.html           # Entry point; loads Tailwind, D3, Leaflet via CDN
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── context/
│       │   └── AuthContext.jsx      # Officer session management
│       ├── components/
│       │   ├── CaseCanvas.jsx       # D3 force graph
│       │   ├── ChatPanel.jsx        # Query interface + memory logging
│       │   ├── VoiceInput.jsx       # Web Speech API wrapper
│       │   ├── PressureMap.jsx      # Leaflet heatmap
│       │   ├── IntelligenceBrief.jsx
│       │   ├── Sidebar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── DashboardLayout.jsx
│       │   ├── HomePage.jsx
│       │   ├── ChatCanvasPage.jsx
│       │   ├── PressureMapPage.jsx
│       │   └── ProfilePage.jsx
│       └── utils/
│           ├── api.js               # API client
│           └── tts.js               # Text-to-speech helper
└── catalyst.json
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

API available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`

---

## Deployment

PRAJNA is configured for Zoho Catalyst — the Python backend runs as an AppSail container, and the React frontend is served via Catalyst's static hosting.

**1. Install the Catalyst CLI**

```bash
npm install -g zcatalyst-cli
```

**2. Authenticate**

```bash
catalyst login
```

**3. Build the frontend**

```bash
cd frontend && npm run build
```

**4. Deploy**

```bash
catalyst deploy
```

---

## Sample Queries

| Query | What it returns |
|---|---|
| `Show Raju Kumar network` | Suspect profile + connected FIRs and locations |
| `Crime in Whitefield` | All incidents linked to that jurisdiction |
| `Show recent theft FIRs` | Filtered FIR list by offense type |
| `Which suspects are on bail?` | Bail status across the dataset |
| `Top crime pressure hotspots` | Highest-scoring districts from the pressure engine |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS, React Router 6 |
| Visualization | D3.js v7 (CDN), Leaflet.js 1.9 |
| PDF Export | jsPDF 2.5 |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Deployment | Zoho Catalyst (AppSail + Static Hosting) |

---

## License

MIT
