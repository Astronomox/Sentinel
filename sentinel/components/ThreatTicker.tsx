'use client';

import { useSentinel } from '../lib/store';
import { useState } from 'react';

export default function ThreatTicker() {
  const { state } = useSentinel();
  const [isPaused, setIsPaused] = useState(false);

  const allItems = [...state.threats, ...state.healthy];

  if (allItems.length === 0) return null;

  return (
    <div
      className="flex h-[28px] border-b border-[var(--border)] overflow-hidden bg-[rgba(255,42,42,0.04)] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-[120px] shrink-0 bg-[var(--accent2)] text-white flex items-center justify-center font-orbitron text-[8px] font-bold tracking-[3px] z-10 border-r border-[rgba(255,255,255,0.2)]">
        ⚠ LIVE THREATS
      </div>
      <div className="flex-1 relative overflow-hidden flex items-center">
        <div
          className="absolute whitespace-nowrap flex items-center gap-4"
          style={{
            animation: 'scroll-ticker 40s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {/* Duplicate for seamless scrolling */}
          {[...allItems, ...allItems].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center">
              <span className="font-mono text-[10px]" style={{ color: item.sev === 'healthy' ? 'var(--green)' : 'var(--accent2)' }}>
                {item.name}
              </span>
              <span className="text-[var(--accent3)] mx-4 text-[10px]">◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
