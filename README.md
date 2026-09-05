# TripRescue

### Explainable travel disruption recovery engine for multi-leg itineraries.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=20232a)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&labelColor=20232a)
![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white&labelColor=20232a)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white&labelColor=20232a)
![SQLite](https://img.shields.io/badge/SQLite-SQLAlchemy-003B57?logo=sqlite&logoColor=white&labelColor=20232a)

TripRescue is an explainable travel disruption recovery engine that models multi-leg itineraries as dependency graphs. When one booking is disrupted, TripRescue propagates the impact across connected bookings, explains exactly what breaks and why, generates feasible recovery plans, ranks them according to traveler priorities, and re-validates the itinerary after recovery.

---

## 📑 Table of Contents
1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution](#3-solution)
4. [Core Innovation](#4-core-innovation)
5. [How TripRescue Works](#5-how-triprescue-works)
6. [Dependency Graph Engine](#6-dependency-graph-engine)
7. [Disruption Propagation](#7-disruption-propagation)
8. [Impact Analysis](#8-impact-analysis)
9. [Recovery Generation](#9-recovery-generation)
10. [Recovery Ranking](#10-recovery-ranking)
11. [Traveler Preferences](#11-traveler-preferences)
12. [Recovery Application](#12-recovery-application)
13. [Re-validation](#13-re-validation)
14. [Risk Intelligence](#14-risk-intelligence)
15. [Financial / Refund Analysis](#15-financial--refund-analysis)
16. [AI Assistant](#16-ai-assistant)
17. [Activity Log](#17-activity-log)
18. [Notifications](#18-notifications)
19. [Demo Mode](#19-demo-mode)
20. [Authentication](#20-authentication)
21. [Technical Architecture](#21-technical-architecture)
22. [Backend Processing Pipeline](#22-backend-processing-pipeline)
23. [Technology Stack](#23-technology-stack)
24. [Testing & Quality Assurance](#24-testing--quality-assurance)
25. [Product Screenshots](#25-product-screenshots)
26. [Live Demo](#26-live-demo)
27. [Deployment](#27-deployment)
28. [Current Limitations](#28-current-limitations)
29. [Future Roadmap](#29-future-roadmap)
30. [Project Structure](#30-project-structure)
31. [How to Run Locally](#31-how-to-run-locally)
32. [Team / Author](#32-team--author)

---

## 1. Overview
TripRescue is an intelligent, explainable travel disruption recovery platform. Rather than viewing an itinerary as an isolated checklist of tickets, TripRescue models the entire trip as a directed dependency graph. When a disruption occurs (such as a flight delay or cancellation), the system traces the cascade of downstream impacts, evaluates timing constraints and minimum connection buffers, classifies node health, generates multi-booking recovery candidates, ranks options based on traveler preferences, and re-validates the graph upon resolution.

## 2. Problem Statement
Travel disruptions are rarely isolated. A 90-minute delay on an inbound flight frequently causes:
$$\text{Flight Delay} \longrightarrow \text{Missed Airport Transfer} \longrightarrow \text{Hotel Check-in Conflict} \longrightarrow \text{Missed Excursion} \longrightarrow \text{Return Flight Risk}$$

Existing travel applications notify travelers of delay alerts in silos. The traveler is left to manually calculate connection buffers, determine which downstream reservations are in jeopardy, check conflicting cancellation policies, search alternative flights/hotels/transfers, and piece together a coherent recovery plan under immense stress.

## 3. Solution
TripRescue automates this entire cognitive loop:
```
Disruption Trigger → Dependency Graph → Impact Propagation → Severity Classification
   → Recovery Candidate Generation → Preference-Based Ranking → Plan Selection → Graph Re-validation
```
Every action is deterministic, transparent, and explainable, providing travelers with clear diagnostic reasoning ("required buffer is 60 min, remaining buffer is -30 min") alongside actionable recovery packages.

## 4. Core Innovation
1. **Explainable Cascade Reasoning**: Clear mathematical diagnostic reasons for every affected booking rather than arbitrary warning flags.
2. **Granular Severity Classification**: Precise status per node (`healthy`, `at_risk`, `broken`, `recovered`) derived from real buffer calculations.
3. **Multi-Booking Coordinated Recovery**: Recovery plans address the entire downstream chain in a unified package (e.g., flight + hotel + transfer).
4. **Real-Time Preference-Weighted Ranking**: Multi-dimensional scoring (speed, cost, disruption, comfort, risk) adjusted dynamically via traveler preference sliders.
5. **Transparent Scoring Breakdown**: Full visibility into candidate scoring components.
6. **Full Graph Re-Validation**: Post-recovery graph re-propagation proves that the selected plan produces a conflict-free itinerary.
7. **Sequential Re-Disruption Support**: Trips maintain canonical state; recovered itineraries can experience further independent disruptions.
8. **AI Assistant with Deterministic Fallback**: Grounded in live graph state with an integrated fallback when LLM keys are absent.

## 5. How TripRescue Works
1. **Model**: The itinerary is ingested and structured into nodes (flights, transfers, stays, activities) connected by temporal and location dependency edges.
2. **Detect & Propagate**: A disruption event triggers downstream topological traversal, recomputing arrival times and connection buffers.
3. **Diagnose**: Nodes are tagged with precise severity and human-readable explanations.
4. **Generate & Rank**: Candidate recovery options are assembled from provider adapters, filtered for temporal feasibility, and ranked.
5. **Execute & Re-validate**: Applying a recovery modifies the graph state and immediately re-evaluates all constraints to verify trip health.

## 6. Dependency Graph Engine
The backend graph engine builds a directed acyclic graph (DAG) representing bookings as nodes and dependencies as edges:
- **Temporal Edges**: Ensures end time of node $A$ precedes start time of node $B$ with required buffer $\Delta t$.
- **Location Edges**: Ensures arrival location of node $A$ matches departure location of node $B$.
- **Buffer Rules**: Strict buffer thresholds based on connection type (e.g., 60 min for domestic flights, 120 min for international, 45 min for ground transfers).

## 7. Disruption Propagation
When a disruption occurs on node $N_i$:
- The engine updates arrival time $T_{arr}(N_i) = T_{arr}^{orig}(N_i) + \text{delay}$.
- It traverses outgoing edges in topological order.
- For each downstream node $N_j$, available buffer is calculated: $\text{Buffer}_{avail} = T_{dep}(N_j) - T_{arr}(N_i)$.
- If $\text{Buffer}_{avail} < 0$, node $N_j$ is classified as `broken`.
- If $0 \le \text{Buffer}_{avail} < \text{Buffer}_{req}$, node $N_j$ is classified as `at_risk`.

## 8. Impact Analysis
The impact analysis module summarizes:
- Total downstream bookings affected.
- Direct root cause and cascading failure chain.
- Financial value of broken vs. at-risk bookings.
- Time lost or schedule shifts.

## 9. Recovery Generation
The recovery engine queries provider adapters to find viable alternatives:
- **Direct Rebooking**: Finding earlier/later flights or alternative carriers.
- **Rescheduling**: Adjusting transfer and activity times to accommodate delays.
- **Node Replacement**: Substituting unviable activities or hotels with available alternatives.
- **Chain Bundling**: Generating composite recovery packages that resolve all broken nodes simultaneously.

## 10. Recovery Ranking
Recovery options are scored using a normalized multi-objective function:
$$\text{Score} = w_{\text{cost}} \cdot S_{\text{cost}} + w_{\text{speed}} \cdot S_{\text{speed}} + w_{\text{preservation}} \cdot S_{\text{preservation}} + w_{\text{comfort}} \cdot S_{\text{comfort}} + w_{\text{risk}} \cdot S_{\text{risk}}$$
Every candidate presents its full breakdown so the traveler understands the trade-offs.

## 11. Traveler Preferences
Travelers can interactively adjust priority sliders:
- **Cost vs. Speed**: Prioritize cheapest solutions vs. earliest arrival.
- **Disruption vs. Comfort**: Prioritize preserving original bookings vs. upgrading convenience.
Weights are re-applied instantly to re-rank all available recovery plans.

## 12. Recovery Application
Applying a selected recovery plan:
- Atomically updates canonical booking records.
- Replaces broken nodes with recovered nodes.
- Updates edge constraints and schedules.
- Records activity history and dispatches notifications.

## 13. Re-validation
Following recovery application, the graph engine re-runs full impact propagation from scratch:
- Validates that zero `broken` nodes remain.
- Recalculates all connection buffers.
- Updates trip health status to `recovered` / `healthy`.

## 14. Risk Intelligence
TripRescue features a proactive risk engine that monitors:
- Weather vulnerability at transit hubs.
- Historical buffer tight-spots.
- Tight connections with high cascade potential.
- Provides actionable mitigation advice before disruptions occur.

## 15. Financial / Refund Analysis
The refund engine evaluates:
- Cancellation policies (non-refundable, partially refundable, flexible).
- Potential out-of-pocket recovery costs.
- Net refund eligibility across affected bookings.
- Total recovered value vs. disruption loss.

## 16. AI Assistant
An integrated AI Copilot provides contextual explanations and recommendations:
- Grounded directly in live trip, disruption, and recovery state.
- Capable of answering questions like "Why did my transfer break?" and "What is the fastest recovery?".
- Includes a robust deterministic rule-based fallback when external LLM API keys are not configured.

## 17. Activity Log
Maintains an immutable timeline of all itinerary events:
- Disruption triggers and delay detections.
- Impact calculations.
- Recovery option evaluations and user selections.
- Re-validation confirmations.

## 18. Notifications
Centralized in-app notification center that alerts travelers to:
- Disruption severity alerts.
- Recommended recovery plans.
- Successful re-validation confirmations.
- Schedule adjustments.

## 19. Demo Mode
TripRescue includes interactive hero scenarios (e.g., London to Tokyo multi-leg journey):
- One-click disruption simulation (e.g., 90-minute flight delay).
- Guided walkthrough demonstrating cascade propagation, impact analysis, recovery ranking, and re-validation.
- Deterministic simulation mode for rapid testing.

## 20. Authentication
- Lightweight session token authentication with HMAC signing.
- One-click demo traveler login ("Continue as Aisha Khan") for instant access.
- Role-based isolation for traveler itineraries.

## 21. Technical Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     React 18 Frontend                       │
│  (TypeScript, Vite, Tailwind CSS, Lucide Icons, React Flow) │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (JSON / HTTP)
┌──────────────────────────────▼──────────────────────────────┐
│                     FastAPI Backend                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     Engine Layer                      │  │
│  │  • Graph Engine        • Propagation & Impact Engine  │  │
│  │  • Recovery Engine     • Scoring & Ranking Engine     │  │
│  │  • Risk Engine         • Financial & Refund Engine    │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Services Layer                     │  │
│  │  • Trip Service        • Disruption Service           │  │
│  │  • Recovery Service    • Assistant Service            │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Database Layer                      │  │
│  │  • SQLite with SQLAlchemy ORM Models                  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Provider Adapters                   │  │
│  │  • Mock Flight, Hotel, Transfer, Activity Providers  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 22. Backend Processing Pipeline
1. Receive disruption payload (booking ID, delay minutes, reason).
2. Load canonical trip and itinerary graph.
3. Identify affected node and propagate temporal delay.
4. Recalculate timing buffers on all downstream edges.
5. Classify booking states (`healthy`, `at_risk`, `broken`).
6. Query provider adapters for replacement candidates.
7. Validate candidate feasibility against remaining trip constraints.
8. Score candidates across multi-objective metrics.
9. Apply traveler preference weights and rank options.
10. Apply selected recovery plan and update canonical state.
11. Re-run propagation engine to verify complete resolution.
12. Recalculate health, risk, and financial totals.
13. Persist activity log and dispatch notifications.
14. Return updated trip state to frontend.

## 23. Technology Stack
- **Frontend**: React 18, TypeScript 5, Vite, Tailwind CSS, React Flow, Lucide Icons.
- **Backend**: Python 3.14 / 3.12, FastAPI 0.115, Pydantic v2, Uvicorn.
- **Database**: SQLite with SQLAlchemy ORM.
- **Testing**: Pytest (backend), Vitest + React Testing Library (frontend).
- **Deployment**: GitHub Pages (frontend), Render (backend).

## 24. Testing & Quality Assurance
The codebase is thoroughly verified with comprehensive test suites:

| Suite | Status | Details |
| :--- | :--- | :--- |
| **Backend Unit & Engine Tests** | **67 / 67 PASS** | Graph, propagation, recovery, scoring, refund, risk, API routes |
| **Frontend Unit & Component Tests** | **44 / 44 PASS** | State management, graph layout, score rings, badges, context |
| **TypeScript Validation** | **0 Errors** | Strict type-checking clean |
| **Linting** | **0 Errors** | Clean ESLint compliance |
| **Production Build** | **SUCCESS** | Vite production bundle compiled |
| **Browser E2E Flow** | **22 / 22 PASS** | Full user journey tested |
| **Console & Network Errors** | **0 Errors** | Clean runtime execution |

```powershell
# Run backend tests
cd backend && .\.venv\Scripts\python.exe -m pytest app/tests/ -q

# Run frontend tests & validation
npm run typecheck && npm run lint && npm test && npm run build
```

## 25. Product Screenshots

### 1. Command Center & Overview
![TripRescue Command Center](docs/screenshots/01-command-center.png)

### 2. Dependency Graph Visualization
![TripRescue Dependency Graph](docs/screenshots/02-trip-graph.png)

### 3. Impact Analysis & Cascade Reasoning
![TripRescue Impact Analysis](docs/screenshots/03-impact-analysis.png)

### 4. Ranked Recovery Options
![TripRescue Recovery Options](docs/screenshots/04-recovery-options.png)

### 5. Before & After Itinerary Comparison
![TripRescue Before After](docs/screenshots/05-before-after.png)

### 6. Risk Intelligence & Proactive Insights
![TripRescue Risk Intelligence](docs/screenshots/06-risk-ai.png)

## 26. Live Demo
- **Frontend Web App**: [https://daanialmirza5.github.io/triprescue/](https://daanialmirza5.github.io/triprescue/)
- **Backend API**: [https://triprescue-kw9d.onrender.com](https://triprescue-kw9d.onrender.com)
- **API Health Endpoint**: [https://triprescue-kw9d.onrender.com/api/v1/health](https://triprescue-kw9d.onrender.com/api/v1/health)

## 27. Deployment
- **Frontend**: Hosted on GitHub Pages as a static SPA bundle.
- **Backend**: Hosted on Render with FastAPI and SQLite.
- **Environment**: Configured via `.env.example` templates with automatic mock fallback.

## 28. Current Limitations
- **Disruption Ingestion**: Disruption events are currently triggered manually or simulated via Demo Mode (deterministic scenarios). Direct live flight radar / GDS webhook feeds are planned for future phases.
- **Provider Layer**: Provider queries use realistic mock adapters with simulated availability rather than live commercial airline/hotel booking APIs.
- **Payments**: Financial engine calculates refund eligibility and cost deltas; live credit card payment processing is out of scope.
- **Free-Tier Backend Hosting**: Render's free tier spins down on idle; initial cold-start requests may take up to 60 seconds.

## 29. Future Roadmap
- Direct GDS / NDC airline API integrations (Amadeus, Sabre).
- Real-time flight tracking telemetry and weather radar webhooks.
- Multi-passenger group recovery coordination with diverging preference profiles.
- Native mobile companion application (iOS / Android).
- Automated automated claim filing for delay compensation (EU261 / DOT).

## 30. Project Structure
```
TripRescue/
├── .env.example                # Root environment template
├── .gitignore                  # Git ignore definitions
├── README.md                   # Comprehensive project documentation
├── eslint.config.js            # ESLint configuration
├── index.html                  # Frontend entry HTML
├── package.json                # Frontend package dependencies
├── package-lock.json           # NPM dependency lockfile
├── pnpm-lock.yaml              # PNPM dependency lockfile
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS styling config
├── tsconfig.json               # TypeScript base configuration
├── tsconfig.app.json           # TypeScript application config
├── tsconfig.node.json          # TypeScript Node config
├── vite.config.ts              # Vite bundler configuration
│
├── backend/                    # FastAPI Backend Application
│   ├── .env.example            # Backend environment template
│   ├── pytest.ini              # Pytest test configuration
│   ├── requirements.txt        # Python package dependencies
│   └── app/
│       ├── __init__.py
│       ├── config.py           # Application settings & environment loader
│       ├── main.py             # FastAPI entrypoint & router registration
│       ├── api/                # API route handlers (trips, disruptions, recovery, auth)
│       ├── database/           # SQLite database engine, session, and seed data
│       ├── engines/            # Core algorithmic engines (graph, propagation, recovery, scoring, refund, risk)
│       ├── models/             # SQLAlchemy ORM database models
│       ├── providers/          # Flight, hotel, transfer, and activity provider adapters
│       ├── repositories/       # Data access repositories
│       ├── schemas/            # Pydantic request/response schemas
│       ├── services/           # Business logic service layer
│       └── tests/              # Pytest backend test suite (67 tests)
│
├── docs/                       # Project Documentation & Architecture
│   ├── ALGORITHM_SPEC.md       # Detailed algorithm specifications
│   ├── API_PIPELINE.md         # API request/response pipeline guide
│   ├── API_SPEC.md             # REST API endpoint documentation
│   ├── ARCHITECTURE.md         # Full system architecture
│   ├── BACKEND_PIPELINE.md     # Step-by-step backend processing walkthrough
│   ├── DATA_MODEL.md           # Database entities and relationships
│   ├── DEMO_GUIDE.md           # Interactive demo script and instructions
│   ├── DEMO_SCRIPT.md          # Presentation walkthrough script
│   ├── DEPLOYMENT.md           # Local and cloud deployment instructions
│   ├── ENGINE_DEPENDENCY_MAP.md# Engine interactions and data flow map
│   ├── FUTURE_ROADMAP.md       # Long-term feature roadmap
│   ├── PRD.md                  # Product Requirements Document
│   ├── PROJECT_SUMMARY.md      # Executive summary and architectural highlights
│   ├── TESTING.md              # Test execution guide and suite inventory
│   ├── TRD.md                  # Technical Requirements Document
│   └── screenshots/            # UI screenshots for README and documentation
│
├── scripts/
│   └── dev-all.ps1             # Local development startup script
│
└── src/                        # React Frontend Application
    ├── App.tsx                 # Main application root with routing
    ├── index.css               # Global styling and Tailwind directives
    ├── main.tsx                # Frontend DOM entrypoint
    ├── vite-env.d.ts           # Vite TypeScript definitions
    ├── assets/                 # Static visual assets
    ├── components/             # React components (graph, recovery, disruption, ai, ui, shell, landing)
    ├── data/                   # Mock and fallback itinerary data
    ├── lib/                    # Graph layout algorithms, utilities, and helper functions
    ├── pages/                  # Top-level view pages (Overview, LiveMonitor, MapView, Trips, etc.)
    ├── services/               # Frontend API client service
    ├── store/                  # Application and Auth React Context state stores
    ├── test/                   # Frontend unit test suite (44 tests)
    └── types/                  # Shared TypeScript interfaces and type definitions
```

## 31. How to Run Locally

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+

### 1. Start Backend
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```
Backend will be available at `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).

### 2. Start Frontend
```powershell
# In a separate terminal
npm install
copy .env.example .env.local
npm run dev
```
Frontend will be available at `http://localhost:5173`. Click **"Continue as Demo Traveler (Aisha Khan)"** to access the dashboard.

## 32. Team / Author
- **Author**: daanialmirza5
- **Contact**: daanialmirza@gmail.com
- **Project**: TripRescue — HackCelestial Final Release
