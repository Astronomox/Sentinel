'use client';

import { useEffect, useState } from 'react';
import { useSentinel } from '../lib/store';

export default function AnalysisPanel() {
  const { state, setAnalysis, setAnalysisLoading } = useSentinel();
  const [displayedText, setDisplayedText] = useState('');
  const [loadingPhase, setLoadingPhase] = useState(0);

  useEffect(() => {
    let cancel = false;

    const analyzeThreat = async () => {
      if (!state.selectedThreat) return;

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ threat: state.selectedThreat })
        });

        const data = await res.json();

        if (cancel) return;

        if (res.ok && data.analysis) {
          setAnalysis(data.analysis);
        } else {
          setAnalysis(`ERROR: ${data.error || 'Failed to analyze threat.'}`);
        }
      } catch (err: any) {
        if (!cancel) setAnalysis(`ERROR: ${err.message || 'Network error'}`);
      } finally {
        if (!cancel) setAnalysisLoading(false);
      }
    };

    if (state.analysisLoading && state.selectedThreat) {
      setDisplayedText('');
      setAnalysis('');
      setLoadingPhase(0);
      analyzeThreat();
    }

    return () => { cancel = true; };
  }, [state.selectedThreat, state.analysisLoading, setAnalysis, setAnalysisLoading]);

  // Loading phases
  useEffect(() => {
      if (!state.analysisLoading) return;
      const interval = setInterval(() => {
          setLoadingPhase(p => (p + 1) % 4);
      }, 800);
      return () => clearInterval(interval);
  }, [state.analysisLoading]);

  // Typewriter effect
  useEffect(() => {
    if (!state.analysis || state.analysisLoading) return;

    let index = 0;
    setDisplayedText('');

    const timer = setInterval(() => {
      setDisplayedText(prev => prev + state.analysis.charAt(index));
      index++;
      if (index >= state.analysis.length) clearInterval(timer);
    }, 18);

    return () => clearInterval(timer);
  }, [state.analysis, state.analysisLoading]);

  const loadingMessages = [
      "CLASSIFYING THREAT VECTOR...",
      "CORRELATING ATTACK PATTERNS...",
      "GENERATING INTELLIGENCE...",
      "ASSESSING RISK FACTORS..."
  ];

  const isHealthy = state.selectedThreat?.sev === 'healthy';

  return (
    <div className="flex flex-col bg-[var(--bg2)] overflow-hidden min-h-[160px] max-h-[200px]">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--bg3)]">
        <div className="flex items-center gap-3">
          <span className="font-orbitron text-[8px] tracking-[3px] bg-[rgba(136,85,255,0.15)] text-[var(--purple)] border border-[var(--purple)] px-[10px] py-[3px]">
              CLAUDE AI
          </span>
          <span className="font-mono text-[9px] tracking-[2px] text-[var(--text-dim)] uppercase">
              REAL-TIME THREAT INTELLIGENCE
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto relative flex flex-col justify-center">
        {!state.selectedThreat ? (
          <div className="flex flex-col items-center justify-center text-center gap-2">
              <svg className="w-6 h-6 text-[var(--text-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div className="font-orbitron text-[9px] tracking-[3px] text-[var(--text-dim)] uppercase">
                  SELECT A THREAT TO ANALYZE
              </div>
              <div className="font-mono text-[10px] text-[var(--text-dim)] opacity-50">
                  or click ANALYZE NOW
              </div>
          </div>
        ) : state.analysisLoading ? (
          <div className="flex flex-col gap-4 max-w-[80%]">
            <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[11px] tracking-[2px]">
              <div className="flex gap-1">
                <span style={{ animation: 'dot-pulse 1.4s infinite' }}>.</span>
                <span style={{ animation: 'dot-pulse 1.4s infinite 0.2s' }}>.</span>
                <span style={{ animation: 'dot-pulse 1.4s infinite 0.4s' }}>.</span>
              </div>
              <span>CLAUDE ANALYZING THREAT...</span>
            </div>

            <div className="w-full h-[2px] bg-[var(--bg3)] overflow-hidden">
                <div className="h-full bg-[var(--accent)] transition-all duration-1000 ease-in-out" style={{ width: `${(loadingPhase + 1) * 25}%` }}></div>
            </div>

            <div className="font-mono text-[9px] text-[var(--text-dim)]">
                {loadingMessages[loadingPhase]}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className={`font-mono text-[12px] leading-[1.9] flex-1 ${state.analysis.startsWith('ERROR') ? 'text-[var(--accent2)]' : isHealthy ? 'text-[var(--green)]' : 'text-[var(--text)]'}`}>
                {isHealthy && <span className="mr-2">🛡️</span>}
                {displayedText}
                {displayedText.length < state.analysis.length && (
                    <span className="inline-block w-[8px] h-[14px] bg-[var(--accent)] ml-1 align-middle" style={{ animation: 'typewriter-cursor 1s infinite' }}></span>
                )}
            </div>

            {displayedText.length === state.analysis.length && !state.analysis.startsWith('ERROR') && (
                <div className="mt-4 pt-2 border-t border-[var(--border)] font-mono text-[9px] text-[var(--text-dim)] flex items-center gap-2 flex-wrap">
                    <span className="truncate max-w-[200px]">ANALYZED: {state.selectedThreat.name}</span>
                    <span className="opacity-40">//</span>
                    <span style={{ color: getSeverityColor(state.selectedThreat.sev) }}>
                        SEVERITY: {state.selectedThreat.sev.toUpperCase()}
                    </span>
                    <span className="opacity-40">//</span>
                    <span>MODEL: claude-sonnet-4-20250514</span>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getSeverityColor(sev: string) {
    switch (sev) {
      case 'critical': return 'var(--accent2)';
      case 'high': return 'var(--accent3)';
      case 'medium': return 'var(--accent)';
      case 'healthy': return 'var(--green)';
      default: return 'var(--text-dim)';
    }
}
