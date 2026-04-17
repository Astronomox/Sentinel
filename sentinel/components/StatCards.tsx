'use client';

import { useSentinel } from '../lib/store';

export default function StatCards() {
  const { state } = useSentinel();
  const { stats } = state;

  const cards = [
    { label: 'CRITICAL', count: stats.critical, color: 'var(--accent2)', type: 'critical' },
    { label: 'HIGH', count: stats.high, color: 'var(--accent3)', type: 'high' },
    { label: 'MEDIUM', count: stats.medium, color: 'var(--accent)', type: 'medium' },
    { label: 'LOW', count: stats.low, color: 'var(--green-dim)', type: 'low' },
    { label: 'CLEAN SIGNALS', count: stats.healthy, color: 'var(--green)', type: 'healthy' },
    { label: 'TOTAL MONITORED', count: stats.total, color: 'var(--text-dim)', type: 'total' },
  ];

  return (
    <div className="flex w-full bg-[var(--bg2)] border-b border-[var(--border)]">
      {cards.map((card, idx) => (
        <div
          key={card.type}
          className="flex-1 border-r border-[var(--border)] last:border-r-0 pt-[12px] px-[20px] pb-[14px] relative"
          style={{ borderTop: `3px solid ${card.color}` }}
        >
          <div className="font-mono text-[8px] tracking-[3px] text-[var(--text-dim)] mb-1">{card.label}</div>
          <div
            key={card.count} // force re-render for animation on change
            className="font-orbitron font-[900] text-[36px] leading-none mb-2"
            style={{
              color: card.color,
              animation: 'counter-bump 0.3s ease-out'
            }}
          >
            {card.count}
          </div>
          <div className="flex items-center gap-1 font-mono text-[9px]">
            <span style={{ color: card.count > 0 ? 'var(--accent2)' : 'var(--green)' }}>
              {card.count > 0 ? '▲' : '▼'}
            </span>
            <span className="text-[var(--text-dim)]">+1 since last</span>
          </div>

          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--bg3)]">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${stats.total > 0 ? (card.count / stats.total) * 100 : 0}%`,
                backgroundColor: card.color
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
