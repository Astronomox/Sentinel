'use client';

import { useSentinel } from '../lib/store';

import { useEffect, useState } from 'react';

export default function LiveMetricsBar() {
  const { state } = useSentinel();
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-[24px] bg-[var(--bg3)] border-b border-[var(--border)] items-center px-4 font-mono text-[10px] text-[var(--text-dim)] overflow-hidden">
      <div className="flex gap-2">
        <span>THREATS/MIN: {(state.stats.total / 5).toFixed(1)}</span>
        <span>|</span>
        <span>FEEDS: {state.sources.filter(s => s.status === 'ok').length}/3 ONLINE</span>
        <span>|</span>
        <span>LAST EVENT: {time}</span>
        <span>|</span>
        <span>SESSION: 00:05:32</span>
        <span>|</span>
        <span>ALERTS SENT: {state.alerts.length}</span>
      </div>
    </div>
  );
}
