'use client';

import { useEffect, useRef } from 'react';
import Header from '../components/Header';
import ThreatTicker from '../components/ThreatTicker';
import LiveMetricsBar from '../components/LiveMetricsBar';
import StatCards from '../components/StatCards';
import ThreatFeed from '../components/ThreatFeed';
import AttackMap from '../components/AttackMap';
import AnalysisPanel from '../components/AnalysisPanel';
import ActionBar from '../components/ActionBar';
import NetworkHealthPanel from '../components/NetworkHealthPanel';
import AlertLog from '../components/AlertLog';
import ReportModal from '../components/ReportModal';
import Toast from '../components/Toast';
import { useSentinel } from '../lib/store';
import { generateRandomThreat } from '../lib/threats';

import { SentinelProvider } from '../lib/store';

function Dashboard() {
  const { dataset, setThreats, addThreat, setStats } = useSentinel();
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    // Initial 10 threats
    const initialThreats = Array.from({ length: 10 }).map(() => generateRandomThreat(dataset));

    // Compute initial stats based on the 10 loaded threats
    const initialStats = { critical: 0, high: 0, medium: 0, low: 0, healthy: 0, total: 10 };
    initialThreats.forEach(t => {
      if (t.sev !== 'healthy') {
        initialStats[t.sev]++;
      }
    });

    setThreats(initialThreats);
    setStats(initialStats);

    const interval = setInterval(() => {
      const newThreat = generateRandomThreat(dataset);
      addThreat(newThreat);
    }, 6000);

    return () => clearInterval(interval);
  }, [dataset, setThreats, addThreat, setStats]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch(e.key.toLowerCase()) {
        case 'a':
          // trigger analyze (requires exposing analyze function or simulating click)
          break;
        case 'r':
          window.dispatchEvent(new CustomEvent('open-report-modal'));
          break;
        case 's':
          // trigger send alert
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <Header />
      <ThreatTicker />
      <LiveMetricsBar />

      <div className="w-full shrink-0">
        <StatCards />
      </div>

      <div
        className="flex-1 grid gap-[1px] bg-[var(--border)] overflow-hidden"
        style={{ gridTemplateColumns: '280px 1fr 300px' }}
      >
        <ThreatFeed />

        <div className="flex flex-col overflow-hidden bg-[var(--bg2)]">
          <AttackMap />
          <AnalysisPanel />
          <ActionBar />
        </div>

        <div className="flex flex-col overflow-hidden">
          <NetworkHealthPanel />
          <AlertLog />
        </div>
      </div>

      <ReportModal />
      <Toast />
    </main>
  );
}

export default function Home() {
  return (
    <SentinelProvider>
      <Dashboard />
    </SentinelProvider>
  );
}
