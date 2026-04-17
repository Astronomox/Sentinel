'use client';

import { useSentinel } from '../lib/store';
import { Threat, HealthyEntry } from '../types';

export default function ThreatFeed() {
  const { state, setSelectedThreat, setAnalysisLoading, setFilter, setThreats, setHealthy, setStats } = useSentinel();

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'var(--accent2)';
      case 'high': return 'var(--accent3)';
      case 'medium': return 'var(--accent)';
      case 'low': return 'var(--green-dim)';
      case 'healthy': return 'var(--green)';
      default: return 'var(--text-dim)';
    }
  };

  const handleSelect = (threat: Threat | HealthyEntry) => {
    setSelectedThreat(threat);
    setAnalysisLoading(true);
  };

  const handleEnrich = async (e: React.MouseEvent, threat: Threat) => {
    e.stopPropagation();
    try {
        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ threat, enrichment: true })
        });
        const data = await res.json();
        if (data.analysis) {
            alert(`ENRICHMENT DATA:\n\n${data.analysis}`); // Basic alert for now, could be better integrated
        }
    } catch (err) {
        console.error(err);
    }
  };

  const allItems = [...state.threats, ...state.healthy];
  const filteredItems = state.filter === 'all'
    ? allItems
    : allItems.filter(item => item.sev === state.filter);

  return (
    <div className="flex flex-col h-full bg-[var(--bg2)] border-r border-[var(--border)] overflow-hidden">
      <div className="flex flex-col border-b border-[var(--border)]">
        <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
          <h2 className="font-orbitron text-[9px] tracking-[3px] text-[var(--accent)] uppercase m-0">LIVE THREAT FEED</h2>
          <div className="flex items-center gap-2">
            <span className="font-orbitron text-[8px] text-[var(--text-bright)]">LIVE</span>
            <div className="w-2 h-2 rounded-full bg-[var(--accent2)] shadow-[var(--glow-red)]" style={{ animation: 'blink 1.5s infinite' }}></div>
          </div>
        </div>

        {/* Source Indicators */}
        <div className="flex items-center gap-4 p-2 bg-[var(--bg3)] border-b border-[var(--border)] text-[8px] font-mono">
            {state.sources.map(src => (
                <div key={src.name} className="flex items-center gap-1">
                    <span style={{
                        color: src.status === 'ok' ? 'var(--green)' : src.status === 'failed' ? 'var(--accent2)' : 'var(--text-dim)'
                    }}>●</span>
                    <span className="text-[var(--text-dim)]">{src.name}</span>
                </div>
            ))}
        </div>

        {/* Filter Row */}
        <div className="flex gap-1 p-2 overflow-x-auto bg-[var(--bg4)]">
            {['all', 'critical', 'high', 'medium', 'low', 'healthy'].map((filterType) => {
                const isActive = state.filter === filterType;
                const color = getSeverityColor(filterType);
                const count = filterType === 'all'
                  ? allItems.length
                  : filterType === 'healthy'
                    ? state.healthy.length
                    : state.threats.filter(t => t.sev === filterType).length;

                return (
                    <button
                        key={filterType}
                        onClick={() => setFilter(filterType as any)}
                        className={`px-2 py-1 text-[8px] font-orbitron tracking-widest uppercase transition-colors border`}
                        style={{
                            borderColor: isActive ? color : 'var(--border)',
                            backgroundColor: isActive ? `${color}20` : 'transparent',
                            color: isActive ? color : 'var(--text-dim)'
                        }}
                    >
                        {filterType} ({count})
                    </button>
                )
            })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredItems.map((item) => {
          const isSelected = state.selectedThreat?.id === item.id;
          const isHealthy = item.sev === 'healthy';
          const sevColor = getSeverityColor(item.sev);

          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="p-3 cursor-pointer transition-all duration-300 relative group"
              style={{
                backgroundColor: isSelected
                    ? (isHealthy ? 'rgba(0,255,136,0.05)' : 'rgba(0, 212, 255, 0.05)')
                    : (isHealthy ? 'rgba(0,255,136,0.02)' : 'var(--bg2)'),
                borderLeft: `3px solid ${sevColor}`,
                border: isSelected ? `1px solid ${sevColor}` : '1px solid transparent',
                borderLeftWidth: '3px',
                animation: 'feed-new-item 0.4s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isHealthy ? 'rgba(0,255,136,0.04)' : 'var(--bg3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? (isHealthy ? 'rgba(0,255,136,0.05)' : 'rgba(0, 212, 255, 0.05)') : (isHealthy ? 'rgba(0,255,136,0.02)' : 'var(--bg2)')}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-orbitron font-bold text-[7px] tracking-[2px] px-1.5 py-0.5 rounded-[var(--radius)] uppercase" style={{ backgroundColor: `${sevColor}26`, color: sevColor, border: `1px solid ${sevColor}` }}>
                  {item.sev}
                </span>
                <span className="font-mono text-[9px] text-[var(--text-dim)]">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="font-rajdhani text-[13px] font-semibold truncate transition-colors mt-2" style={{ color: isHealthy ? 'var(--green)' : 'var(--text-bright)' }}>
                {isHealthy && <span className="mr-1">🛡️</span>}
                {item.name}
              </div>

              <div className="font-mono text-[10px] text-[var(--text-dim)] mt-1 truncate">
                SRC: {item.sources.join(', ')}
              </div>

              {isHealthy && (
                  <div className="font-mono text-[8px] text-[var(--green)] mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]"></span> NOMINAL
                  </div>
              )}

              {isSelected && !isHealthy && (
                  <div className="mt-3 flex items-center justify-between overflow-hidden" style={{ animation: 'slide-in-up 0.2s ease' }}>
                      <div className="text-[8px] font-mono text-[var(--text-dim)]">
                          {item.sources[0]?.match(/\d+\.\d+\.\d+\.\d+/) ? 'IP REPUTATION' :
                           item.name.includes('Botnet') ? 'MALWARE FAMILY' : 'URL CATEGORY'}
                      </div>
                      <button
                        onClick={(e) => handleEnrich(e, item as Threat)}
                        className="text-[8px] font-orbitron text-[var(--accent)] hover:text-white transition-colors"
                      >
                          ENRICH →
                      </button>
                  </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
