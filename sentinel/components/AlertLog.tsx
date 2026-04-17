'use client';

import { useSentinel } from '../lib/store';

export default function AlertLog() {
  const { state } = useSentinel();

  return (
    <div className="flex flex-col h-full bg-[var(--bg2)] border-l border-[var(--border)] overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        <h2 className="font-orbitron text-[9px] tracking-[3px] text-[var(--text-dim)] uppercase m-0">ALERT LOG</h2>
        <span className="font-mono text-[8px] bg-[var(--accent2)] text-[var(--bg)] px-[6px] py-[1px] font-[700] rounded-[2px]">
          {state.alerts.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {state.alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <svg className="w-6 h-6 text-[var(--text-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="font-orbitron text-[9px] text-[var(--text-dim)] tracking-[1px] uppercase">
                NO ALERTS DISPATCHED
            </div>
            <div className="font-mono text-[9px] text-[var(--text-dim)] opacity-40">
                System monitoring active
            </div>
          </div>
        ) : (
          state.alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-[10px_12px] bg-[var(--bg2)] border border-[var(--border)] border-l-[3px] border-l-[var(--accent2)] rounded-[var(--radius)] relative"
              style={{ animation: 'slide-in-right 0.3s ease, alert-flash 1s ease 3' }}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-orbitron font-[700] text-[8px] text-[var(--accent2)] uppercase">
                  ⚠ DISPATCHED
                </span>
                <span className="font-mono text-[9px] text-[var(--text-dim)]">
                  {new Date(alert.dispatchedAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="font-rajdhani font-[600] text-[13px] text-[var(--text-bright)] truncate mt-2 mb-1">
                {alert.threat.name}
              </div>
              <div className="flex gap-2 font-mono text-[9px]">
                <span className="px-1 bg-[rgba(255,42,42,0.1)] text-[var(--accent2)] border border-[var(--accent2)] rounded-[2px]">{alert.threat.sev}</span>
                <span className="text-[var(--text-dim)]">SRC: {alert.threat.sources[0]}</span>
              </div>
              <div className="font-mono text-[10px] text-[var(--text-dim)] mt-3 italic">
                Containment protocol initiated. Incident logged. Team notified.
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
