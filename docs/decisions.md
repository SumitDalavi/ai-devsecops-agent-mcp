# Decisions

## ADR-001: Model Context Protocol vs REST API
**Date:** 2026-08-29  
**Status:** Accepted

**Context:**  
We want to expose DevSecOps tools to LLMs. We could write a custom REST API and require users to write custom prompt wrappers for each LLM client.

**Decision:**  
We implement the Model Context Protocol (MCP).

**Consequences:**  
- ✅ Zero-configuration integration with standard MCP clients (Claude Desktop, Cursor, etc.).
- ✅ Standardized tool schemas.
- ⚠️ Tied to the MCP specification ecosystem.

## ADR-002: Progressive Credential Loading (PCL) Architecture
- **Context:** Production hardening required live backends (PostgreSQL, Redis, OpenAI, Anthropic), but removing mocks would break CI pipelines and create high developer onboarding friction.
- **Decision:** Implement Progressive Credential Loading. Keep in-memory and local mock heuristics as the default safe baseline, while wrapping external integrations in auto-promoting factory adapters triggered by environment variables.
- **Consequences:** 
  - *Pros:* 100% CI pass rate without requiring external secrets; zero setup friction for new contributors; progressive upgrade to production clusters.
  - *Cons:* Adds lightweight factory abstraction layers and runtime credential detection logic.
