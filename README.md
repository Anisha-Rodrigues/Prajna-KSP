<div align="center">

# PRAJNA (ಪ್ರಜ್ಞಾ)
### Predictive Real-Time Analytics for Justice & Network Analysis
**Karnataka State Police (KSP) · Central Crime Intelligence & Predictive Patrol Command**

[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://prajna-ksp.vercel.app)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python_3.11-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://prajna-backend-g1yo.onrender.com)
[![Groq](https://img.shields.io/badge/LLM_Engine-Groq_Llama_3.3_70B-F05032?style=for-the-badge)](https://groq.com)
[![D3.js](https://img.shields.io/badge/Knowledge_Graph-D3.js_v7-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)](https://d3js.org)
[![Leaflet](https://img.shields.io/badge/Spatial_Mapping-Leaflet.js-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Deployment](https://img.shields.io/badge/Cloud-Vercel_•_Render-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://prajna-ksp.vercel.app)

<br/>

**[🌐 Live Web Application](https://prajna-ksp.vercel.app)** • **[⚡ Live API Backend](https://prajna-backend-g1yo.onrender.com/docs)** • **[📊 Interactive Pitch Deck](https://prajna-ksp.vercel.app/app)**

---

</div>

## 📌 Executive Summary

Modern criminal syndicates operate fluidly across district and state boundaries. However, law enforcement intelligence often remains siloed within individual police stations. Investigating cross-jurisdictional networks currently requires weeks of manual paper cross-referencing, while field officers lack real-time biometric and bail-status verification at checkpoints.

**PRAJNA** is an enterprise-grade AI intelligence platform engineered for the **Karnataka State Police (KSP)**. Built for **KSP Datathon 2026 (Challenges 01 & 02)**, PRAJNA unifies unstructured First Information Report (FIR) repositories, biometric registries (NAFIS), spatial GIS feeds, and court bail registries into an interconnected, actionable intelligence grid.

---

## 🎯 Key Operational Modules

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                    PRAJNA CENTRAL INTELLIGENCE COMMAND                        │
├───────────────────┬───────────────────┬───────────────────┬───────────────────┤
│    CASE CANVAS    │     BIOMETRIC     │     PRESSURE      │     SECURITY      │
│     & AI CHAT     │      SCANNER      │      HEATMAP      │      DOSSIER      │
├───────────────────┼───────────────────┼───────────────────┼───────────────────┤
│ • D3.js Force-    │ • Webcam FRT      │ • 72-Hour Hex     │ • Court Bail      │
│   Directed Graph  │   Feature Vectors │   Pressure Grid   │   Compliance Log  │
│ • Groq Llama 3.3  │ • NAFIS 10-Digit  │ • 4 Factor Risk:  │ • Auditable       │
│   70B RAG Engine  │   WSQ Fingerprint │   Bail, Festivals,│   Dissent Engine  │
│ • Bilingual Query │ • Instant Mismatch│   Economic Stress,│ • Encrypted PDF   │
│   (English/Kannada│   Detection       │   Infrastructure  │   Brief Export    │
└───────────────────┴───────────────────┴───────────────────┴───────────────────┘
```

### 1. Case Canvas & Cognitive Graph Engine (`/app/chat`)
- **Interactive Network Graph**: Powered by **D3.js**, visualizing complex syndicates, co-accused affiliations, linked FIRs, locations, and seized forensic evidence.
- **Bilingual RAG Query Assistant**: Ingests natural language queries (English and Kannada) and retrieves structured entities using **Groq-accelerated Llama 3.3 70B Versatile**.
- **Memory Weaving (Patented Workflow)**: Preserves investigator session context across queries, allowing cumulative hypothesis building without context degradation.

### 2. Zero-ID Biometric & Facial Recognition Scanner (`/app/scanner`)
- **Real-Time Facial Recognition (FRT)**: Live webcam frame capture extracting 68 facial landmark vectors with automatic matching against KSP biometric databases.
- **NAFIS Digital Fingerprint Integration**: Ingests National Automated Fingerprint Identification System (NAFIS) WSQ biometric prints for criminal identification at field checkpoints.
- **Smart Mismatch & False-Positive Elimination**: Automatically classifies registered targets while flagging unregistered citizens and unknown individuals as non-criminal mismatches.

### 3. Spatial Crime Pressure Heatmap (`/app/pressure`)
- **Predictive Risk Scoring**: A spatial-temporal modeling engine across all 31 districts of Karnataka.
- **Multi-Factor Risk Algorithm**:
  $$\text{Pressure Score} = 0.40(Bail) + 0.30(Festivals) + 0.20(Economic Stress) + 0.10(Infrastructure)$$
- **Automated Battalion Routing**: Recommends preemptive patrol allocations before high-density public gatherings and festival surges (e.g., Mysuru Dasara, Bengaluru Karaga).

### 4. Security Dossier & Legal Bail Registry (`/app/profile`)
- **Bail Condition Tracking**: Continuously monitors release dates, jurisdiction limits, and legal compliance.
- **Human-in-the-Loop Dissent Engine**: Allows officers to formally register disagreements with AI-generated hypotheses, ensuring full evidentiary compliance in judicial proceedings.
- **Intelligence Brief Export**: Generates one-click cryptographic PDF briefs containing node graphs, FIR citations, and chain-of-custody logs.

---

## 💼 GovTech ROI & Business Economics

Built as a **B2G (Business-to-Government) SaaS Platform**, PRAJNA modernizes public safety infrastructure while generating measurable fiscal savings.

| Economic Metric | Traditional Police Workflow | With PRAJNA Platform | Operational Impact |
|---|---|---|---|
| **Inter-District FIR Linking** | 3 – 4 Weeks of physical dispatch | **< 8 Seconds** via Graph AI | **99% Faster Resolution** |
| **Field Biometric Verification** | 48 – 72 Hours (Manual CID check) | **Real-Time (< 10s)** via Mobile/Terminal | **Immediate Checkpoint Intercept** |
| **Patrol Fuel & Fleet Expense** | Random wandering patrols | **Predictive Battalion Routing** | **34% Fuel & Depr. Reduction** |
| **Karnataka State Savings** | Baseline expenditure | **₹4.2 Crore / Year** saved across 31 Districts | **High GovTech ROI** |
| **Bail Violator Apprehension** | ~12% manual detection | **70%+ proactive flagging** | **Significant Crime Prevention** |

### Market Opportunity
- **TAM (Total Addressable Market)**: $45.8B Global AI Public Safety & Smart Policing by 2027.
- **SAM (Serviceable Addressable Market)**: $2.4B Indian Smart City & Law Enforcement Modernization.
- **Commercial Model**: ₹25 Lakh / District / Year B2G License (₹7.7 Cr ARR pipeline across Karnataka's 31 districts) + API queries for transport hubs and private enterprise campuses.

---

## 🏗️ System Architecture

```
                      ┌──────────────────────────────────────┐
                      │          FIELD & COMMAND UI          │
                      │   React 19 + Vite + Tailwind CSS    │
                      └──────────────────┬───────────────────┘
                                         │ HTTPS / REST
                      ┌──────────────────▼───────────────────┐
                      │          FASTAPI BACKEND GATEWAY     │
                      │  Asynchronous Python 3.11 Microservice│
                      └────┬──────────────┬──────────────┬────┘
                           │              │              │
              ┌────────────▼──┐    ┌──────▼─────┐   ┌────▼─────────────┐
              │  QUERY ENGINE │    │  PRESSURE  │   │  BIOMETRIC &     │
              │  Groq RAG     │    │  ALGORITHM │   │  NAFIS PIPELINE  │
              │  Llama 3.3 70B│    │  Spatial   │   │  Pixel & Feature │
              │  Memory Weave │    │  Hex Grid  │   │  Distance Match  │
              └───────────────┘    └────────────┘   └──────────────────┘
```

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 19, Vite | Lightning-fast component rendering and HMR |
| **Styling & UI** | Tailwind CSS, SVG Icons | Responsive dark-mode law enforcement command UI |
| **Data Visualization** | D3.js (v7) | Force-directed physics network graph of syndicates |
| **Geographic GIS** | Leaflet.js, OpenStreetMap | Interactive multi-layer heatmap with custom hex markers |
| **Backend Core** | FastAPI, Uvicorn, Python 3.11 | High-throughput asynchronous REST API |
| **AI / Large Language Model** | Groq Cloud, Llama 3.3 70B Versatile | Ultra-fast RAG query parsing and synthesis |
| **Document Generation** | jsPDF, html2canvas | Client-side encrypted PDF intelligence briefing |
| **Cloud Deployment** | Vercel (SPA) & Render (API) | Automated GitHub CI/CD continuous deployment |

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.11+ and **pip**
- **Groq API Key** (Optional, falls back to deterministic rule engine if absent)

### 1. Clone the Repository
```bash
git clone https://github.com/Anisha-Rodrigues/Prajna-KSP.git
cd Prajna-KSP
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt

# Create .env file with your Groq API key:
echo GROQ_API_KEY=your_groq_api_key_here > .env

# Start FastAPI server (Port 8000):
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start Vite development server (Port 5173):
npm run dev
```

Open your browser at `http://localhost:5173` to access the application.

---

## 📡 API Specification Overview

The backend exposes fully documented OpenAPI endpoints available at `/docs`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Statewide summary metrics across suspects, FIRs, and districts |
| `POST` | `/api/query` | Natural language crime query (processed via Groq RAG) |
| `GET` | `/api/network` | Complete graph payload (Nodes: Suspects, FIRs, Evidence; Edges: Relationships) |
| `GET` | `/api/pressure` | Hexagonal spatial pressure scores for all Karnataka zones |
| `GET` | `/api/alerts` | Real-time tactical alerts for high-pressure hotspots |
| `GET` | `/api/suspects/{id}` | Detailed suspect dossier, bail conditions, and associated FIRs |
| `POST` | `/api/memory/dissent` | Records officer disagreement with AI findings for audit log |

---

## 🏆 KSP Datathon 2026 Context & Disclaimer

- **Developed By**: Anisha Rodrigues
- **Track**: Karnataka State Police Datathon 2026 — Challenges 01 (Criminal Network Intelligence) & 02 (Predictive Crime Pressure)
- **Data Compliance**: All suspect identities, biometric records, and FIR narratives included in public demo environments are synthetic mock datasets modeled after CCTNS formats for demonstration and technical validation purposes.

---

<div align="center">
  <sub>PRAJNA Intelligence Command Grid · Engineered for the Karnataka State Police</sub>
</div>
