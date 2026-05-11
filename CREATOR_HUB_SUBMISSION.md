# n8n Creator Hub submission pack — n8n-nodes-ejentum

Copy-paste pack for submitting `n8n-nodes-ejentum` to <https://creators.n8n.io> for the verified-community-node program (cloud-installable status). Field names may vary as the portal evolves; pick the closest match.

---

## Identity

- **Package name** (npm): `n8n-nodes-ejentum`
- **Package version**: `0.1.0`
- **npm URL**: <https://www.npmjs.com/package/n8n-nodes-ejentum>
- **GitHub URL**: <https://github.com/ejentum/n8n-nodes-ejentum>
- **License**: MIT
- **Author**: Ejentum (`info@ejentum.com`)
- **Homepage**: <https://ejentum.com>

## Short description (~150 chars)

Inject a task-matched cognitive operation (natural-language procedure + executable reasoning topology) into the LLM step. Four harnesses, usableAsTool.

## Long description (~500 chars)

Retrieves a task-matched cognitive operation from the Ejentum Reasoning Harness and injects it into the LLM step that follows. Each operation in the 679-strong library is engineered in two layers: a natural-language procedure the model reads, plus an executable reasoning topology (graph DAG with decision gates, parallel branches, bounded loops, and meta-cognitive exit nodes that let the model self-observe and re-enter). The topology acts as a persistent attention anchor that survives long context windows and multi-turn execution chains, hardening reasoning against decay on complex tasks. Four harnesses (reasoning, code, anti-deception, memory) cover the four conditions under which models predictably fail.

## Tagline / one-liner

Reasoning Harness for n8n: a task-matched cognitive operation, engineered as both procedure and graph, injected before the LLM writes its first token.

## Categories

Primary: **AI**
Secondary: **Utility** / **Productivity**

## Auth method

API Key (Bearer). The credential class is `Ejentum API` with two fields:
- `apiKey` (required) — paste from <https://ejentum.com/pricing>
- `baseUrl` (default `https://ejentum-main-ab125c3.zuplo.app/logicv1/`, override only for self-hosted)

Credential includes a `test` request that hits the live gateway and confirms the key works.

## Operations exposed

| Operation | When the agent calls it |
|---|---|
| Reasoning Harness | Before analytical, diagnostic, planning, or multi-step questions. |
| Code Harness | Before generating, reviewing, refactoring, or debugging code. |
| Anti-Deception Harness | When a prompt pressures the model to validate, certify, or soften an honest assessment. |
| Memory Harness | When you have already observed something about cross-turn drift and want it sharpened. |

## Resources

- Documentation: <https://ejentum.com/docs/api_reference>
- Pricing / free tier (100 calls, no card): <https://ejentum.com/pricing>
- n8n integration guide: <https://ejentum.com/docs/n8n_guide>
- Positioning essay "Why LLM Agents Fail": <https://ejentum.com/blog/why-llm-agents-fail>
- "Under Pressure" research paper: <https://doi.org/10.5281/zenodo.19392715>

## Logo

`nodes/Ejentum/ejentum.svg` in the repo. Black background, red E-mark, 1254×1254.

## Screenshots (to capture before submission)

Capture from a fresh local n8n install with the node added:
1. The Ejentum node in the node picker (search "Ejentum")
2. The four operations dropdown open
3. The credential-config dialog
4. A simple Webhook → Ejentum → AI Agent workflow with the scaffold flowing into the system prompt
5. Successful credential test result

## Provenance

The npm package is published with both supply-chain attestations:
- `npm/attestation/specs/publish/v0.1`
- `slsa.dev/provenance/v1` (signed by GitHub Actions OIDC, transparency-log entry in sigstore)

Same supply-chain pedigree as our `ejentum-mcp` package.

## Compliance with n8n's verified-community-node checklist

| Requirement | Status |
|---|---|
| Package name starts with `n8n-nodes-` | yes |
| Keywords include `n8n-community-node-package` | yes |
| MIT or fair-code license | MIT |
| `n8n` block in package.json (n8nNodesApiVersion, credentials, nodes) | yes |
| Credentials class with `test` request | yes |
| Node implements `INodeType` and exports correctly | yes |
| ESLint with `eslint-plugin-n8n-nodes-base` (community + prepublish rulesets) passes | yes |
| README covers install, ops, credentials, compat | yes |
| LICENSE present | yes |
| `usableAsTool` for AI Agent compat | yes |
| Continue-on-fail honored in execute() | yes |
| Public source on GitHub with CI | yes |
