'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { Threat, Alert, Stats, AppState, ToastMessage, HealthyEntry, Severity, SourceStatus } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface SentinelContextProps {
  state: AppState
  setThreats: (threats: Threat[]) => void
  addThreat: (threat: Threat) => void
  setHealthy: (healthy: HealthyEntry[]) => void
  addAlert: (alert: Alert) => void
  setStats: (stats: Stats) => void
  setSelectedThreat: (threat: Threat | HealthyEntry | null) => void
  setAnalysis: (analysis: string) => void
  setAnalysisLoading: (loading: boolean) => void
  showToast: (message: string, type: 'success'|'error'|'info'|'alert') => void
  removeToast: (id: string) => void
  setFilter: (filter: Severity | 'all') => void
  setSources: (sources: SourceStatus[]) => void
  setLastFetch: (time: string | null) => void
  dataset: Pick<Threat, 'name' | 'sev' | 'sources'>[]
  setDataset: (dataset: Pick<Threat, 'name' | 'sev' | 'sources'>[]) => void
}

const defaultStats: Stats = {
  critical: 0,
  high: 0,
  medium: 0,
  low: 0,
  healthy: 0,
  total: 0
}

const defaultState: AppState = {
  threats: [],
  healthy: [],
  alerts: [],
  stats: defaultStats,
  selectedThreat: null,
  analysis: '',
  analysisLoading: false,
  toasts: [],
  filter: 'all',
  sources: [],
  lastFetch: null
}

const SentinelContext = createContext<SentinelContextProps | undefined>(undefined)

import { mockThreats } from './threats'

export const SentinelProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(defaultState)
  const [dataset, setDataset] = useState<Pick<Threat, 'name' | 'sev' | 'sources'>[]>(mockThreats)

  const setThreats = useCallback((threats: Threat[]) => setState((prev) => ({ ...prev, threats })), [])
  const addThreat = useCallback((threat: Threat) => setState((prev) => {
    const updatedThreats = [threat, ...prev.threats].slice(0, 20)
    const newStats = { ...prev.stats }
    if (threat.sev !== 'healthy') {
        newStats[threat.sev as keyof Omit<Stats, 'healthy'|'total'>] += 1
    }
    newStats.total += 1
    return { ...prev, threats: updatedThreats, stats: newStats }
  }), [])

  const setHealthy = useCallback((healthy: HealthyEntry[]) => setState((prev) => ({ ...prev, healthy })), [])

  const addAlert = useCallback((alert: Alert) => setState((prev) => ({ ...prev, alerts: [alert, ...prev.alerts] })), [])
  const setStats = useCallback((stats: Stats) => setState((prev) => ({ ...prev, stats })), [])
  const setSelectedThreat = useCallback((threat: Threat | HealthyEntry | null) => setState((prev) => ({ ...prev, selectedThreat: threat })), [])
  const setAnalysis = useCallback((analysis: string) => setState((prev) => ({ ...prev, analysis })), [])
  const setAnalysisLoading = useCallback((loading: boolean) => setState((prev) => ({ ...prev, analysisLoading: loading })), [])

  const showToast = useCallback((message: string, type: 'success'|'error'|'info'|'alert') => {
    const id = uuidv4()
    setState((prev) => ({
      ...prev,
      toasts: [...prev.toasts, { id, message, type }]
    }))
  }, [])

  const removeToast = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter(t => t.id !== id)
    }))
  }, [])

  const setFilter = useCallback((filter: Severity | 'all') => setState((prev) => ({ ...prev, filter })), [])
  const setSources = useCallback((sources: SourceStatus[]) => setState((prev) => ({ ...prev, sources })), [])
  const setLastFetch = useCallback((lastFetch: string | null) => setState((prev) => ({ ...prev, lastFetch })), [])

  return React.createElement(
    SentinelContext.Provider,
    {
      value: {
        state, setThreats, addThreat, setHealthy, addAlert, setStats,
        setSelectedThreat, setAnalysis, setAnalysisLoading, showToast, removeToast,
        setFilter, setSources, setLastFetch, dataset, setDataset
      }
    },
    children
  )
}

export const useSentinel = () => {
  const context = useContext(SentinelContext)
  if (context === undefined) {
    throw new Error('useSentinel must be used within a SentinelProvider')
  }
  return context
}
