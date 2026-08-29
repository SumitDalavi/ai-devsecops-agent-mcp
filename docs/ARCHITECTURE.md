# Architecture — ai-devsecops-agent-mcp
> Last updated: 2026-08-29 | Maturity: Partial Prototype
> _MCP Server exposing DevSecOps tools._

## System Diagram
The following Mermaid.js sequence diagram maps the core workflow and interactions:

```mermaid
flowchart TD
    Client(["LLM Client (Copilot/Claude)"])
    MCP["MCP Server (Node.js)"]
    GH["GitHub API (Live)"]
    Mock["Mock Data Store"]

    Client -->|"Tool Call: get_pipeline_status"| MCP
    MCP -->|"If GITHUB_TOKEN set"| GH
    MCP -->|"If no token"| Mock
    GH -.-> MCP
    Mock -.-> MCP
    MCP -->|"Result JSON"| Client
```

## Component Table

| Component | File | Responsibility | Tech |
|---|---|---|---|
| MCP Server | `src/index.ts` | Protocol negotiation and routing | TypeScript |
| Tools | `src/tools/*.ts` | Implementations of specific tools | TypeScript |
| Live Integration | `src/tools/pipeline.tool.ts`| Fetches from GitHub API | fetch |

## Dependency Honesty Table

| Dependency | Status | Notes |
|---|---|---|
| MCP SDK | **Real** | Full implementation of the Model Context Protocol. |
| GitHub Actions | **Real** | `get_pipeline_status` hits real API if token is provided. |
| Other Tools | **Simulated** | Vuln/Logs/Deps return mock JSON data. |


## What is MCP?
The **Model Context Protocol (MCP)** is an open standard created by Anthropic that allows LLM applications to connect to external data sources and tools. Think of it as a USB-C port for AI — a universal interface that any LLM client can plug into.

## Why MCP Over a REST API?
A REST API requires each LLM client to build custom integrations. MCP provides a **standardized tool interface** that any MCP-compatible client (GitHub Copilot, Claude Desktop, Cursor, etc.) can immediately discover and use. The LLM sees the tool descriptions and input schemas, then decides when and how to call them.

## Tool Architecture

### 1. Pipeline Status (`pipeline.tool.ts`)
Simulates querying the GitHub Actions API. Returns structured pipeline run data including branch, status, commit SHA, and duration. The LLM can use this to answer questions like "Why did the last deploy fail?" or "Is main green?"

### 2. Vulnerability Triage (`vulnerability.tool.ts`)
Simulates a vulnerability tracking board (Jira/Snyk). Returns CVEs ranked by severity with package details, fix versions, and assignment status. Enables the LLM to prioritize remediation: "What critical CVEs are unassigned?"

### 3. Log Search (`logs.tool.ts`)
Simulates querying a centralized logging system (ELK/Datadog). Supports filtering by service, log level, and keyword search. Enables incident investigation: "Show me all errors from payment-service."

### 4. Dependency Scan (`dependency.tool.ts`)
Simulates scanning a project's dependency tree. Returns packages with known vulnerabilities, their severity, and upgrade paths. Enables proactive security: "What dependencies need urgent upgrades?"

## Data Flow
```
User Prompt → LLM Client → MCP Protocol → This Server → Tool Handler → Mock Data → Response → LLM Reasoning → User Answer
```

The key insight is that the LLM **reasons over the structured data** returned by the tools. It doesn't just parrot back results — it correlates information across tools (e.g., linking a pipeline failure to a CVE in a dependency).