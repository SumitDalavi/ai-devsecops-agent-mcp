// ============================================================================
// Mock Data Layer
// Simulates responses from GitHub Actions, Jira, and logging services.
// In production, these would be replaced with real API calls.
// ============================================================================

export interface PipelineRun {
  id: number;
  name: string;
  status: 'success' | 'failure' | 'in_progress' | 'queued';
  branch: string;
  commit_sha: string;
  started_at: string;
  duration_seconds: number;
  triggered_by: string;
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cve_id: string;
  package_name: string;
  affected_version: string;
  fixed_version: string;
  status: 'open' | 'in_progress' | 'resolved' | 'wont_fix';
  assigned_to: string;
  discovered_at: string;
}

export interface LogEntry {
  timestamp: string;
  service: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  trace_id?: string;
}

export interface DependencyVuln {
  package_name: string;
  current_version: string;
  vulnerability: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  fixed_in: string;
  description: string;
}

// --- Pipeline Data ---
export const mockPipelineRuns: PipelineRun[] = [
  {
    id: 1042,
    name: 'Build & Test',
    status: 'success',
    branch: 'main',
    commit_sha: 'a1b2c3d',
    started_at: '2026-08-12T09:30:00Z',
    duration_seconds: 245,
    triggered_by: 'push'
  },
  {
    id: 1043,
    name: 'Security Scan',
    status: 'failure',
    branch: 'feature/auth-refactor',
    commit_sha: 'e4f5g6h',
    started_at: '2026-08-12T10:15:00Z',
    duration_seconds: 182,
    triggered_by: 'pull_request'
  },
  {
    id: 1044,
    name: 'Deploy to Staging',
    status: 'in_progress',
    branch: 'main',
    commit_sha: 'a1b2c3d',
    started_at: '2026-08-12T10:45:00Z',
    duration_seconds: 0,
    triggered_by: 'workflow_dispatch'
  },
  {
    id: 1045,
    name: 'Build & Test',
    status: 'failure',
    branch: 'fix/memory-leak',
    commit_sha: 'i7j8k9l',
    started_at: '2026-08-12T11:00:00Z',
    duration_seconds: 98,
    triggered_by: 'push'
  }
];

// --- Vulnerability Board ---
export const mockVulnerabilities: Vulnerability[] = [
  {
    id: 'VULN-001',
    title: 'Remote Code Execution in express',
    severity: 'critical',
    cve_id: 'CVE-2026-4271',
    package_name: 'express',
    affected_version: '4.17.1',
    fixed_version: '4.19.0',
    status: 'open',
    assigned_to: 'security-team',
    discovered_at: '2026-08-10T08:00:00Z'
  },
  {
    id: 'VULN-002',
    title: 'Prototype Pollution in lodash',
    severity: 'high',
    cve_id: 'CVE-2026-3188',
    package_name: 'lodash',
    affected_version: '4.17.20',
    fixed_version: '4.17.22',
    status: 'in_progress',
    assigned_to: 'dev-team',
    discovered_at: '2026-08-09T14:00:00Z'
  },
  {
    id: 'VULN-003',
    title: 'SQL Injection in pg driver',
    severity: 'critical',
    cve_id: 'CVE-2026-5512',
    package_name: 'pg',
    affected_version: '8.7.1',
    fixed_version: '8.11.0',
    status: 'open',
    assigned_to: 'unassigned',
    discovered_at: '2026-08-11T16:00:00Z'
  },
  {
    id: 'VULN-004',
    title: 'Cross-Site Scripting in sanitize-html',
    severity: 'medium',
    cve_id: 'CVE-2026-2099',
    package_name: 'sanitize-html',
    affected_version: '2.7.0',
    fixed_version: '2.8.1',
    status: 'resolved',
    assigned_to: 'frontend-team',
    discovered_at: '2026-08-05T10:00:00Z'
  },
  {
    id: 'VULN-005',
    title: 'Denial of Service in ws',
    severity: 'high',
    cve_id: 'CVE-2026-6789',
    package_name: 'ws',
    affected_version: '7.5.9',
    fixed_version: '8.0.0',
    status: 'open',
    assigned_to: 'backend-team',
    discovered_at: '2026-08-12T06:00:00Z'
  }
];

// --- Application Logs ---
export const mockLogEntries: LogEntry[] = [
  { timestamp: '2026-08-12T10:15:32Z', service: 'api-gateway', level: 'error', message: 'Connection refused to upstream service payment-service:3000', trace_id: 'trace-abc-123' },
  { timestamp: '2026-08-12T10:15:33Z', service: 'payment-service', level: 'error', message: 'FATAL: database connection pool exhausted, 0 connections available', trace_id: 'trace-abc-123' },
  { timestamp: '2026-08-12T10:15:34Z', service: 'auth-service', level: 'warn', message: 'JWT token validation latency exceeded 500ms threshold', trace_id: 'trace-def-456' },
  { timestamp: '2026-08-12T10:16:00Z', service: 'api-gateway', level: 'error', message: 'Circuit breaker OPEN for payment-service after 5 consecutive failures', trace_id: 'trace-ghi-789' },
  { timestamp: '2026-08-12T10:16:15Z', service: 'notification-service', level: 'warn', message: 'Email delivery queue depth exceeds 1000, potential backpressure', trace_id: 'trace-jkl-012' },
  { timestamp: '2026-08-12T10:17:00Z', service: 'payment-service', level: 'info', message: 'Database connection pool recovered, 5 connections available' },
  { timestamp: '2026-08-12T10:17:30Z', service: 'api-gateway', level: 'info', message: 'Circuit breaker HALF-OPEN for payment-service, testing recovery' },
  { timestamp: '2026-08-12T10:18:00Z', service: 'user-service', level: 'error', message: 'Unhandled promise rejection: Cannot read properties of null (reading "id")', trace_id: 'trace-mno-345' },
  { timestamp: '2026-08-12T10:18:30Z', service: 'auth-service', level: 'error', message: 'Rate limit exceeded for IP 192.168.1.105 — possible brute-force attempt', trace_id: 'trace-pqr-678' }
];

// --- Dependency Scan Results ---
export const mockDependencyVulns: DependencyVuln[] = [
  {
    package_name: 'jsonwebtoken',
    current_version: '8.5.1',
    vulnerability: 'CVE-2026-1234',
    severity: 'high',
    fixed_in: '9.0.0',
    description: 'Algorithm confusion attack allows token forgery when using asymmetric keys'
  },
  {
    package_name: 'axios',
    current_version: '0.21.1',
    vulnerability: 'CVE-2026-2345',
    severity: 'critical',
    fixed_in: '1.6.0',
    description: 'Server-Side Request Forgery (SSRF) via crafted URL redirect'
  },
  {
    package_name: 'moment',
    current_version: '2.29.1',
    vulnerability: 'CVE-2022-31129',
    severity: 'medium',
    fixed_in: '2.29.4',
    description: 'ReDoS vulnerability in string parsing'
  }
];
