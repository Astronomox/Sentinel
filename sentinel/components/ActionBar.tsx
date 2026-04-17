'use client';

import { useSentinel } from '../lib/store';
import { v4 as uuidv4 } from 'uuid';

export default function ActionBar() {
  const { state, setSelectedThreat, setAnalysisLoading, addAlert, showToast } = useSentinel();

  const handleAnalyze = () => {
    if (state.analysisLoading) return;
    const threatToAnalyze = state.selectedThreat || state.threats.find(t => t.sev === 'critical') || state.threats[0];
    if (threatToAnalyze) {
      setSelectedThreat(threatToAnalyze);
      setAnalysisLoading(true);
    } else {
        showToast('NO THREATS TO ANALYZE', 'info');
    }
  };

  const handleAlert = (e: React.MouseEvent<HTMLButtonElement>) => {
    const threatToAlert = state.selectedThreat || state.threats[0];
    if (threatToAlert && threatToAlert.sev !== 'healthy') {
      addAlert({
        id: uuidv4(),
        threat: threatToAlert, // assuming it's a threat
        dispatchedAt: new Date().toISOString()
      });
      showToast(`ALERT DISPATCHED — ${threatToAlert.name}`, 'alert');

      // trigger pulse
      const btn = e.currentTarget;
      btn.style.animation = 'pulse-ring-red 1s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => btn.style.animation = '', 1000);

    } else {
      showToast('NO THREAT AVAILABLE TO ALERT', 'info');
    }
  };

  const handleReport = () => {
    window.dispatchEvent(new CustomEvent('open-report-modal'));
  };

  return (
    <div className="flex h-[52px] bg-[var(--border)] border-t border-[var(--border)] p-[10px_12px] gap-[8px] items-center">
      <button
        onClick={handleAnalyze}
        disabled={state.analysisLoading}
        className="flex-1 flex flex-col items-center justify-center gap-[2px] h-full bg-transparent border border-[var(--accent)] rounded-[var(--radius)] text-[var(--accent)] hover:bg-[rgba(0,212,255,0.08)] hover:shadow-[var(--glow)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        <div className="flex items-center gap-2 relative z-10">
            <span className={`text-[16px] ${state.analysisLoading ? 'animate-spin' : ''}`}>⬡</span>
            <span className="font-orbitron font-[700] text-[9px] tracking-[2px]">{state.analysisLoading ? 'ANALYZING...' : 'ANALYZE NOW'}</span>
        </div>
        <span className="font-mono text-[8px] opacity-60 relative z-10">Claude AI Engine</span>
      </button>

      <button
        onClick={handleAlert}
        className="flex-1 flex flex-col items-center justify-center gap-[2px] h-full bg-transparent border border-[var(--accent2)] rounded-[var(--radius)] text-[var(--accent2)] hover:bg-[rgba(255,42,42,0.08)] hover:shadow-[var(--glow-red)] transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="flex items-center gap-2 relative z-10">
            <span className="text-[16px]">⚠</span>
            <span className="font-orbitron font-[700] text-[9px] tracking-[2px]">DISPATCH ALERT</span>
        </div>
        <span className="font-mono text-[8px] opacity-60 relative z-10">Alert Operations</span>
      </button>

      <button
        onClick={handleReport}
        className="flex-1 flex flex-col items-center justify-center gap-[2px] h-full bg-transparent border border-[var(--accent3)] rounded-[var(--radius)] text-[var(--accent3)] hover:bg-[rgba(255,170,0,0.08)] hover:shadow-[var(--glow-amber)] transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="flex items-center gap-2 relative z-10">
            <span className="text-[16px]">≡</span>
            <span className="font-orbitron font-[700] text-[9px] tracking-[2px]">FULL REPORT</span>
        </div>
        <span className="font-mono text-[8px] opacity-60 relative z-10">Intelligence Brief</span>
      </button>
    </div>
  );
}
