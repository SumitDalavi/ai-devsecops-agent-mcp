import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

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
  pipelineToolDefinition.inputSchema.properties,
  async (args: { branch?: string; status?: string }) => ({
    content: [{ type: 'text' as const, text: handleGetPipelineStatus(args) }]
  })
);

server.tool(
  vulnerabilityToolDefinition.name,
  vulnerabilityToolDefinition.description,
  vulnerabilityToolDefinition.inputSchema.properties,
  async (args: { severity?: string; status?: string }) => ({
    content: [{ type: 'text' as const, text: handleTriageVulnerabilities(args) }]
  })
);

server.tool(
  logsToolDefinition.name,
  logsToolDefinition.description,
  logsToolDefinition.inputSchema.properties,
  async (args: { service?: string; level?: string; keyword?: string }) => ({
    content: [{ type: 'text' as const, text: handleSearchLogs(args) }]
  })
);

server.tool(
  dependencyToolDefinition.name,
  dependencyToolDefinition.description,
  dependencyToolDefinition.inputSchema.properties,
  async (args: { min_severity?: string }) => ({
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
