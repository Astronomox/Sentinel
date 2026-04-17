'use client';

import { useEffect, useState } from 'react';
import { useSentinel } from '../lib/store';

export default function AttackMap() {
  const { state } = useSentinel();
  const [dots, setDots] = useState<Array<{ id: string, x: number, y: number, type: 'critical' | 'high' | 'medium' | 'healthy' }>>([]);

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'var(--accent2)';
      case 'high': return 'var(--accent3)';
      case 'medium': return 'var(--accent)';
      case 'healthy': return 'var(--green)';
      default: return 'var(--accent)';
    }
  };

  useEffect(() => {
    // Generate deterministic pseudo-random positions based on ID
    const newDots = [...state.threats, ...state.healthy].slice(0, 15).map(item => {
      // Simple hash function for deterministic positioning
      let hash = 0;
      for (let i = 0; i < item.id.length; i++) {
        hash = item.id.charCodeAt(i) + ((hash << 5) - hash);
      }

      return {
        id: item.id,
        x: 10 + (Math.abs(hash) % 80), // 10% to 90%
        y: 10 + (Math.abs(hash >> 8) % 80),
        type: item.sev as any
      };
    });

    setDots(newDots);
  }, [state.threats, state.healthy]);

  return (
    <div className="relative h-[220px] bg-[var(--bg3)] border-b border-[var(--border)] overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px'
      }}></div>

      {/* World Map SVG (Simplified) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
         <svg className="w-full h-full" viewBox="0 0 1000 500" style={{ fill: 'rgba(0,212,255,0.03)', stroke: 'rgba(0,212,255,0.12)', strokeWidth: 0.5 }}>
            <path d="M150 100 L300 80 L350 200 L250 300 L100 250 Z" /> {/* NA */}
            <path d="M280 320 L380 300 L400 450 L300 480 L250 400 Z" /> {/* SA */}
            <path d="M450 150 L600 100 L700 200 L550 250 Z" /> {/* EU/AF */}
            <path d="M650 80 L900 50 L950 250 L750 300 Z" /> {/* AS */}
            <path d="M780 350 L900 320 L950 450 L800 480 Z" /> {/* AU */}
         </svg>
      </div>

      {/* Attack Dots */}
      {dots.map(dot => {
        const color = getSeverityColor(dot.type);

        if (dot.type === 'healthy') {
          return (
            <div
              key={dot.id}
              className="absolute w-[6px] h-[6px] rounded-full group cursor-crosshair"
              style={{
                left: `${dot.x}%`, top: `${dot.y}%`,
                backgroundColor: color,
                animation: 'status-breathe 2s infinite'
              }}
            >
              <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap font-mono text-[7px] text-[var(--green)] bg-[var(--bg2)] px-1 border border-[var(--green)] z-10">
                SECURE NODE
              </div>
            </div>
          );
        }

        let outerRingSize = '8px';
        let innerDotSize = '4px';
        let pingAnim = 'ping-medium 3s infinite';

        if (dot.type === 'critical') {
           outerRingSize = '16px'; innerDotSize = '6px'; pingAnim = 'ping-critical 2s infinite';
        } else if (dot.type === 'high') {
           outerRingSize = '12px'; innerDotSize = '4px'; pingAnim = 'ping-high 2.5s infinite';
        }

        return (
          <div key={dot.id} className="absolute" style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: 'translate(-50%, -50%)' }}>
            <div className="absolute rounded-full border border-current flex items-center justify-center"
                 style={{
                   width: outerRingSize, height: outerRingSize, color,
                   animation: pingAnim,
                   transformOrigin: 'center center'
                 }}>
            </div>
            <div className="absolute rounded-full shadow-[var(--glow-red)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                 style={{ width: innerDotSize, height: innerDotSize, backgroundColor: color }}>
            </div>

            {/* Connection line to center */}
            <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none" style={{ zIndex: -1 }}>
                <line x1="0" y1="0" x2={`${50 - dot.x}vw`} y2={`${50 - dot.y}vh`}
                      stroke="rgba(255,42,42,0.15)" strokeWidth="1" strokeDasharray="4 4"
                      style={{ animation: 'data-stream 3s linear infinite' }} />
            </svg>
          </div>
        );
      })}

      {/* Overlays */}
      <div className="absolute top-[12px] left-[12px] font-mono text-[8px] text-[var(--text-dim)]">
        [ GLOBAL THREAT MAP ]
      </div>
      <div className="absolute top-[12px] right-[12px] font-orbitron text-[9px] text-[var(--accent2)]">
        {state.threats.length} ACTIVE VECTORS
      </div>
      <div className="absolute bottom-[12px] left-[12px] font-mono text-[8px] text-[var(--text-dim)]">
        LAT {(Math.random() * 90).toFixed(3)} LON {(Math.random() * 180).toFixed(3)}
      </div>
      <div className="absolute bottom-[12px] right-[12px] font-mono text-[8px] text-[var(--text-dim)] opacity-50">
        SENTINEL RADAR v2.0
      </div>
    </div>
  );
}
