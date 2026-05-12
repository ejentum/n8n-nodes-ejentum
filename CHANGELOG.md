# Changelog

All notable changes to `n8n-nodes-ejentum` are documented here. This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2026-05-13

### Changed

- **Icon**: shipped the canonical brand mark from the master logo library (the exact vector path used on the website, Gravatar, and every other Ejentum surface). Black rounded-square tile (`rx=220` in a 1254×1254 viewBox), canonical red (`#FB1B27`) E centered and scaled 1.5× to nearly fill the tile horizontally. Replaces the 0.1.3 potrace-from-raster variant, which had slightly thicker strokes as a tracing artifact rather than as a deliberate brand decision. Brand mark, colors, and proportions are now pixel-identical to every other Ejentum surface.

### Why

For an installed n8n community node that users will compare side-by-side with the website, the same path everywhere matters more than slightly thicker strokes. The rounded-square tile is the only platform-specific adaptation: n8n's design language uses rounded tiles for every node, so a sharp-square tile (the canonical container shape elsewhere) would have read as unfinished CSS inside n8n rather than as the brand.

## [0.1.3] - 2026-05-12

### Changed

- **Icon**: replaced the 1254×1254 full-logo SVG (black background + red E-mark) with a 1024×1024 icon-optimized variant (transparent background, single red path traced from a 2D-rendered glyph). The old logo's black square clashed with n8n's dark canvas at small node-icon sizes (~60×60); the new transparent variant lets the canvas background show through and the red mark reads clean.
- **Output Format parameter removed**. The node now always returns `{mode, query, response: [{<mode>: scaffold}]}`. The previous Scaffold String / Full Response dropdown was needless choice: the API response is already cleanly labeled, and downstream nodes can address the scaffold via expression. The `HarnessResponseItem` interface and dead type casts in `_run` were removed along with the parameter.
- **Operation action labels** changed from `Get a/an <X> scaffold` to `Get <X> harness`. Blind-evaluated across Claude Sonnet 4.5, GPT-4o, and Gemini 2.5 Pro (position-randomized per call): all three voted unanimously for "harness" over "injection", citing that "harness" describes the structured object being retrieved while "injection" describes the downstream use.
- **Operation descriptions** rewritten via the same blind-eval methodology. 4 operations × 2 variants (old marketing-style vs new uniform trigger+coverage shape) × 3 models. Final descriptions are a HYBRID of the winners per operation:
  - `reasoning_harness` (new uniform won 3/0): `Use before analytical, diagnostic, planning, or multi-step tasks across abstraction, time, causality, simulation, spatial, and metacognition.`
  - `code_harness` (old kept 3/0): `Use before generating, reviewing, refactoring, or debugging code. Names the typical failure pattern, gives an engineering procedure, and lists suppression vectors for the most common LLM coding mistakes.` Specific failure modes (hallucinated APIs, lost edge cases) carry routing signal; abstract "software-engineering layer" lost it.
  - `anti_deception_harness` (old kept 3/0): `Use when a prompt pressures the model to validate, certify, or soften an honest assessment. Blocks sycophantic capitulation and hallucinated agreement before the response is written.` Specific failure modes beat broad six-sub-layer enumeration for agent routing.
  - `memory_harness` (new kept 2/1, with Gemini's "does not replace observation" caveat preserved): `Use after you have already noticed something about cross-turn drift, contradiction, or accumulated context in the perception layer. Sharpens an existing observation; does not generate one.`

### Why the hybrid

Frank's "looks like marketing copy" critique on the original Reasoning description was right for THAT operation (the "returns failure pattern, procedure, falsification test..." enumeration was output-shape exposition the agent sees once it calls). But the same pattern failed for Code and Anti-Deception, where the named failure modes were operationally useful routing signal, not marketing. Listing six abstract sub-layers added taxonomic noise without helping the agent match a task. The blind eval surfaced this asymmetry cleanly.

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
