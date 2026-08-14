# AI-Assisted DevSecOps Agent — MCP Server 🤖🔒

> An MCP (Model Context Protocol) server exposing DevSecOps tooling to LLM clients — turning your AI copilot into a security-aware engineering partner.

> **⚠️ PoC Note:** All tools return mock/simulated data — no live GitHub Actions, Jira, or logging integrations required. The MCP protocol implementation and tool structure are fully functional.


## The Problem

DevSecOps teams drown in context-switching: checking pipeline status in one tab, triaging vulnerabilities in another, searching logs in a third. Meanwhile, LLM coding assistants can write code but are blind to your operational reality — they can't see your failing builds, open CVEs, or production errors.

## The Solution

This MCP server bridges the gap by exposing **four security-critical tools** to any MCP-compatible LLM client (GitHub Copilot, Claude Desktop, Cursor, etc.):

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
┌─────────────────┐     MCP (stdio/SSE)     ┌──────────────────────┐
│  LLM Client     │◄──────────────────────►│  MCP Server          │
│  (Copilot,      │                         │                      │
│   Claude, etc.) │                         │  ┌────────────────┐  │
│                 │                         │  │ Pipeline Tool   │  │
│                 │                         │  │ Vuln Triage Tool│  │
│                 │                         │  │ Log Search Tool │  │
│                 │                         │  │ Dep Scan Tool   │  │
│                 │                         │  └────────────────┘  │
└─────────────────┘                         └──────────────────────┘
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

### Connecting to Claude Desktop
Add to your Claude Desktop MCP config (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "devsecops-agent": {
      "command": "node",
      "args": ["dist/index.js"]
    }
  }
}
```

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
    "devsecops-agent": {
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

## 👨‍💻 Author

**Sumit Dalavi** — Senior DevSecOps / Platform Engineer
[GitHub](https://github.com/SumitDalavi) | [LinkedIn](https://in.linkedin.com/in/sumit-dalavi-762838129)

---

*Built with a focus on production-grade patterns, not toy demos.*