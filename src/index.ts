import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { pipelineToolDefinition, handleGetPipelineStatus } from './tools/pipeline.tool.js';
import { vulnerabilityToolDefinition, handleTriageVulnerabilities } from './tools/vulnerability.tool.js';
import { logsToolDefinition, handleSearchLogs } from './tools/logs.tool.js';
import { dependencyToolDefinition, handleScanDependencies } from './tools/dependency.tool.js';
import { registerK8sIncidentTools } from './tools/kubernetes.js';

// ============================================================================
// MCP Server — AI-Assisted DevSecOps Agent
// Exposes security-critical tools to any MCP-compatible LLM client.
// ============================================================================

const server = new McpServer({
  name: 'devsecops-agent',
  version: '1.0.0',
});

// --- Register Tools ---

server.tool(
  pipelineToolDefinition.name,
  pipelineToolDefinition.description,
  {
    branch: z.string().optional().describe('Filter by branch name (e.g., "main")'),
    status: z.enum(['success', 'failure', 'in_progress', 'queued']).optional().describe('Filter by pipeline status')
  } as any,
  async (args: any) => ({
    content: [{ type: 'text' as const, text: handleGetPipelineStatus(args) }]
  })
);

server.tool(
  vulnerabilityToolDefinition.name,
  vulnerabilityToolDefinition.description,
  {
    severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional().describe('Filter by minimum severity level'),
    status: z.enum(['open', 'resolved', 'ignored']).optional().describe('Filter by vulnerability status')
  } as any,
  async (args: any) => ({
    content: [{ type: 'text' as const, text: handleTriageVulnerabilities(args) }]
  })
);

server.tool(
  logsToolDefinition.name,
  logsToolDefinition.description,
  {
    service: z.string().optional().describe('Filter by service name'),
    level: z.enum(['INFO', 'WARN', 'ERROR', 'DEBUG']).optional().describe('Filter by minimum log level'),
    keyword: z.string().optional().describe('Search keyword in log message')
  } as any,
  async (args: any) => ({
    content: [{ type: 'text' as const, text: handleSearchLogs(args) }]
  })
);

server.tool(
  dependencyToolDefinition.name,
  dependencyToolDefinition.description,
  {
    min_severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional().describe('Filter dependencies with vulnerabilities above this severity')
  } as any,
  async (args: any) => ({
    content: [{ type: 'text' as const, text: handleScanDependencies(args) }]
  })
);

// Register the new SRE Incident tools
registerK8sIncidentTools(server);

// --- Start Server ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DevSecOps MCP Agent running on stdio');
}

main().catch(console.error);
