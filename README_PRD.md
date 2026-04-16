# SENTINEL — Product Requirements Document
**Threat Intelligence Platform · Claude Code Virtual Hackathon 2026**

> **Version:** v2.0 — Next.js Edition &nbsp;|&nbsp; **Date:** April 2026 &nbsp;|&nbsp; **Stack:** Next.js 14 · TypeScript · Tailwind CSS &nbsp;|&nbsp; **Classification:** CONFIDENTIAL

---

## 1. Product Overview

SENTINEL is a real-time cybersecurity threat monitoring and intelligence platform built with **Next.js 14** and powered by **Claude AI**. It ingests operator-supplied security event data, classifies threats by severity, performs live AI-powered reasoning, and dispatches structured alerts — with zero authentication overhead. The operator brings the dataset; Claude brings the intelligence.

### 1.1 Problem Statement

Security operations centres are drowning in alert noise. Rule-based SIEM tools produce thousands of low-fidelity signals per day with no contextual reasoning. Analysts burn hours triaging events that could be automatically classified and explained. SENTINEL replaces mechanical alerting with Claude-powered threat intelligence — surfacing what matters, explaining why it matters, and recommending what to do about it.

### 1.2 Strategic Goals

- Deliver a live, auto-updating threat feed classified by severity in real time
- Use Claude AI to reason over threats and produce human-grade intelligence
- Enable one-click alert dispatch with session-scoped history
- Generate full structured threat intelligence reports on demand
- Support operator-supplied JSON dataset ingestion with zero auth
- Ship a production-grade Next.js app suitable for demo, deployment, and judging

### 1.3 Non-Goals for v1

- No user authentication, login screens, or role-based access control
- No persistent database — all state is in-memory, session-scoped
- No mobile-native app — web responsive only
- No third-party SIEM or EDR integration
- No real-time WebSocket data feeds — dataset is operator-loaded

---

## 2. Target Users

| User Type | Role | Primary Need |
|---|---|---|
| Security Analyst | Primary operator | Real-time triage, AI-driven threat analysis |
| SOC Manager | Report consumer | Structured intelligence reports for executive decisions |
| Hackathon Judge | Evaluator | Immediate grasp of Claude's reasoning on live threat data |
| Developer / Builder | Technical contributor | Clean, typed Next.js codebase as a foundation to extend |

---

## 3. Feature Requirements

### 3.1 Live Threat Feed
- Auto-ingests threat events from the operator-supplied JSON dataset on mount
- Displays 10 threats on load; prepends new threats every 6 seconds via `setInterval`
- Feed capped at 20 visible items — oldest items drop off automatically
- Each item shows: severity tag, threat name, source IP/identifier, timestamp
- Severity classification: `CRITICAL · HIGH · MEDIUM · LOW` — colour-coded border
- Clicking any threat sets it as active selection and triggers Claude analysis immediately

### 3.2 Claude AI Analysis Engine
- Powered by Anthropic Claude API via Next.js App Router API route (`POST /api/analyze`)
- Receives selected threat metadata: name, severity, source, ISO timestamp
- SENTINEL analyst system persona — delivers classification, technical analysis, recommended actions
- Response rendered with typewriter character effect in the analysis panel
- Loading state shown with animated dots during API call
- Error state surfaced in UI — no silent failures

### 3.3 Statistics Dashboard
- Five stat cards spanning the full-width top row: Critical, High, Medium, Low, Total
- Counts initialised from dataset on load
- Auto-increments matching counter as new threats arrive in the live feed
- Delta indicator showing directional change from session start

### 3.4 Geographic Attack Map
- Visual map panel with CSS grid overlay — military ops-room aesthetic
- Animated ping dots representing active attack origin sources
- Dot colour maps to severity: red = critical, amber = high, cyan = medium
- Dots positioned pseudo-randomly within map bounds — no real geo data required

### 3.5 Alert Dispatch
- SEND ALERT button captures active/selected threat and logs it to Alert Log panel
- Alert card shows: threat name, severity, dispatch timestamp, auto-response message
- New alert card flashes red on entry — CSS animation, 3 iterations
- Toast notification confirms dispatch — auto-dismisses after 3.5 seconds
- Alert count badge in panel header increments with each dispatch

### 3.6 Full Intelligence Report
- FULL REPORT button triggers `POST /api/report` with current session stats
- Claude generates a structured multi-section report in plain text
- **Sections:** EXECUTIVE SUMMARY · THREAT LANDSCAPE · TOP THREATS DETECTED · ATTACK VECTORS · RISK ASSESSMENT · RECOMMENDED ACTIONS · INCIDENT RESPONSE PRIORITY
- Report renders in full-screen modal overlay with scroll
- EXPORT button downloads report as timestamped `.txt` file

### 3.7 Dataset Ingestion
- Hidden file input triggered by LOAD DATASET button in header
- Accepts `.json` files — parses and validates schema on load
- Required schema per threat: `{ name: string, sev: Severity, sources: string[] }`
- Valid severity values: `critical | high | medium | low`
- Successful load triggers toast: `DATASET LOADED — {n} THREATS INGESTED`
- Invalid schema shows descriptive error toast — no crash
- Falls back to built-in mock threat library silently if no file is loaded

---

## 4. Technical Specifications

### 4.1 Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 — App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + custom CSS variables in `globals.css` |
| AI Engine | Anthropic Claude API via `@anthropic-ai/sdk` — `claude-sonnet-4-20250514` |
| Fonts | `next/font` — Orbitron, Rajdhani, Share Tech Mono (Google Fonts) |
| State | React `useState` + Context (`lib/store.ts`) — no external state library |
| Auth | **None** |
| Database | **None** — in-memory only |
| Deployment | Vercel (recommended) or any Node-capable platform |

### 4.2 Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...   # Required — set in .env.local
```

### 4.3 TypeScript Interfaces

```typescript
type Severity = 'critical' | 'high' | 'medium' | 'low'

interface Threat {
  id: string
  name: string
  sev: Severity
  sources: string[]
  timestamp: string
}

interface Alert {
  id: string
  threat: Threat
  dispatchedAt: string
}

interface Stats {
  critical: number
  high: number
  medium: number
  low: number
  total: number
}
```

---

## 5. Success Metrics

| Metric | Target |
|---|---|
| Claude analysis renders after threat selection | < 3s |
| Threat feed auto-updates without user action | Every 6s |
| Full report generated and visible in modal | < 5s |
| Zero auth steps from first load to full use | 0 steps |
| Judge understands product value from demo | < 60s |
| No TypeScript errors on build | 0 errors |
| No console errors on page load | 0 errors |

---

## 6. Constraints & Assumptions

- `ANTHROPIC_API_KEY` must be set in `.env.local` before running the app
- Internet access required — Claude API calls and Google Fonts are external
- Dataset must conform to the defined JSON schema — no auto-correction
- Session state does not persist across page refreshes
- App is designed for desktop viewport — minimum 1280px width recommended
