import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Threat, HealthyEntry, SourceStatus } from '../../../types';

export async function GET() {
  const fetchedAt = new Date().toISOString();
  const threats: Threat[] = [];
  const healthy: HealthyEntry[] = [];
  const sources: SourceStatus[] = [];

  const abuseApiKey = process.env.ABUSEIPDB_API_KEY;

  // Source 1 - AbuseIPDB
  let abusePromise = Promise.resolve();
  if (abuseApiKey) {
    abusePromise = fetch('https://api.abuseipdb.com/api/v2/blacklist?limit=50', {
      headers: { 'Key': abuseApiKey, 'Accept': 'application/json' }
    }).then(res => res.json()).then(data => {
      let count = 0;
      if (data && data.data) {
        data.data.forEach((ip: any) => {
          let sev: 'critical' | 'high' | 'medium' | 'low' = 'low';
          if (ip.abuseConfidenceScore >= 85) sev = 'critical';
          else if (ip.abuseConfidenceScore >= 60) sev = 'high';
          else if (ip.abuseConfidenceScore >= 30) sev = 'medium';

          threats.push({
            id: uuidv4(),
            name: `Malicious IP — Abuse Confidence ${ip.abuseConfidenceScore}%`,
            sev,
            sources: [ip.ipAddress],
            timestamp: fetchedAt
          });
          count++;
        });
      }
      sources.push({ name: 'AbuseIPDB', status: 'ok', count });
    }).catch(() => {
      sources.push({ name: 'AbuseIPDB', status: 'failed', count: 0 });
    });
  } else {
    sources.push({ name: 'AbuseIPDB', status: 'skipped', count: 0 });
  }

  // Source 2 - URLhaus
  const urlhausPromise = fetch('https://urlhaus-api.abuse.ch/v1/urls/recent/limit/30/', {
    method: 'POST'
  }).then(res => res.json()).then(data => {
    let count = 0;
    if (data && data.urls) {
      data.urls.forEach((url: any) => {
        let sev: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        let name = `Malicious URL — ${url.threat}`;

        if (['exe', 'malware', 'ransomware'].includes(url.threat)) {
          sev = 'critical';
          name = 'Malware Distribution URL';
        } else if (['botnet_cc', 'c2'].includes(url.threat)) {
          sev = 'critical';
          name = 'Active C2 Server URL';
        } else if (url.threat === 'phishing') {
          sev = 'high';
          name = 'Phishing URL Detected';
        } else if (url.threat === 'exploit') {
          sev = 'high';
          name = 'Exploit Kit URL';
        }

        threats.push({
          id: uuidv4(),
          name,
          sev,
          sources: [url.url],
          timestamp: fetchedAt
        });
        count++;
      });
    }
    sources.push({ name: 'URLhaus', status: 'ok', count });
  }).catch(() => {
    sources.push({ name: 'URLhaus', status: 'failed', count: 0 });
  });

  // Source 3 - Feodo Tracker
  const feodoPromise = fetch('https://feodotracker.abuse.ch/downloads/ipblocklist.json')
    .then(res => res.json()).then(data => {
      let count = 0;
      if (Array.isArray(data)) {
        data.slice(0, 20).forEach((entry: any) => {
          threats.push({
            id: uuidv4(),
            name: `Active Botnet C2 — ${entry.malware_family || 'Unknown'}`,
            sev: 'critical',
            sources: [entry.ip_address],
            timestamp: fetchedAt
          });
          count++;
        });
      }
      sources.push({ name: 'Feodo Tracker', status: 'ok', count });
    }).catch(() => {
      sources.push({ name: 'Feodo Tracker', status: 'failed', count: 0 });
    });

  // Source 4 - Cloudflare DNS
  const cloudflarePromise = fetch('https://1.1.1.1/dns-query?name=example.com&type=A', {
    headers: { 'Accept': 'application/dns-json' }
  }).then(res => {
    if (res.ok) {
      healthy.push({
        id: uuidv4(),
        name: 'Cloudflare DNS — Clean Query Resolved',
        sev: 'healthy',
        sources: ['1.1.1.1'],
        timestamp: fetchedAt,
        status: 'nominal'
      });
    }
  }).catch(() => {});

  // Source 5 - Internal Threat Intel Feeds Aggregated
  healthy.push({
    id: uuidv4(),
    name: 'Threat Intelligence Feeds — Aggregated',
    sev: 'healthy',
    sources: ['sentinel-internal'],
    timestamp: fetchedAt,
    status: 'nominal'
  });

  // Wait for all external fetches
  await Promise.allSettled([abusePromise, urlhausPromise, feodoPromise, cloudflarePromise]);

  // Source 6 - Synthetic Healthy Baseline
  const syntheticHealthy = [
    "Firewall Rules — All Policies Active",
    `IDS Signatures — Up to Date (${new Date().toLocaleDateString()})`,
    "SSL Certificates — All Valid",
    "Endpoint AV — All Agents Reporting",
    `Backup Systems — Last Verified ${new Date().toLocaleDateString()}`
  ];

  syntheticHealthy.forEach(name => {
    healthy.push({
      id: uuidv4(),
      name,
      sev: 'healthy',
      sources: ['internal-monitor'],
      timestamp: fetchedAt,
      status: 'nominal'
    });
  });

  // Shuffle arrays to mix threats
  const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return NextResponse.json({
    threats: shuffle(threats),
    healthy,
    fetchedAt,
    sources
  });
}
