# Sarthi-Ai

## Project Title
**Sarthi-Ai** — An AI-powered finance assistant platform with a modern web UI.

---

## Team Members
- Sumit Gaikwad 
- Swapnil Hingne 
- Arbaj Pathan
- Prerana Satpute
---

## Problem Statement
Personal loan applications have an alarmingly high drop-off rate — typically 60–80% of users abandon mid-funnel. The primary causes are:

- Lack of pre-qualification visibility: Applicants don't know whether they qualify before submitting.
- Complex jargon: Terms like DTI ratio, credit utilisation, and amortisation deter non-finance-savvy users.
- No guided experience: Traditional loan forms provide zero contextual help, leaving users confused.
- Fear of rejection: Users avoid applications if they suspect failure, losing confidence in the institution.

Finance-Saarthi solves this by combining a transparent rule-based scoring engine with a conversational AI assistant — giving users real-time, personalised, jargon-free guidance before they ever submit an application.

---

## Solution Approach
Finance-Saarthi is a full-stack MVP: a React SPA served by an Express backend.

Two core capabilities:

### Eligibility Engine
A deterministic, weighted scoring system that accepts four user inputs and returns a structured decision in milliseconds — with a score, eligibility flag, and recommended loan ceiling. All business logic runs server-side; the frontend is a pure presentation layer.

### AI Financial Assistant
An OpenAI-powered chatbot using gpt-4o-mini with a curated financial system prompt. The assistant maintains per-session conversation history, enabling multi-turn, contextually coherent conversations without a persistent database.

---

## Tech Stack
**Frontend**
- React (vite)
- Tailwind CSS
- Replit Ai
- 

**Backend**
- Node.js + TypeScript
- Express
- Sessions (express-session)

**Tooling**
- Vite
- TypeScript
- tsx (TypeScript execution in dev)

---

## Installation Steps
### Prerequisites
- Node.js (recommended: latest LTS)
- npm

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/SUMITGAIKWAD90/Sarthi-Ai.git
   cd Sarthi-Ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
---

## How to Run
### Run backend (development)
```bash
npm run dev
```

### Run frontend (development)
In another terminal:
```bash
npm run dev:client
```

- Client runs on: `http://localhost:5000` (as configured by the script)
- Server runs as configured in `server/index.ts`

### Production build & start
```bash
npm run build
npm start
```

---

## Features
- Modern responsive UI for interacting with the assistant
- Backend API using Express + TypeScript
- Session-based authentication support (Passport)
- PostgreSQL persistence via Drizzle ORM
- Component-driven UI (Radix UI) with Tailwind styling

---

## Future Scope
- Add role-based authentication (Admin/User)
- Add conversation history, export and sharing
- Integrate more AI models/providers and tool-usage workflows
- Add analytics dashboard for usage insights
- Add Docker support and one-command deployment
- Add tests (unit + integration) and CI pipeline

---

## Repository Structure (High-level)
- `client/` — Frontend (React + Vite)
- `server/` — Backend (Express + TypeScript)
- `shared/` — Shared types/utilities
- `script/` — Build/deployment scripts
- `drizzle.config.ts` — Drizzle ORM configuration

---

## License
MIT (as per `package.json`).