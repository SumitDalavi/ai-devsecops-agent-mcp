import { handleGetPipelineStatus } from '../src/tools/pipeline.tool';
import { handleTriageVulnerabilities } from '../src/tools/vulnerability.tool';
import { handleSearchLogs } from '../src/tools/logs.tool';
import { handleScanDependencies } from '../src/tools/dependency.tool';
import { registerK8sIncidentTools, handleGetKubernetesEvents, handleGetPrometheusMetrics } from '../src/tools/kubernetes';
import { mockPipelineRuns, mockVulnerabilities, mockLogEntries, mockDependencyVulns } from '../src/data/mock-data';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

describe('MCP Agent Tools', () => {

  describe('Pipeline Tool', () => {
    it('should return all runs when no filters applied', () => {
      const result = handleGetPipelineStatus({});
      expect(result).toContain(`Found ${mockPipelineRuns.length} pipeline run(s)`);
    });

    it('should filter by branch', () => {
      const result = handleGetPipelineStatus({ branch: 'main' });
      expect(result).toContain('main');
    });

    it('should filter by status', () => {
      const result = handleGetPipelineStatus({ status: 'failure' });
      expect(result).toContain('FAILURE');
    });

    it('should return no runs message if none match', () => {
      const result = handleGetPipelineStatus({ branch: 'non-existent-branch' });
      expect(result).toEqual('No pipeline runs found matching the given filters.');
    });
  });

  describe('Vulnerability Tool', () => {
    it('should return all vulnerabilities when no filters applied', () => {
      const result = handleTriageVulnerabilities({});
      expect(result).toContain(`Found ${mockVulnerabilities.length} vulnerability(ies)`);
    });

    it('should filter by severity', () => {
      const result = handleTriageVulnerabilities({ severity: 'critical' });
      expect(result).toContain('CRITICAL');
    });

    it('should return no vulnerabilities message if none match', () => {
      const result = handleTriageVulnerabilities({ severity: 'unknown' });
      expect(result).toEqual('No vulnerabilities found matching the given filters.');
    });
  });

  describe('Logs Tool', () => {
    it('should return all logs when no filters applied', () => {
      const result = handleSearchLogs({});
      expect(result).toContain(`Found ${mockLogEntries.length} log entry(ies)`);
    });

    it('should filter by service', () => {
      const result = handleSearchLogs({ service: 'auth-service' });
      expect(result).toContain('auth-service');
    });

    it('should filter by keyword', () => {
      const result = handleSearchLogs({ keyword: 'token' });
      expect(result).toContain('token');
    });

    it('should return no logs message if none match', () => {
      const result = handleSearchLogs({ service: 'non-existent-service' });
      expect(result).toEqual('No log entries found matching the given filters.');
    });
  });

  describe('Dependency Tool', () => {
    it('should return all dependencies if no min severity', () => {
      const result = handleScanDependencies({});
      expect(result).toContain(`Dependency scan found ${mockDependencyVulns.length} vulnerable package(s)`);
    });

    it('should filter by min_severity', () => {
      const result = handleScanDependencies({ min_severity: 'high' });
      expect(result).toContain('HIGH');
    });

    it('should filter by min_severity (critical)', () => {
      const result = handleScanDependencies({ min_severity: 'critical' });
      expect(result).toContain('CRITICAL');
    });

    it('should return no issues message if none match', () => {
      // Temporarily clear the mock data to test the empty path
      const original = [...mockDependencyVulns];
      mockDependencyVulns.length = 0;
      const result = handleScanDependencies({});
      expect(result).toEqual('No vulnerable dependencies found above the given severity threshold.');
      mockDependencyVulns.push(...original);
    });
  });

  describe('Kubernetes Tools', () => {
    it('should register k8s tools', () => {
      const server = new McpServer({ name: 'test', version: '1.0' });
      server.tool = jest.fn();
      registerK8sIncidentTools(server);
      expect(server.tool).toHaveBeenCalledTimes(2);
    });

    it('should get events', async () => {
      const result = await handleGetKubernetesEvents({ namespace: 'default' });
      expect(result.content[0].text).toContain('default');
    });

    it('should get prometheus error rate', async () => {
      const result = await handleGetPrometheusMetrics({ service: 'api-server', metricType: 'error_rate' });
      expect(result.content[0].text).toContain('error_rate');
      expect(result.content[0].text).toContain('BREACHED');
    });

    it('should get prometheus memory', async () => {
      const result = await handleGetPrometheusMetrics({ service: 'api-server', metricType: 'memory' });
      expect(result.content[0].text).toContain('AT_LIMIT');
    });

    it('should get prometheus other metric', async () => {
      const result = await handleGetPrometheusMetrics({ service: 'api-server', metricType: 'cpu' });
      expect(result.content[0].text).toContain('api-server');
    });
  });
});
