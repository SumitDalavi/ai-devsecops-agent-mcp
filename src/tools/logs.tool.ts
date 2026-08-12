import { mockLogEntries, LogEntry } from '../data/mock-data';

export const logsToolDefinition = {
  name: 'search_logs',
  description: 'Searches application logs by service name, log level, or keyword. Returns matching log entries with timestamps and trace IDs.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      service: {
        type: 'string',
        description: 'Filter by service name (e.g., "api-gateway", "payment-service")'
      },
      level: {
        type: 'string',
        enum: ['error', 'warn', 'info', 'debug'],
        description: 'Filter by log level'
      },
      keyword: {
        type: 'string',
        description: 'Search for a keyword in the log message'
      }
    }
  }
};

export function handleSearchLogs(args: { service?: string; level?: string; keyword?: string }): string {
  let results: LogEntry[] = [...mockLogEntries];

  if (args.service) {
    results = results.filter(l => l.service.toLowerCase().includes(args.service!.toLowerCase()));
  }
  if (args.level) {
    results = results.filter(l => l.level === args.level);
  }
  if (args.keyword) {
    results = results.filter(l => l.message.toLowerCase().includes(args.keyword!.toLowerCase()));
  }

  if (results.length === 0) {
    return 'No log entries found matching the given filters.';
  }

  const summary = results.map(l =>
    `[${l.timestamp}] ${l.level.toUpperCase()} [${l.service}] ${l.message}${l.trace_id ? ` (trace: ${l.trace_id})` : ''}`
  ).join('\n');

  return `Found ${results.length} log entry(ies):\n\n${summary}`;
}
