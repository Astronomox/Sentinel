'use client';

import { useEffect, useState } from 'react';
import { useSentinel } from '../lib/store';

export default function Toast() {
  const { state, removeToast } = useSentinel();

  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2 w-[320px]">
      {state.toasts.map((toast) => {
        let borderColor = 'var(--border)';
        let textColor = 'var(--text)';
        let icon = '';
        let glow = '';

        switch (toast.type) {
          case 'success':
            borderColor = 'var(--green)';
            textColor = 'var(--green)';
            icon = '✓';
            glow = 'var(--glow-green)';
            break;
          case 'error':
            borderColor = 'var(--accent2)';
            textColor = 'var(--accent2)';
            icon = '✕';
            glow = 'var(--glow-red)';
            break;
          case 'info':
            borderColor = 'var(--accent)';
            textColor = 'var(--accent)';
            icon = 'ℹ';
            glow = 'var(--glow)';
            break;
          case 'alert':
            borderColor = 'var(--accent3)';
            textColor = 'var(--accent3)';
            icon = '⚠';
            glow = 'var(--glow-amber)';
            break;
        }

        return (
          <div
            key={toast.id}
            className="bg-[var(--bg2)] rounded-[var(--radius2)] p-3 relative overflow-hidden"
            style={{
              border: `1px solid ${borderColor}`,
              borderLeft: `4px solid ${borderColor}`,
              boxShadow: glow,
              animation: 'toast-in 0.3s ease forwards'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[12px]" style={{ color: textColor }}>{icon}</span>
              <span className="font-orbitron text-[9px] tracking-[2px] uppercase" style={{ color: textColor }}>
                {toast.type.toUpperCase()}
              </span>
            </div>
            <div className="font-mono text-[10px] text-[var(--text)] leading-relaxed">
              {toast.message}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-[var(--bg3)] w-full">
              <div
                className="h-full origin-left"
                style={{
                  backgroundColor: borderColor,
                  animation: 'toast-progress 3.5s linear forwards'
                }}
              ></div>
            </div>
          </div>
        );
      })}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}} />
    </div>
  );
}
