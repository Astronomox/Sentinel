import { Threat, Severity } from '../types'
import { v4 as uuidv4 } from 'uuid'

export const mockThreats = [
  { name: 'Ransomware Deployment', sev: 'critical' as Severity, sources: ['192.168.1.1', '10.0.0.5'] },
  { name: 'SQL Injection', sev: 'high' as Severity, sources: ['172.16.0.4'] },
  { name: 'C2 Beacon', sev: 'critical' as Severity, sources: ['45.33.32.156', '8.8.8.8'] },
  { name: 'Brute Force SSH', sev: 'medium' as Severity, sources: ['10.10.10.10', '192.168.1.5'] },
  { name: 'Lateral Movement', sev: 'high' as Severity, sources: ['10.0.0.8'] },
  { name: 'Phishing Campaign', sev: 'medium' as Severity, sources: ['email-srv-1'] },
  { name: 'Zero-Day Exploit', sev: 'critical' as Severity, sources: ['Unknown'] },
  { name: 'DDoS Attack', sev: 'high' as Severity, sources: ['Botnet-A', 'Botnet-B'] },
  { name: 'Data Exfiltration', sev: 'critical' as Severity, sources: ['10.0.0.12', '192.168.1.100'] },
  { name: 'Unauthorized Access', sev: 'medium' as Severity, sources: ['VPN-Gate'] },
  { name: 'Malware Download', sev: 'high' as Severity, sources: ['10.0.1.20'] },
  { name: 'Suspicious Login', sev: 'low' as Severity, sources: ['192.168.2.50'] },
  { name: 'Port Scan', sev: 'low' as Severity, sources: ['10.0.0.254'] },
  { name: 'Privilege Escalation', sev: 'high' as Severity, sources: ['10.0.0.5'] },
  { name: 'DNS Spoofing', sev: 'medium' as Severity, sources: ['192.168.1.253'] }
]

export const generateRandomThreat = (sourceDataset = mockThreats): Threat => {
  const random = sourceDataset[Math.floor(Math.random() * sourceDataset.length)]
  return {
    ...random,
    id: uuidv4(),
    timestamp: new Date().toISOString()
  }
}
