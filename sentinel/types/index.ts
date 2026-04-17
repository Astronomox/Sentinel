export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'healthy'

export interface Threat {
  id: string
  name: string
  sev: Severity
  sources: string[]
  timestamp: string
}

export interface HealthyEntry {
  id: string
  name: string
  sev: 'healthy'
  sources: string[]
  timestamp: string
  status: 'nominal'
}

export interface SourceStatus {
  name: string
  status: 'ok' | 'failed' | 'skipped'
  count: number
}

export interface FeedResponse {
  threats: Threat[]
  healthy: HealthyEntry[]
  fetchedAt: string
  sources: SourceStatus[]
}

export interface Alert {
  id: string
  threat: Threat
  dispatchedAt: string
}

export interface Stats {
  critical: number
  high: number
  medium: number
  low: number
  healthy: number
  total: number
}

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'alert'
}

export interface AppState {
  threats: Threat[]
  healthy: HealthyEntry[]
  alerts: Alert[]
  stats: Stats
  selectedThreat: Threat | HealthyEntry | null
  analysis: string
  analysisLoading: boolean
  toasts: ToastMessage[]
  filter: Severity | 'all'
  sources: SourceStatus[]
  lastFetch: string | null
}
