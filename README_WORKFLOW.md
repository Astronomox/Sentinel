# SENTINEL — System Workflow Document
**Architecture · Data Flow · API Integration · Component Map · Claude Code Virtual Hackathon 2026**

> **Version:** v2.0 — Next.js Edition &nbsp;|&nbsp; **Date:** April 2026 &nbsp;|&nbsp; **Classification:** CONFIDENTIAL

---

## 1. Architecture Overview

SENTINEL is a Next.js 14 App Router application. The frontend is a single-page dashboard composed of typed React components. All AI calls are proxied through Next.js API routes — the Anthropic API key never touches the client. The operator supplies the dataset; no backend storage exists.

| Layer | Responsibility |
|---|---|
| Presentation | React components — dashboard layout, panels, modals, animations |
| Routing | Next.js App Router — `app/page.tsx` (dashboard) + `app/api/*` (Claude proxy) |
| State | React `useState` + Context (`lib/store.ts`) — threats, alerts, stats, selectedThreat |
| AI Proxy | `app/api/analyze/route.ts` + `app/api/report/route.ts` — server-side Claude calls |
| Data | `lib/threats.ts` — mock dataset + Threat type helpers |
| Styling | Tailwind CSS + `globals.css` (CSS variables, animations, scanline overlay) |

---

## 2. Project Structure

```
sentinel/
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, providers
│   ├── page.tsx                # Main dashboard — composes all panels
│   ├── globals.css             # CSS vars, animations, scanlines, scrollbars
│   └── api/
│       ├── analyze/route.ts    # POST — Claude threat analysis
│       └── report/route.ts     # POST — Claude full intelligence report
├── components/
│   ├── Header.tsx              # Logo, status pills, live clock, dataset loader
│   ├── ThreatTicker.tsx        # Scrolling marquee threat banner
│   ├── StatCards.tsx           # 5-card severity counter row
│   ├── ThreatFeed.tsx          # Left panel — live scrollable threat list
│   ├── AttackMap.tsx           # Animated geographic ping-dot map
│   ├── AnalysisPanel.tsx       # Claude AI output with typewriter effect
│   ├── ActionBar.tsx           # Analyze / Alert / Report buttons
│   ├── AlertLog.tsx            # Right panel — session alert history
│   ├── ReportModal.tsx         # Full-screen report overlay + export
│   └── Toast.tsx               # Dispatch confirmation notification
├── lib/
│   ├── threats.ts              # Threat types, mock data, severity helpers
│   └── store.ts                # App-wide React Context + state
├── types/
│   └── index.ts                # Shared TypeScript interfaces
└── public/
    └── sample-dataset.json     # Example operator dataset
```

---

## 3. Data Flows

### 3.1 App Initialisation
1. Next.js renders `app/layout.tsx` — injects fonts, wraps app in Context provider
2. `app/page.tsx` mounts — reads dataset from Context (mock data by default)
3. `ThreatFeed` picks 10 random threats from dataset and renders them
4. `StatCards` initialise counts from dataset severity distribution
5. `setInterval(6000)` starts — live feed loop begins

### 3.2 Live Feed Loop
1. Every 6 seconds: pick random `Threat` from dataset
2. Assign new `uuid` and current ISO timestamp to the threat
3. Prepend to threats array in Context state
4. Cap threats array at 20 items — splice oldest if needed
5. Increment matching severity counter in `Stats` state
6. `ThreatFeed` re-renders — new card slides in with CSS animation

### 3.3 Claude Threat Analysis
1. User clicks a `ThreatFeed` item OR clicks ANALYZE NOW in `ActionBar`
2. `selectedThreat` set in Context state
3. `AnalysisPanel` fires `POST /api/analyze` with `{ threat: Threat }`
4. `app/api/analyze/route.ts` calls Anthropic SDK — server side, API key secure
5. Claude returns analysis text (< 180 words, plain text, no markdown)
6. `AnalysisPanel` renders text character-by-character — typewriter effect
7. Any subsequent selection cancels pending render and starts fresh

### 3.4 Alert Dispatch
1. User clicks SEND ALERT in `ActionBar`
2. Active `selectedThreat` (or latest feed item if none selected) captured
3. New `Alert` object created: `{ id, threat, dispatchedAt: ISO timestamp }`
4. Alert prepended to alerts array in Context state
5. `AlertLog` re-renders — new card flashes red (CSS animation, 3 iterations)
6. `Toast` component shows for 3.5 seconds then auto-dismisses
7. Alert counter badge in `AlertLog` panel header increments

### 3.5 Report Generation
1. User clicks FULL REPORT in `ActionBar`
2. `ReportModal` opens — loading state visible
3. `POST /api/report` fired with `{ stats: Stats }` — current session counts
4. `app/api/report/route.ts` calls Anthropic SDK — structured report prompt
5. Claude returns 7-section report (< 300 words, CAPS headers, plain text)
6. Report rendered in modal body with `white-space: pre-wrap`
7. EXPORT button: creates `Blob`, triggers download as `sentinel-report-{timestamp}.txt`

### 3.6 Dataset Ingestion
1. User clicks LOAD DATASET in `Header`
2. Hidden `<input type="file" accept=".json">` programmatically clicked
3. User selects `.json` file — `FileReader` reads contents
4. JSON parsed — each object validated for `{ name, sev, sources[] }`
5. Valid dataset replaces mock data in Context state
6. `StatCards` and `ThreatFeed` re-render from new dataset
7. Toast: `DATASET LOADED — {n} THREATS INGESTED`
8. Invalid file: error toast displayed, mock data preserved

