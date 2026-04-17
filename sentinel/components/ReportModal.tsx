'use client';

import { useEffect, useState } from 'react';
import { useSentinel } from '../lib/store';

export default function ReportModal() {
  const { state } = useSentinel();
  const [isOpen, setIsOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      generateReport();
    };

    window.addEventListener('open-report-modal', handleOpen);
    return () => window.removeEventListener('open-report-modal', handleOpen);
  }, [state.stats]);

  useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    setReportText('');

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats: state.stats })
      });

      const data = await res.json();

      if (res.ok && data.report) {
        setReportText(data.report);
      } else {
        setError(data.error || 'Failed to generate report.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!reportText) return;
    const content = `SENTINEL THREAT INTELLIGENCE REPORT
Generated: ${new Date().toISOString()}
Classification: CONFIDENTIAL
Model: claude-sonnet-4-20250514
════════════════════════════════\n\n${reportText}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-intel-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  // Function to format report sections
  const formatReport = (text: string) => {
      return text.split('\n').map((line, index) => {
          if (line.match(/^[A-Z\s]+:/)) {
              return (
                  <div key={index} className="text-[var(--accent)] font-orbitron text-[10px] tracking-[2px] border-b border-[var(--border)] mb-[8px] block">
                      {line}
                  </div>
              );
          }
          return <div key={index} className="font-mono text-[12px] text-[var(--text)] leading-[2] whitespace-pre-wrap">{line}</div>;
      });
  };

  return (
    <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(2,4,7,0.85)] backdrop-blur-[8px] opacity-0 transition-opacity duration-200"
        style={{ opacity: 1 }}
    >
      <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>

      <div
        className="relative w-full max-w-[760px] max-h-[88vh] bg-[var(--bg2)] border border-[var(--accent)] shadow-[var(--glow),_0_40px_80px_rgba(0,0,0,0.6),_inset_0_0_100px_rgba(0,212,255,0.02)] rounded-[var(--radius2)] flex flex-col z-10"
        style={{ animation: 'modal-in 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-[52px] px-[20px] border-b border-[var(--border)] bg-[linear-gradient(90deg,rgba(0,212,255,0.05),transparent)]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <h2 className="font-orbitron text-[12px] tracking-[3px] text-[var(--accent)] m-0">THREAT INTELLIGENCE REPORT</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-[9px] text-[var(--accent2)] border border-[var(--accent2)] px-[8px] py-[2px] tracking-[1px]">
              TOP SECRET // SENTINEL
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[var(--accent)] hover:text-white transition-colors">✕</button>
          </div>
        </div>

        {/* Metadata */}
        <div className="h-[36px] bg-[var(--bg3)] border-b border-[var(--border)] flex items-center px-5 font-mono text-[9px] text-[var(--text-dim)]">
          <span>Generated: {new Date().toLocaleTimeString()}</span>
          <span className="opacity-40 mx-2">//</span>
          <span>Threats: {state.stats.total}</span>
          <span className="opacity-40 mx-2">//</span>
          <span>Model: claude-sonnet-4-20250514</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-[24px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="flex flex-col items-center gap-2 text-[var(--accent)]">
                <div className="flex gap-1 mb-2">
                  <span style={{ animation: 'dot-pulse 1.4s infinite' }}>.</span>
                  <span style={{ animation: 'dot-pulse 1.4s infinite 0.2s' }}>.</span>
                  <span style={{ animation: 'dot-pulse 1.4s infinite 0.4s' }}>.</span>
                </div>
                <div className="font-orbitron text-[10px] tracking-[2px]">CLAUDE GENERATING INTELLIGENCE REPORT...</div>
              </div>
              <div className="flex flex-col gap-3 w-[60%]">
                 <div className="h-[12px] bg-[rgba(0,212,255,0.05)] rounded-[2px] w-full" style={{ animation: 'shimmer 2s infinite' }}></div>
                 <div className="h-[12px] bg-[rgba(0,212,255,0.05)] rounded-[2px] w-[90%]" style={{ animation: 'shimmer 2s infinite' }}></div>
                 <div className="h-[12px] bg-[rgba(0,212,255,0.05)] rounded-[2px] w-[95%]" style={{ animation: 'shimmer 2s infinite' }}></div>
                 <div className="h-[12px] bg-[rgba(0,212,255,0.05)] rounded-[2px] w-[70%]" style={{ animation: 'shimmer 2s infinite' }}></div>
                 <div className="h-[12px] bg-[rgba(0,212,255,0.05)] rounded-[2px] w-[85%]" style={{ animation: 'shimmer 2s infinite' }}></div>
                 <div className="h-[12px] bg-[rgba(0,212,255,0.05)] rounded-[2px] w-[40%]" style={{ animation: 'shimmer 2s infinite' }}></div>
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
               <div className="text-[var(--accent2)] font-orbitron text-[10px] tracking-[2px]">ERROR: {error}</div>
               <button onClick={generateReport} className="px-4 py-2 border border-[var(--accent)] text-[var(--accent)] font-orbitron text-[9px] hover:bg-[rgba(0,212,255,0.08)]">RETRY</button>
            </div>
          ) : (
            <div>{formatReport(reportText)}</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex h-[52px] p-[0_20px] items-center justify-between border-t border-[var(--border)] bg-[rgba(0,0,0,0.3)]">
          <div className="font-mono text-[9px] text-[var(--text-dim)]">SENTINEL INTELLIGENCE BRIEF // CONFIDENTIAL</div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="font-orbitron text-[10px] tracking-widest px-6 h-[28px] border border-[var(--text-dim)] text-[var(--text-dim)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              CLOSE
            </button>
            <button
              onClick={handleExport}
              disabled={loading || !!error || !reportText}
              className="font-orbitron text-[10px] tracking-widest px-6 h-[28px] border border-[var(--accent)] text-[var(--accent)] hover:bg-[rgba(0,212,255,0.08)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              EXPORT REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
