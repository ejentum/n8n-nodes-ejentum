# Changelog

All notable changes to `n8n-nodes-ejentum` are documented here. This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-05-11

### Changed

- Reworded the README intro to describe the reasoning topology in prose (decision points, parallel branches, bounded loops, meta-cognitive pauses, escape paths) instead of leaking notation tokens (`Sn`, `Gn{?}`, `FORK/JOIN`, `M{...}`, `RE-ENTER`) into the first paragraphs. At first sight the notation read like broken rendering. Notation is retained inside the worked example and the field-by-field glossary table, where it is anchored by a literal API response shown directly above.
- Enriched the **Best for** column of the Operations table with the cognitive-domain hints for each harness, verified against the abilities CSVs (`graph_layer` counts match the published totals exactly: 311 / 128 / 139 / 101). Reasoning spans abstraction, time, causality, simulation, spatial, metacognition (six sub-domains). Code is a single homogeneous software-engineering layer. Anti-Deception spans sycophancy, hallucination, deception, adversarial, judgment, executive (six sub-layers). Memory is a single homogeneous perception layer.
- Replaced three em dashes in author-written prose with colons (parameter and output descriptions); the em dash inside the literal API-response code block is preserved because it is verbatim API output.

### Why

The opening paragraphs are the first signal to a reader. Token-dense notation in prose distracts from the value claim and looks like a markup glitch on first scan. Notation belongs next to the example that gives it meaning. And the harness-as-flat-library framing undersold the structured cognitive-domain organization that drives task-matched retrieval.

## [0.1.1] - 2026-05-11

### Changed

- Rewrote the README, npm `description`, node `description`, and Creator Hub submission pack to surface the **dual-encoding** of each cognitive operation: a natural-language procedure *plus* an executable reasoning topology (graph DAG with `Sn` steps, `Gn{?}` decision gates, `FORK/JOIN` parallel branches, `LOOP`/`for_each` bounded iteration, `M{...}`/`FREEFORM` meta-cognitive exits that let the model self-observe and `RE-ENTER`, `FIXED_POINT[...]` stable quantities, and `N{...}` negative anchors active across a branch).
- Added a **worked example** to the README showing a real harness response (ETL diagnostic query) with all seven structured blocks visible, plus a field-by-field table explaining what each block does at the next LLM step.
- Renamed framing from "scaffold" to "cognitive operation" in primary copy; "scaffold" is retained where it refers to the output string the model ingests.
- Reframed the value proposition around **reasoning decay** on complex tasks and long sessions, the conditions under which a model's own reasoning template fails.

### Why

The previous copy mentioned the natural-language layer but omitted the graph-logic layer entirely, which is the load-bearing technical claim that distinguishes the harness from a prompt template.

## [0.1.0] - 2026-05-11

### Added

- Initial release.
- Single **Ejentum** node with four operations mapping 1:1 to the Ejentum Reasoning Harness modes: `reasoning`, `code`, `anti-deception`, `memory`.
- `EjentumApi` credentials class with API key + base URL fields and a credential `test` endpoint that hits the live gateway.
- Node is marked `usableAsTool: true` so n8n's AI Agent can autonomously route to any of the four harnesses.
- `Output Format` selector with two modes: `Scaffold String` (default; pipes directly into an LLM prompt) and `Full Response` (raw API JSON).
- Verified against `eslint-plugin-n8n-nodes-base` (community ruleset + stricter prepublish ruleset).
- Published with npm OIDC trusted-publisher provenance attestation.
