'use client';

import { useSentinel } from '../lib/store';
import { useEffect, useState } from 'react';

export default function Header() {
  const { state, setDataset, showToast, setLastFetch } = useSentinel();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().split('T')[1].split('.')[0] + ' UTC');
      const d = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      setDate(d.toUpperCase());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/feeds');
      if (res.ok) {
        showToast('FEEDS REFRESHED SUCCESSFULLY', 'success');
        setLastFetch(new Date().toLocaleTimeString());
      } else {
        showToast('FAILED TO REFRESH FEEDS', 'error');
      }
    } catch (err) {
      showToast('NETWORK ERROR DURING REFRESH', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className="relative z-50 flex items-center justify-between h-[56px] px-6 border-b border-[var(--border)] bg-[linear-gradient(90deg,rgba(0,212,255,0.04),transparent_40%,transparent_60%,rgba(136,85,255,0.03))]">
      {/* LEFT ZONE */}
      <div className="flex items-center gap-4">
        <div className="relative w-6 h-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{ animation: 'pulse-ring 2s infinite' }}></div>
          <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="font-orbitron font-bold text-[22px] text-[var(--accent)] tracking-[8px] m-0 leading-none drop-shadow-[var(--glow)]">SENTINEL</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[var(--text-dim)] text-[8px] uppercase font-mono tracking-[4px] m-0">THREAT INTELLIGENCE PLATFORM</p>
            <span className="text-[var(--purple)] bg-[rgba(136,85,255,0.1)] border border-[var(--purple)] px-[6px] py-[1px] text-[8px] font-mono leading-none">
              v2.0 // CLAUDE-POWERED
            </span>
          </div>
        </div>
      </div>

      {/* CENTRE ZONE */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 border border-[var(--border2)] bg-[rgba(255,255,255,0.02)] px-[10px] py-[4px] font-mono text-[9px] tracking-[2px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" style={{ animation: 'status-breathe 2s infinite' }}></span>
          <span className="text-[var(--text)]">MONITORING: <span className="text-[var(--green)]">ACTIVE</span></span>
        </div>
        <div className="flex items-center gap-2 border border-[var(--border2)] bg-[rgba(255,255,255,0.02)] px-[10px] py-[4px] font-mono text-[9px] tracking-[2px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent2)]" style={{ animation: 'status-breathe 2s infinite' }}></span>
          <span className="text-[var(--text)]">THREATS: <span className="text-[var(--accent2)]">{state.stats.critical} CRITICAL</span></span>
        </div>
        <div className="flex items-center gap-2 border border-[var(--border2)] bg-[rgba(255,255,255,0.02)] px-[10px] py-[4px] font-mono text-[9px] tracking-[2px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" style={{ animation: 'status-breathe 2s infinite' }}></span>
          <span className="text-[var(--text)]">INTEL FEEDS: <span className="text-[var(--accent)]">LIVE</span></span>
        </div>
        <div className="flex items-center gap-2 border border-[var(--border2)] bg-[rgba(255,255,255,0.02)] px-[10px] py-[4px] font-mono text-[9px] tracking-[2px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" style={{ animation: 'status-breathe 2s infinite' }}></span>
          <span className="text-[var(--text)]">SYSTEM: <span className="text-[var(--green)]">NOMINAL</span></span>
        </div>
      </div>

      {/* RIGHT ZONE */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <div className="font-orbitron text-[var(--accent)] text-[14px] tracking-[2px] leading-none mb-1">{time}</div>
          <div className="font-mono text-[var(--text-dim)] text-[9px] leading-none">{date}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="h-[28px] px-[12px] border border-[var(--accent)] text-[var(--accent)] font-orbitron text-[8px] tracking-[2px] uppercase hover:bg-[rgba(0,212,255,0.08)] transition-colors flex items-center"
            onClick={() => document.getElementById('dataset-upload')?.click()}
          >
            LOAD DATASET
          </button>
          <input
            id="dataset-upload"
            type="file"
            accept=".json"
            className="hidden"
          />
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-[28px] px-[12px] border border-[var(--green)] text-[var(--green)] font-orbitron text-[8px] tracking-[2px] uppercase hover:bg-[rgba(0,255,136,0.08)] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isRefreshing ? (
              <span className="animate-spin inline-block">↻</span>
            ) : null}
            {state.lastFetch ? `REFRESHED ${state.lastFetch}` : 'REFRESH FEEDS'}
          </button>
        </div>
      </div>
    </header>
  );
}
