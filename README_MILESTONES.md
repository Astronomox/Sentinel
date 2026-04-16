# SENTINEL — Progress & Milestone Tracker
**Sprint Plan · Deliverables · Completion Status · Claude Code Virtual Hackathon 2026**

> **Version:** v2.0 — Next.js Edition &nbsp;|&nbsp; **Date:** April 2026 &nbsp;|&nbsp; **Classification:** CONFIDENTIAL

---

## 1. Project Overview

| Field | Detail |
|---|---|
| Build Window | 7 Days — Claude Code Virtual Hackathon 2026 |
| Framework | Next.js 14 · TypeScript · Tailwind CSS |
| AI Engine | Anthropic Claude API — `claude-sonnet-4-20250514` |
| Approach | Iterative daily sprints — one major deliverable per day minimum |
| Submission | Day 7 — full package: app + docs + demo script |

---

## 2. Sprint Timeline

| Day | Sprint | Focus | Status | Owner |
|---|---|---|---|---|
| 1 | Scaffolding | Next.js init, TypeScript config, Tailwind, folder structure, CSS vars, mock data | ✅ Done | You |
| 2 | Dashboard Shell | Layout, Header, ThreatTicker, StatCards, 3-column grid, all panels | ✅ Done | You |
| 3 | AI Engine | API routes, Claude integration, AnalysisPanel, typewriter effect, ActionBar | 🔄 Active | You |
| 4 | Dataset + Alerts | Dataset ingestion, schema validation, AlertLog, Toast, alert dispatch | ⬜ Pending | You |
| 5 | Reports + Map | ReportModal, export, AttackMap animations, full polish pass | ⬜ Pending | You |
| 6 | QA + Hardening | Error states, edge cases, TypeScript strictness, cross-browser, perf | ⬜ Pending | You |
| 7 | Submission | Demo script, README.md, final build, submission package | ⬜ Pending | You |

---

## 3. Milestone Breakdown

### MILESTONE 1 — Project Scaffolding (Day 1)

| Deliverable | Priority | Status |
|---|---|---|
| `npx create-next-app` with TypeScript, strict mode enabled | P0 | ✅ Complete |
| Tailwind CSS configured with custom theme extension | P0 | ✅ Complete |
| `globals.css` — all CSS variables and base animations defined | P0 | ✅ Complete |
| `types/index.ts` — Severity, Threat, Alert, Stats interfaces | P0 | ✅ Complete |
| `lib/threats.ts` — mock dataset (15+ threats) and helpers | P0 | ✅ Complete |
| `lib/store.ts` — React Context with useState for all app state | P0 | ✅ Complete |
| `public/sample-dataset.json` — example operator dataset | P1 | ✅ Complete |
| `.env.local` with `ANTHROPIC_API_KEY` placeholder | P0 | ✅ Complete |

### MILESTONE 2 — Dashboard Shell (Day 2)

| Deliverable | Priority | Status |
|---|---|---|
| `app/layout.tsx` — `next/font` Orbitron, Rajdhani, Share Tech Mono | P0 | ✅ Complete |
| `Header.tsx` — logo, pulse ring animation, status pills, live clock | P0 | ✅ Complete |
| `ThreatTicker.tsx` — scrolling marquee threat banner | P0 | ✅ Complete |
| `StatCards.tsx` — 5 severity cards with top accent bars | P0 | ✅ Complete |
| 3-column grid layout (280px / flex / 300px) | P0 | ✅ Complete |
| `ThreatFeed.tsx` — 10 threats on mount, slide-in animation | P0 | ✅ Complete |
| Scanline overlay and CSS grid background in `globals.css` | P1 | ✅ Complete |
| All panel headers with Orbitron font and badge indicators | P1 | ✅ Complete |

### MILESTONE 3 — Claude AI Engine (Day 3)

| Deliverable | Priority | Status |
|---|---|---|
| `app/api/analyze/route.ts` — POST endpoint, Anthropic SDK | P0 | 🔄 In Progress |
| `app/api/report/route.ts` — POST endpoint, report system prompt | P0 | 🔄 In Progress |
| `AnalysisPanel.tsx` — loading dots, typewriter effect, error state | P0 | 🔄 In Progress |
| `ActionBar.tsx` — Analyze, Alert, Report buttons with hover glow | P0 | 🔄 In Progress |
| `selectedThreat` wired: click ThreatFeed item → fires analyze call | P0 | ⬜ Pending |
| ANALYZE NOW button fires analyze on active/last threat | P1 | ⬜ Pending |
| API error surfaces to panel — no console-only failures | P1 | ⬜ Pending |

