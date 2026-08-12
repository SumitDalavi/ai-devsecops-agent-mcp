import { mockPipelineRuns, PipelineRun } from '../data/mock-data';

export const pipelineToolDefinition = {
  name: 'get_pipeline_status',
  description: 'Fetches the status of recent CI/CD pipeline runs from GitHub Actions. Optionally filter by branch or status.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      branch: {
        type: 'string',
        description: 'Filter by branch name (e.g., "main", "feature/auth-refactor")'
      },
      status: {
        type: 'string',
        enum: ['success', 'failure', 'in_progress', 'queued'],
        description: 'Filter by pipeline status'
      }
    }
  }
};

export function handleGetPipelineStatus(args: { branch?: string; status?: string }): string {
  let results: PipelineRun[] = [...mockPipelineRuns];

  if (args.branch) {
    results = results.filter(r => r.branch.toLowerCase().includes(args.branch!.toLowerCase()));
  }
  if (args.status) {
    results = results.filter(r => r.status === args.status);
  }

  if (results.length === 0) {
    return 'No pipeline runs found matching the given filters.';
  }

  const summary = results.map(r => 
    `[#${r.id}] ${r.name} | Branch: ${r.branch} | Status: ${r.status.toUpperCase()} | Commit: ${r.commit_sha} | Duration: ${r.duration_seconds}s | Trigger: ${r.triggered_by}`
  ).join('\n');

  return `Found ${results.length} pipeline run(s):\n\n${summary}`;
}