---

## 4. API Route Specifications

### 4.1 POST /api/analyze

| Field | Detail |
|---|---|
| Method | `POST` |
| Request body | `{ threat: Threat }` |
| Response | `{ analysis: string }` |
| Model | `claude-sonnet-4-20250514` |
| Max tokens | `600` |
| Auth | `process.env.ANTHROPIC_API_KEY` — server-side only |
| Error handling | Returns `{ error: string }` with HTTP 500 on failure |

**System prompt:**
```
You are SENTINEL, an elite cybersecurity AI threat analyst. Analyze threats 
with precision, authority, and technical depth. Respond in short punchy 
paragraphs. Use technical terminology. Format: start with a threat 
classification line, then analysis, then recommended actions. Keep it under 
180 words. No markdown — plain text only.
```

**User message:**
```
Analyze this threat: {name} | Severity: {SEV} | Source: {source} | Detected: {ISO timestamp}
```

### 4.2 POST /api/report

| Field | Detail |
|---|---|
| Method | `POST` |
| Request body | `{ stats: Stats }` |
| Response | `{ report: string }` |
| Model | `claude-sonnet-4-20250514` |
| Max tokens | `1000` |
| Auth | `process.env.ANTHROPIC_API_KEY` — server-side only |
| Error handling | Returns `{ error: string }` with HTTP 500 on failure |

**System prompt:**
```
You are SENTINEL, a military-grade cybersecurity AI. Generate a formal 
structured threat intelligence report. Use plain text with section headers 
in CAPS followed by colons. Include: EXECUTIVE SUMMARY, THREAT LANDSCAPE, 
TOP THREATS DETECTED, ATTACK VECTORS, RISK ASSESSMENT, RECOMMENDED ACTIONS, 
INCIDENT RESPONSE PRIORITY. Be technical, precise, authoritative. Under 300 words.
```

**User message:**
```
Generate a full threat intelligence report. Stats: {critical} critical, 
{high} high, {medium} medium, {low} low. Timestamp: {ISO timestamp}
```

### 4.3 Dataset JSON Schema

```json
{
  "name": "Ransomware Deployment",
  "sev": "critical",
  "sources": ["192.168.1.1", "10.0.0.5"]
}
```

- **Valid `sev` values:** `critical | high | medium | low`
- **`sources`:** non-empty string array — IPs, hostnames, CVE IDs, or descriptive labels

---

## 5. Component Reference

| Component | Panel | Responsibility |
|---|---|---|
| `Header.tsx` | Top | Branding, live clock, status pills, dataset file loader |
| `ThreatTicker.tsx` | Sub-header | Scrolling marquee of active threat names |
| `StatCards.tsx` | Full width | 5 severity counter cards with delta indicators |
| `ThreatFeed.tsx` | Left (280px) | Live feed of classified threat cards — clickable |
| `AttackMap.tsx` | Centre top | CSS map with animated attack-origin ping dots |
| `AnalysisPanel.tsx` | Centre mid | Claude AI output with typewriter render + loading state |
| `ActionBar.tsx` | Centre bottom | Analyze / Alert / Report CTA buttons |
| `AlertLog.tsx` | Right (300px) | Session-scoped dispatched alert history |
| `ReportModal.tsx` | Overlay | Full-screen Claude report + `.txt` export |
| `Toast.tsx` | Fixed top-right | Auto-dismissing confirmation notification |

---

## 6. Design System

### 6.1 CSS Variables (`globals.css`)

| Variable | Value | Usage |
|---|---|---|
| `--bg` | `#030508` | Page background |
| `--bg2` | `#080d12` | Panel backgrounds |
| `--bg3` | `#0d1520` | Nested elements |
| `--border` | `#0f2a3f` | Panel dividers |
| `--accent` | `#00f0ff` | Primary cyan — logo, highlights |
| `--accent2` | `#ff3c3c` | Signal red — critical threats |
| `--accent3` | `#f0a500` | Amber — high severity |
| `--green` | `#00ff88` | Low severity, active states |
| `--text` | `#c8dde8` | Primary text |
| `--text-dim` | `#4a6a7a` | Secondary / muted text |

### 6.2 Key Animations

| Animation | Effect |
|---|---|
| `pulse-ring` | Logo border glow pulse — 2s infinite |
| `scroll-ticker` | ThreatTicker horizontal marquee — 30s linear infinite |
| `slide-in` | New threat card entry from left — 0.4s ease |
| `alert-in` | New alert card entry from right — 0.5s ease |
| `flash-alert` | Red flash on new alert card — 1s ease, 3 iterations |
| `ping` | Attack map dot expand-and-fade — 1.5s infinite |
| `blink` | Status dot and cursor blink — 0.8–1.5s infinite |
| `dot-pulse` | Loading indicator dots — 1.4s staggered |

---

## 7. Error Handling

| Scenario | Handling |
|---|---|
| Claude API failure (analyze) | Error message displayed in `AnalysisPanel` — no crash |
| Claude API failure (report) | Error message displayed in `ReportModal` body |
| Invalid dataset JSON | Error toast displayed — mock data preserved, no crash |
| Missing dataset file | Silent fallback to mock threat library in `lib/threats.ts` |
| Network timeout | API route catch block returns HTTP 500 + error string to client |
| `ANTHROPIC_API_KEY` missing | API route throws — error surfaced in UI panel |