### MILESTONE 4 — Dataset Ingestion & Alerts (Day 4)

| Deliverable | Priority | Status |
|---|---|---|
| Hidden file input in Header — triggered by LOAD DATASET button | P0 | ⬜ Pending |
| `FileReader` JSON parse + schema validation per threat object | P0 | ⬜ Pending |
| Context state updated on valid load — feed and stats refresh | P0 | ⬜ Pending |
| Success toast: `DATASET LOADED — {n} THREATS INGESTED` | P1 | ⬜ Pending |
| Error toast on invalid schema — mock data preserved | P1 | ⬜ Pending |
| `AlertLog.tsx` — session alert cards with `flash-alert` animation | P0 | ⬜ Pending |
| SEND ALERT handler — creates Alert, prepends to log, fires toast | P0 | ⬜ Pending |
| `Toast.tsx` — auto-dismiss after 3.5s, signal red styling | P1 | ⬜ Pending |

### MILESTONE 5 — Reports, Map & Polish (Day 5)

| Deliverable | Priority | Status |
|---|---|---|
| `ReportModal.tsx` — full-screen overlay, loading state, scroll | P0 | ⬜ Pending |
| FULL REPORT → `POST /api/report` → renders Claude output | P0 | ⬜ Pending |
| EXPORT button — Blob download as `sentinel-report-{timestamp}.txt` | P1 | ⬜ Pending |
| `AttackMap.tsx` — CSS grid map, animated ping dots, severity colours | P0 | ⬜ Pending |
| Live feed `setInterval` wired — auto-prepend every 6s, cap at 20 | P0 | ⬜ Pending |
| Stat counter auto-increment as live feed adds threats | P0 | ⬜ Pending |
| Full visual polish pass — glow shadows, hover states, transitions | P1 | ⬜ Pending |

### MILESTONE 6 — QA & Hardening (Day 6)

| Deliverable | Priority | Status |
|---|---|---|
| `npx tsc --noEmit` — zero TypeScript errors | P0 | ⬜ Pending |
| `npm run build` — clean production build, no warnings | P0 | ⬜ Pending |
| Cross-browser test: Chrome, Firefox, Edge | P0 | ⬜ Pending |
| All error states tested: API down, invalid dataset, no selection | P0 | ⬜ Pending |
| Dataset edge cases: empty array, missing fields, wrong `sev` value | P1 | ⬜ Pending |
| Animation frame rate check — no jank on live feed updates | P1 | ⬜ Pending |
| Responsive check at 1280px, 1440px, 1920px breakpoints | P2 | ⬜ Pending |
| Console clean — zero errors and zero warnings on load | P0 | ⬜ Pending |

### MILESTONE 7 — Submission Package (Day 7)

| Deliverable | Priority | Status |
|---|---|---|
| `README.md` at repo root — setup, env var guide, demo steps | P0 | ⬜ Pending |
| 2-minute demo script written and rehearsed | P0 | ⬜ Pending |
| All three documentation files committed to repo | P0 | ✅ Complete |
| Final `npm run build` passes cleanly | P0 | ⬜ Pending |
| Deployed to Vercel with `ANTHROPIC_API_KEY` set in env vars | P1 | ⬜ Pending |
| Submission form completed with repo URL + live demo link | P0 | ⬜ Pending |

---

## 4. Reference Legends

### Priority

| Level | Definition |
|---|---|
| P0 | Must ship — product is non-functional or fails judging without it |
| P1 | Should ship — meaningfully impacts quality, polish, or demo impact |
| P2 | Nice to have — delight and refinement layer |

### Status

| Symbol | Meaning |
|---|---|
| ✅ Complete | Delivered, committed, and verified working |
| 🔄 In Progress | Currently being built in this sprint |
| ⬜ Pending | Not yet started — scheduled for a future sprint |
| ⚠ Blocked | Waiting on a dependency, decision, or external factor |
