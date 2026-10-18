# Changelog

## [v0.1.0] — 2026-10-18
### Added
- Automated GitHub Actions release pipeline triggered on `v*.*.*` git tags (`.github/workflows/release.yml`).
- MCP server standalone tarball packaging via `npm pack` (`*.tgz`).
- Container image packaging (`ghcr.io/sumitdalavi/ai-devsecops-agent-mcp`).
- Vulnerability scanning via Aqua Security Trivy (`aquasecurity/trivy-action@v0.36.0`).
- SPDX-format Software Bill of Materials (SBOM) generation step (`anchore/sbom-action@v0`).
- Automated GitHub release publishing attaching MCP tarball and `sbom.spdx.json` via `softprops/action-gh-release@v2`.

## [2026-08-29] — Phase 2 Evidence
### Added
- Replaced one tool path (`get_pipeline_status`) with live integration (GitHub Actions API).
- Added `tests/e2e/test_live_integration.sh` script to verify live integration functionality.
- Standardized documentation (`runbook.md`, `decisions.md`, `ARCHITECTURE.md`).
- Added maturity badge and mock boundaries to `README.md`.
