import { mockDependencyVulns, DependencyVuln } from '../data/mock-data';

export const dependencyToolDefinition = {
  name: 'scan_dependencies',
  description: 'Scans project dependencies for known vulnerabilities. Optionally filter by minimum severity threshold.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      min_severity: {
        type: 'string',
        enum: ['critical', 'high', 'medium', 'low'],
        description: 'Minimum severity to report (default: all)'
      }
    }
  }
};

export function handleScanDependencies(args: { min_severity?: string }): string {
  const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  let results: DependencyVuln[] = [...mockDependencyVulns];

  if (args.min_severity) {
    const threshold = severityOrder[args.min_severity] ?? 3;
    results = results.filter(d => severityOrder[d.severity] <= threshold);
  }

  results.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  if (results.length === 0) {
    return 'No vulnerable dependencies found above the given severity threshold.';
  }

  const summary = results.map(d =>
    `${d.severity.toUpperCase()} — ${d.package_name}@${d.current_version}\n  Vulnerability: ${d.vulnerability}\n  Description: ${d.description}\n  Fix: Upgrade to ${d.fixed_in}`
  ).join('\n\n');

  return `Dependency scan found ${results.length} vulnerable package(s):\n\n${summary}`;
}
