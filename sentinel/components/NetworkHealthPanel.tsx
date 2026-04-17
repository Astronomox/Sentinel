'use client';

import { useSentinel } from '../lib/store';

export default function NetworkHealthPanel() {
  const { state } = useSentinel();

  // Determine active/inactive statuses
  const fireActive = true;
  const idsActive = true;
  const endpointsActive = 8;
  const sslValid = true;
  const anyFeedFailed = state.sources.some(s => s.status === 'failed');

  return (
    <div className="flex flex-col h-[140px] bg-[var(--bg2)] border-l border-[var(--border)] border-b overflow-hidden">
      <div className="flex items-center p-3 border-b border-[var(--border)]">
        <h2 className="font-orbitron text-[9px] tracking-[3px] text-[var(--accent)] uppercase m-0">NETWORK HEALTH</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 font-mono text-[9px]">
        {/* FIREWALL */}
        <div className="flex items-center gap-2">
            <div className="w-[80px] text-[var(--text-dim)]">FIREWALL</div>
            <div className="flex w-[80px] h-[4px] bg-[var(--bg3)] rounded">
                <div className="h-full bg-[var(--green)] w-full rounded"></div>
            </div>
            <div className="text-[var(--green)] ml-2">ACTIVE</div>
        </div>

        {/* IDS/IPS */}
        <div className="flex items-center gap-2">
            <div className="w-[80px] text-[var(--text-dim)]">IDS/IPS</div>
            <div className="flex w-[80px] h-[4px] bg-[var(--bg3)] rounded">
                <div className="h-full bg-[var(--green)] w-full rounded"></div>
            </div>
            <div className="text-[var(--green)] ml-2">ACTIVE</div>
        </div>

        {/* ENDPOINTS */}
        <div className="flex items-center gap-2">
            <div className="w-[80px] text-[var(--text-dim)]">ENDPOINTS</div>
            <div className="flex w-[80px] h-[4px] bg-[var(--bg3)] rounded">
                <div className="h-full bg-[var(--accent3)] w-[80%] rounded"></div>
            </div>
            <div className="text-[var(--accent3)] ml-2">8/10</div>
        </div>

        {/* SSL CERTS */}
        <div className="flex items-center gap-2">
            <div className="w-[80px] text-[var(--text-dim)]">SSL CERTS</div>
            <div className="flex w-[80px] h-[4px] bg-[var(--bg3)] rounded">
                <div className="h-full bg-[var(--green)] w-full rounded"></div>
            </div>
            <div className="text-[var(--green)] ml-2">VALID</div>
        </div>

        {/* FEED STATUS */}
        <div className="flex items-center gap-2">
            <div className="w-[80px] text-[var(--text-dim)]">FEED STATUS</div>
            <div className="flex w-[80px] h-[4px] bg-[var(--bg3)] rounded">
                <div className="h-full w-[40%] rounded" style={{ backgroundColor: anyFeedFailed ? 'var(--accent3)' : 'var(--green)' }}></div>
            </div>
            <div className="ml-2" style={{ color: anyFeedFailed ? 'var(--accent3)' : 'var(--green)' }}>
                {anyFeedFailed ? 'PARTIAL' : 'NOMINAL'}
            </div>
        </div>
      </div>
    </div>
  );
}
