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

export async function handleGetPipelineStatus(args: { branch?: string; status?: string }): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'octocat/Hello-World';

  if (token) {
    try {
      // Live integration with GitHub API
      const response = await fetch(`https://api.github.com/repos/${repo}/actions/runs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      const data = await response.json();
      const runs = data.workflow_runs || [];
      
      let filtered = runs;
      if (args.branch) {
        filtered = filtered.filter((r: any) => r.head_branch === args.branch);
      }
      if (args.status) {
        filtered = filtered.filter((r: any) => r.conclusion === args.status || r.status === args.status);
      }

      if (filtered.length === 0) {
        return `No pipeline runs found for ${repo}.`;
      }

      const summary = filtered.slice(0, 5).map((r: any) => 
        `[#${r.id}] ${r.name} | Branch: ${r.head_branch} | Status: ${r.status.toUpperCase()} | URL: ${r.html_url}`
      ).join('\n');
      
      return `Found ${filtered.length} live pipeline run(s) from GitHub:\n\n${summary}`;
    } catch (error) {
      return `Error fetching from GitHub API: ${error}`;
    }
  }

  // Fallback to mock data
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

  return `Found ${results.length} simulated pipeline run(s):\n\n${summary}`;
}
