# SENTINEL — System Workflow Document
**Architecture, Data Flow & Integration Guide | Claude Hackathon 2026**

> Version: v1.0 | April 2026 | Classification: CONFIDENTIAL

---

## 1. System Architecture Overview

SENTINEL operates as a single-page application. All logic lives in one HTML file. The operator supplies the dataset; Claude handles intelligence. There is no backend server, no database, and no authentication layer.

| Layer | Description |
|---|---|
| Presentation | HTML/CSS dashboard — renders threat feed, map, analysis, alerts |
| Logic | Vanilla JavaScript — state management, API calls, UI updates |
| AI Layer | Claude API (Anthropic) — threat reasoning, report generation |
| Data Layer | Operator dataset (JSON) + in-memory session state |

---

## 2. Data Flow

### 2.1 Dataset Ingestion Flow
1. Operator prepares threat dataset in JSON format
2. Dataset loaded into memory on page initialisation
3. Threat feed populated from dataset — shuffled and displayed
4. Live timer triggers `addLiveThreat()` every 6 seconds
5. New threat drawn from dataset and inserted at top of feed
6. Stat counters auto-increment based on severity

### 2.2 Claude Analysis Flow
1. User selects threat from feed OR clicks ANALYZE NOW
2. Selected threat metadata extracted: `{ name, severity, source, timestamp }`
3. POST request sent to Anthropic API with system prompt + threat context
4. Claude reasons over the threat and returns analysis text
5. Typewriter effect renders text character by character in the analysis panel
6. User can trigger new analysis at any time

### 2.3 Alert Dispatch Flow
1. User clicks SEND ALERT button
2. Active/selected threat captured from session state
3. Alert card created with: threat name, severity, timestamp, auto-response message
4. Card inserted at top of Alert Log panel (right side)
5. Toast notification fires: 3.5 second display
6. Alert counter increments in panel header

### 2.4 Report Generation Flow
1. User clicks FULL REPORT button
2. Modal overlay opens with loading indicator
3. POST sent to Claude API with session threat statistics and context
4. Claude generates multi-section structured intelligence report
5. Report rendered in modal body as plain text with pre-wrap formatting
6. User can export report as `.txt` file with session timestamp

---

## 3. API Integration

### 3.1 Anthropic Claude API

**Endpoint:** `POST https://api.anthropic.com/v1/messages`

| Parameter | Value |
|---|---|
| `model` | `claude-sonnet-4-20250514` |
| `max_tokens` | `1000` |
| `system` | SENTINEL threat analyst persona prompt |
| `messages[0].role` | `user` |
| `messages[0].content` | Threat context: name, severity, source, timestamp |

**Analysis system prompt:**
```
You are SENTINEL, an elite cybersecurity AI threat analyst. Analyze threats 
with precision, authority, and technical depth. Respond in short punchy 
paragraphs. Use technical terminology. Format: start with a threat 
classification line, then analysis, then recommended actions. Keep it under 
180 words. No markdown — plain text only.
```

**Report system prompt:**
```
You are SENTINEL, a military-grade cybersecurity AI. Generate a formal 
structured threat intelligence report. Use plain text with section headers 
in CAPS followed by colons. Include: EXECUTIVE SUMMARY, THREAT LANDSCAPE, 
TOP THREATS DETECTED, ATTACK VECTORS, RISK ASSESSMENT, RECOMMENDED ACTIONS, 
INCIDENT RESPONSE PRIORITY. Be technical, precise, authoritative. Under 300 words.
```

### 3.2 Dataset Schema

Each threat object in the operator dataset must conform to:

```json
{
  "name": "Ransomware Deployment",
  "sev": "critical",
  "sources": ["192.168.1.1", "10.0.0.5"]
}
```

- **Valid severity values:** `critical` | `high` | `medium` | `low`
- **sources:** array of strings — IP addresses, hostnames, CVE IDs, or descriptive labels

---

## 4. UI Component Map

| Component | Location | Function |
|---|---|---|
| Header Bar | Top | System status, live clock, alert indicators |
| Threat Ticker | Below Header | Scrolling live threat summary |
| Stat Cards (x5) | Top Row | Critical / High / Medium / Low / Total counters |
| Threat Feed | Left Panel | Scrollable list of classified threat events |
| Attack Map | Centre Panel | Animated geographic attack origin display |
| Analysis Panel | Centre Panel | Claude AI real-time threat analysis output |
| Action Bar | Centre Bottom | Analyze / Alert / Report action buttons |
| Alert Log | Right Panel | Session-scoped alert history |
| Report Modal | Overlay | Full Claude intelligence report + export |
| Toast Notification | Top Right | Confirmation of dispatched alerts |

---

## 5. Error Handling

- **Claude API failure:** error message displayed in analysis panel with error text
- **Report generation failure:** error shown in modal body
- **Empty dataset:** system falls back to built-in mock threat library
- **Network timeout:** catch block surfaces to UI — no silent failures
