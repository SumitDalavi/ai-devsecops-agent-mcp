# Runbook — ai-devsecops-agent-mcp
> Last updated: 2026-08-29

## Prerequisites
| Tool | Required Version | How to check |
|---|---|---|
| Node.js | >= 20 | `node -v` |

## Quick Start
```bash
# Install dependencies
npm install

# Build
npm run build

# Start server
npm run start
```

## Run Tests
```bash
# Unit tests
npm test
```

Expected output:
```
PASS  tests/pipeline.test.ts
```

## Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| GITHUB_TOKEN | - | Required to hit real GitHub API for pipelines |
| GITHUB_REPO | `octocat/Hello-World` | Target repo for pipeline checks |

## Common Failure Modes
| Symptom | Cause | Fix |
|---|---|---|
| Server exits immediately | Not connected to an MCP client | Run via an MCP client (e.g. Claude Desktop) |
| Missing live data | `GITHUB_TOKEN` not set | Provide token to use live API mode |
