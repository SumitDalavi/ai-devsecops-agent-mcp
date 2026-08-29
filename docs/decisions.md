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
