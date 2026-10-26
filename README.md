# AI-Assisted DevSecOps Agent — MCP Server 🤖🔒

[![CI Pipeline](https://github.com/SumitDalavi/ai-devsecops-agent-mcp/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/SumitDalavi/ai-devsecops-agent-mcp/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/SumitDalavi/ai-devsecops-agent-mcp?color=0969da&label=release&logo=github)](https://github.com/SumitDalavi/ai-devsecops-agent-mcp/releases)
[![Release Workflow](https://github.com/SumitDalavi/ai-devsecops-agent-mcp/actions/workflows/release.yml/badge.svg)](https://github.com/SumitDalavi/ai-devsecops-agent-mcp/actions/workflows/release.yml)
[![GHCR Container](https://img.shields.io/badge/ghcr.io-v0.2.0-blue?logo=docker&logoColor=white)](https://github.com/SumitDalavi/ai-devsecops-agent-mcp/pkgs/container/ai-devsecops-agent-mcp)
[![npm package](https://img.shields.io/badge/npm-%40sumitdalavi-cb3837?logo=npm&logoColor=white)](https://github.com/SumitDalavi/ai-devsecops-agent-mcp/packages)
[![AI DevSecOps Agent MCP Server MCP server – quality and maintenance score on Glama](https://glama.ai/mcp/servers/SumitDalavi/ai-devsecops-agent-mcp/badges/score.svg)](https://glama.ai/mcp/servers/SumitDalavi/ai-devsecops-agent-mcp)
[![Smithery](https://img.shields.io/badge/Smithery-verified-orange)](https://smithery.ai)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![SBOM](https://img.shields.io/badge/SBOM-SPDX%202.3-blueviolet?logo=spdx)](https://github.com/SumitDalavi/ai-devsecops-agent-mcp/releases/tag/v0.2.0)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> An MCP (Model Context Protocol) server exposing DevSecOps tooling to LLM clients.

> **⚡ Progressive Execution:** Supports zero-config simulation by default (Tier 1) and seamlessly promotes to live GitHub Actions and Kubernetes integrations when credentials are provided (Tier 2/3). See [Execution Tiers](#-progressive-credential-loading--execution-tiers).

## The Problem

DevSecOps teams drown in context-switching: checking pipeline status in one tab, triaging vulnerabilities in another, searching logs in a third. Meanwhile, LLM coding assistants can write code but are blind to your operational reality — they can't see your failing builds, open CVEs, or production errors.

## The Solution

This MCP server bridges the gap by exposing **six security-critical tools** to any MCP-compatible LLM client (GitHub Copilot, Claude Desktop, Cursor, etc.):

| Tool | What It Does |
|------|-------------|
| `get_pipeline_status` | Fetches CI/CD pipeline runs from GitHub Actions |
| `triage_vulnerabilities` | Queries a vulnerability board and returns severity-ranked CVEs |
| `search_logs` | Searches application logs by service, severity, and time range |
| `scan_dependencies` | Analyzes a `package.json` or `requirements.txt` for known vulnerabilities |
| `get-kubernetes-events` | Fetches recent K8s events for incident correlation (OOMKills, scheduling failures) |
| `get-sre-incident-correlation` | Correlates SRE incidents across pipeline, vulnerability, and runtime data |

## Why This Over the Obvious Alternative

Most "AI + DevOps" demos are chatbots with hardcoded responses. This project implements the **Model Context Protocol (MCP)** — the open standard for tool-use that GitHub Copilot, Claude, and other major LLM clients natively support. The tools return real, structured data that the LLM reasons over, not canned answers.

## Architecture

```
┌─────────────────┐     MCP (stdio/SSE)     ┌────────────────────────┐
│  LLM Client     │◄───────────────────────►│  MCP Server            │
│  (Copilot,      │                         │                        │
│   Claude, etc.) │                         │  ┌──────────────────┐  │
│                 │                         │  │ Pipeline Tool    │  │
│                 │                         │  │ Vuln Triage Tool │  │
│                 │                         │  │ Log Search Tool  │  │
│                 │                         │  │ Dep Scan Tool    │  │
│                 │                         │  │ K8s Events Tool  │  │
│                 │                         │  │ SRE Incident Tool│  │
│                 │                         │  └──────────────────┘  │
└─────────────────┘                         └────────────────────────┘
                                                         │
                                                 ┌───────┴───────┐
                                                 │  Mock Data    │
                                                 │  (Simulated   │
                                                 │   APIs)       │
                                                 └───────────────┘
```

## 🛠️ Tech Stack

- **Runtime**: Node.js + TypeScript
- **Protocol**: Model Context Protocol (MCP) SDK
- **Transport**: stdio (local) and SSE (remote)
- **Containerization**: Docker

## 🚀 Getting Started

### Local Development
```bash
npm install
npm run build
npm run start
```

### With Docker
```bash
docker-compose up -d --build
```

### Connecting to Claude Desktop & MCP Clients

#### Option 1 — Direct Configuration (`claude_desktop_config.json` or `.mcp.json`)
Add to your Claude Desktop or Cursor configuration:
```json
{
  "mcpServers": {
    "ai-devsecops-agent-mcp": {
      "command": "node",
      "args": ["dist/index.js"]
    }
  }
}
```

#### Option 2 — 1-Click Installation via Smithery.ai
This server includes a verified `smithery.yaml` configuration for automated installation:
```bash
npx -y @smithery/cli install ai-devsecops-agent-mcp --client claude
```

#### Option 3 — Glama.ai Registry Manifest

[![AI DevSecOps Agent MCP Server MCP server – quality and maintenance score on Glama](https://glama.ai/mcp/servers/SumitDalavi/ai-devsecops-agent-mcp/badges/card.svg)](https://glama.ai/mcp/servers/SumitDalavi/ai-devsecops-agent-mcp)

This repository provides a standardized `glama.json` manifest conforming to `https://glama.ai/mcp/schemas/server.json` for directory indexing, tool inspection, and ownership claiming on the [Glama.ai MCP Registry](https://glama.ai/mcp/servers/SumitDalavi/ai-devsecops-agent-mcp).

## 📁 Project Structure

```
src/
├── index.ts              # MCP Server entry point
├── tools/
│   ├── pipeline.tool.ts  # GitHub Actions pipeline status
│   ├── vulnerability.tool.ts  # CVE triage from mock board
│   ├── logs.tool.ts      # Log search across services
│   └── dependency.tool.ts # Dependency vulnerability scanning
└── data/
    └── mock-data.ts      # Simulated API responses
```

## Decision Log

| Decision | Rationale |
|----------|-----------|
| MCP over REST API | MCP is the emerging standard for LLM tool-use; REST would require custom integration per client |
| TypeScript over Python | Aligns with existing TypeScript expertise; MCP TS SDK is mature |
| Mock data layer | Keeps the PoC self-contained without requiring real GitHub/Jira API keys |
| stdio transport | Default for local MCP; SSE available for remote deployment |

## 📋 Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | >= 20.x | Runtime |
| [npm](https://www.npmjs.com/) | >= 10.x | Package manager |
| [Docker](https://www.docker.com/) | >= 24.x | Containerization (optional) |
| MCP Client | Any | Claude Desktop, GitHub Copilot, Cursor, etc. |

## 🚀 Step-by-Step Setup

### Option A: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/SumitDalavi/ai-devsecops-agent-mcp.git
cd ai-devsecops-agent-mcp

# 2. Install dependencies
npm install

# 3. Build the TypeScript project
npm run build

# 4. Start the MCP server (stdio transport)
npm run start
```

### Option B: Docker

```bash
# 1. Clone and build
git clone https://github.com/SumitDalavi/ai-devsecops-agent-mcp.git
cd ai-devsecops-agent-mcp

# 2. Build and run
docker build -t devsecops-mcp-agent .
docker run -i devsecops-mcp-agent
```

### Connecting to Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "ai-devsecops-agent-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/ai-devsecops-agent-mcp/dist/index.js"]
    }
  }
}
```

## 🧪 Usage & Demo

Once connected to an MCP client, you can ask natural language questions like:

| Prompt | Tool Invoked |
|--------|-------------|
| "Show me the latest pipeline runs" | `get_pipeline_status` |
| "Are there any critical vulnerabilities?" | `triage_vulnerabilities` |
| "Search for error logs in the payment service" | `search_logs` |
| "Scan dependencies for known CVEs" | `scan_dependencies` |
| "Show me Kubernetes events in production" | `get-kubernetes-events` |
| "Check for active incidents" | `get-sre-incident-correlation` |

The server returns structured JSON data that the LLM reasons over to provide contextual answers.

## ✅ Verification

```bash
# Verify the build succeeds
npm run build

# Verify the server starts (it will wait for MCP client connection on stdio)
node dist/index.js
# You should see: "DevSecOps MCP Agent running on stdio" on stderr
```

## Mock Boundaries (Honest Scope)

| What | Status | Details |
|---|---|---|
| MCP Protocol | **Real** | Full Model Context Protocol implementation (stdio). |
| GitHub Actions Integration | **Real** | `get_pipeline_status` hits live GitHub API if `GITHUB_TOKEN` is set. |
| Other Tools | **Mocked** | Jira/Log tools return simulated JSON data. |

## 🚀 Progressive Credential Loading & Execution Tiers

This project implements **Progressive Credential Loading (PCL)**, allowing it to run immediately out-of-the-box without external dependencies while seamlessly upgrading as credentials are provided.

### Tier 1: Zero-Config Mock Mode (Default)
Ideal for CI, testing, and rapid local evaluation.
- **Execution:** Run with default configuration (`cp .env.example .env`). Zero API keys, databases, or cloud credentials required.
- **Fallback Behavior:** In-memory caches, deterministic offline heuristics, mock vector embeddings, and local mock storage are automatically used.
- **Health Verification:** Endpoints report `{"mode": "mock"}` for unconfigured dependencies.

### Tier 2: Local Development with Live Services
Connect specific external services while keeping others mocked.
- **Execution:** Provide credentials in `.env` for the services you want active (e.g., `GITHUB_TOKEN, GITHUB_REPO, KUBECONFIG`).
- **Progressive Upgrade:** The runtime inspects environment variables on boot and dynamically promotes only configured modules to live mode.
- **Safe Fallback:** Any missing credentials automatically remain on mock fallbacks with no crashes or missing service errors.

### Tier 3: Production Hardened
Enterprise deployment with production-grade backends, security scans, and container distributions.
- **OCI Container Image:** Pre-built, multi-arch image on GitHub Container Registry:
  ```bash
  docker pull ghcr.io/sumitdalavi/ai-devsecops-agent-mcp:v0.2.0
  ```
- **Production Orchestration:** Mount secrets via Kubernetes Secrets or cloud secret managers with atomic config reload support.
- **Release Verification:** Checksums and SPDX SBOM available on [GitHub Releases](https://github.com/SumitDalavi/ai-devsecops-agent-mcp/releases).

## 🔒 Release & Security Verification

Every tagged release (`v*.*.*`) triggers an automated DevSecOps release workflow:
1. **Automated Testing:** Runs test suite gates before build.
2. **Container Image Build:** Builds production container image (`ghcr.io/sumitdalavi/ai-devsecops-agent-mcp:<tag>`).
3. **Vulnerability Scanning:** Scans the image using [Aqua Security Trivy](https://github.com/aquasecurity/trivy-action) for `HIGH` and `CRITICAL` CVEs.
4. **SBOM Generation:** Generates a Software Bill of Materials (SBOM) in SPDX JSON format (`sbom.spdx.json`) using [Anchore Syft](https://github.com/anchore/sbom-action).
5. **GitHub Release Publishing:** Packages release notes and attaches `sbom.spdx.json` as a verifiable supply-chain asset.

### Verifying Releases via GitHub CLI
```bash
# View release details
gh release view v0.2.0 --repo SumitDalavi/ai-devsecops-agent-mcp

# Download and verify SBOM
gh release download v0.2.0 --repo SumitDalavi/ai-devsecops-agent-mcp --pattern "sbom.spdx.json"
cat sbom.spdx.json | jq .
```

### MCP Package Usage
Run or install via GitHub Packages npm registry:
```bash
npm config set @sumitdalavi:registry https://npm.pkg.github.com
npx @sumitdalavi/ai-devsecops-agent-mcp
```

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) — System diagram and component details
- [Runbook](docs/runbook.md) — Setup, commands, and expected outputs
- [Decisions](docs/decisions.md) — ADRs for MCP integration
- [Changelog](docs/changelog.md) — Change history


## 🚀 Declarative Continuous GitOps Deployment

This system is continuously deployed across multi-cluster environments via **ArgoCD v2.10+** and **Kustomize** overlays managed by the [`multi-cluster-gitops-promotion`](https://github.com/SumitDalavi/multi-cluster-gitops-promotion) catalog hub:

```
deploy/
├── k8s/
│   ├── base/                  # Baseline Deployment, Service, ServiceAccount (PodSecurity restricted)
│   └── overlays/
│       ├── dev/               # 1 replica, 300m/256Mi, automated self-healing
│       ├── staging/           # 2 replicas, 500m/512Mi, automated self-healing
│       └── prod/              # 3 replicas, 1000m/1Gi, gated PR promotion
└── argocd/
    ├── application.yaml       # Default staging Application CRD
    ├── application-dev.yaml   # In-cluster dev Application CRD
    ├── application-prod.yaml  # Production gated Application CRD
    └── values-override.yaml   # Helm/Kustomize values overrides
```

### Local Manifest Dry-Run Validation
```bash
# Validate Dev Overlay
kubectl kustomize deploy/k8s/overlays/dev

# Validate Staging Overlay
kubectl kustomize deploy/k8s/overlays/staging

# Validate Production Overlay
kubectl kustomize deploy/k8s/overlays/prod
```

## 👨‍💻 Author

**Sumit Dalavi** — Senior DevSecOps / Platform Engineer
[GitHub](https://github.com/SumitDalavi) | [LinkedIn](https://in.linkedin.com/in/sumit-dalavi-762838129)

---

*Built with a focus on robust patterns, not toy demos.*
