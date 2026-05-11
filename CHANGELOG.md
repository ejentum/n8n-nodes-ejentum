# Changelog

All notable changes to `n8n-nodes-ejentum` are documented here. This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-05-11

### Added

- Initial release.
- Single **Ejentum** node with four operations mapping 1:1 to the Ejentum Reasoning Harness modes: `reasoning`, `code`, `anti-deception`, `memory`.
- `EjentumApi` credentials class with API key + base URL fields and a credential `test` endpoint that hits the live gateway.
- Node is marked `usableAsTool: true` so n8n's AI Agent can autonomously route to any of the four harnesses.
- `Output Format` selector with two modes: `Scaffold String` (default; pipes directly into an LLM prompt) and `Full Response` (raw API JSON).
- Verified against `eslint-plugin-n8n-nodes-base` (community ruleset + stricter prepublish ruleset).
- Published with npm OIDC trusted-publisher provenance attestation.
