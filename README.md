# PRAJNA — KSP Crime Intelligence Platform
**Unified AI Platform built for KSP Datathon 2026 (Challenges 01 & 02)**

PRAJNA (Predictive Reasoning & Adaptive Justice Network for Action) is a unified AI platform that fuses conversational graph reasoning for investigators (Challenge 01) with predictive crime pressure analytics across Karnataka (Challenge 02) through a shared **Crime Intelligence Graph**.

---

## 🌟 Key Features

1. **Case Canvas (Spatial Node Graph)**: Full-screen zoomable D3.js force-directed graph with color-coded nodes:
   - 🔴 **Suspects** (Red)
   - 🔵 **FIRs** (Blue)
   - 🟢 **Locations / Jurisdictions** (Green)
   - 🟡 **Evidence Artifacts** (Yellow)
2. **Conversational AI & Voice Querying**: Text + Browser-native Web Speech API voice input with automatic language support for **English (`en-IN`)** and **Kannada (`kn-IN`)**.
3. **Memory Weaving Engine**: Captures every query, AI finding, and outcome tag as an immutable memory thread.
4. **Crime Pressure Map**: Leaflet.js heatmap & zone breakdown across Karnataka calculating risk score based on:
   $$\text{Pressure Score} = (\text{Bail Releases} \times 0.4) + (\text{Festivals} \times 0.3) + (\text{Economic Stress} \times 0.2) + (\text{New ATMs} \times 0.1)$$
5. **Bidirectional Anomaly Alerts**: High-pressure zones detected on the map trigger active alert banners on the Case Canvas chat.
6. **Intelligence Brief PDF Exporter**: Generates 1-page official PDF reports using jsPDF client-side, featuring an interactive **Officer Dissent Flag** feedback mechanism.

---

## 📁 Project Folder Structure

```
prajna/
├── backend/
│   ├── main.py              # FastAPI app with CORS & endpoints
│   ├── mock_db.py           # Suspects, FIRs, evidence & zone dataset
│   ├── query_engine.py      # Pattern-matching NLP query processor
│   ├── memory_weaving.py    # Memory thread logger & dissent tracker
│   ├── pressure_engine.py   # Crime pressure score calculator
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── package.json         # React 18, Vite, D3, Leaflet, jsPDF
│   ├── index.html           # Tailwind CSS CDN + Google Fonts
│   ├── vite.config.js       # Vite server & API proxy config
│   └── src/
│       ├── App.jsx          # Top navbar, state & layout
│       ├── components/
│       │   ├── CaseCanvas.jsx        # D3 force-directed spatial graph
│       │   ├── ChatPanel.jsx         # AI chat & memory weaving sidebar
│       │   ├── VoiceInput.jsx        # Web Speech API (English & Kannada)
│       │   ├── PressureMap.jsx font  # Leaflet pressure heatmap & inspector
│       │   ├── NodeDetail.jsx        # Entity detail side panel
│       │   └── IntelligenceBrief.jsx # jsPDF generator with dissent flag
│       └── utils/
│           └── api.js                # Fetch API client
├── catalyst/
│   ├── catalyst-config.json # Zoho Catalyst configuration
│   └── functions/
│       └── prajna-api/
│           ├── index.js     # Express serverless handler
│           └── package.json
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.9+ installed
- Node.js 18+ and `npm` installed

### 1. Run the Python FastAPI Backend

Navigate to the `backend` directory:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI backend server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

*The backend server will run at `http://localhost:8000`. You can test interactive API documentation at `http://localhost:8000/docs`.*

---

### 2. Run the React Frontend

Open a new terminal window, and navigate to the `frontend` directory:

```bash
cd frontend
```

Install Node dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to:
**`http://localhost:5173`**

---

## ☁️ Deployment to Zoho Catalyst

To deploy PRAJNA to Zoho Catalyst (Node.js functions + static web client hosting):

1. **Install Catalyst CLI**:
   ```bash
   npm install -g zcatalyst-cli
   ```

2. **Login to Catalyst**:
   ```bash
   catalyst login
   ```

3. **Build Frontend Bundle**:
   ```bash
   cd frontend
   npm run build
   ```

4. **Deploy to Catalyst Project**:
   From the root `prajna` project folder:
   ```bash
   catalyst deploy
   ```

---

## 💡 Example Queries to Try in Case Canvas Chat

- **Suspect Profile & Network**: `"Show Raju Kumar network"`
- **Location Investigation**: `"Crime in Whitefield"`
- **Offense Type Filter**: `"Show recent theft FIRs"`
- **Recidivism & Risk Vectors**: `"Which suspects are currently on bail?"`
- **Predictive Hotspots**: `"Top crime pressure hotspots"`
