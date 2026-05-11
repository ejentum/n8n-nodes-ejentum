# n8n-nodes-ejentum

An n8n community node that retrieves a task-matched **cognitive operation** from the [Ejentum](https://ejentum.com) Reasoning Harness and injects it into the LLM step that follows.

Each operation in the Ejentum library (679 of them, organized across four harnesses) is engineered in **two layers**:

- a **natural-language procedure** the model can read, and
- an **executable reasoning topology**: a graph-logic DAG (`Sn` steps, `Gn{...}` gates, `FORK/JOIN` for parallel branches, `LOOP` for convergence, `M{...}` meta-cognitive reflection nodes that let the model exit the graph to self-observe and `RE-ENTER`, and `FREEFORM` escape blocks for when the prescribed path stops fitting the territory).

The natural-language layer tells the model *what* to do. The topology layer pins down *how* the steps connect, where to gate, where to loop, where to stop and look at itself. Together they act as a persistent attention anchor that survives long context windows and multi-turn execution chains — the conditions under which a model's own reasoning typically decays.

[Why](#why-this-node-exists) • [Installation](#installation) • [Operations](#operations) • [Worked example](#worked-example-what-actually-gets-injected) • [Credentials](#credentials) • [Compatibility](#compatibility) • [Usage](#usage) • [Resources](#resources)

## Why this node exists

RAG augments **what the model knows**. Fine-tuning shifts **what the model is**. Neither closes the layer Ejentum closes: **how the model reasons on this specific task, right now, before the first token is generated.**

Two failure modes drive most production agent regressions:

- **Complexity**: the task has more constraints, edge cases, or interacting variables than the model's default reasoning template can carry. The model collapses to a generic-looking answer that misses the load-bearing constraint.
- **Reasoning decay over long sessions**: across many turns or a long execution chain, the model drifts. Attention anchors weaken, prior commitments fade, suppression signals stop firing. By turn 30 you are not talking to the model you started with.

Injecting a task-matched cognitive operation before the LLM step works against both: the topology gives the model a structure to ride, the natural-language procedure tells it *what* the structure means, the `Amplify/Suppress` channel tells it which of its own tendencies to lean into and which to block.

## Installation

Follow the [n8n community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

1. Open **Settings → Community Nodes**.
2. Click **Install**.
3. Enter `n8n-nodes-ejentum`.
4. Agree to the community-nodes risk acknowledgement and install.

The **Ejentum** node appears in the node picker.

## Operations

One node, four operations, each mapping to a harness:

| Operation | Best for | Library size |
|---|---|---|
| **Reasoning Harness** | Analytical, diagnostic, planning, multi-step questions | 311 operations |
| **Code Harness** | Code generation, review, refactoring, debugging | 128 operations |
| **Anti-Deception Harness** | Prompts that pressure the model to validate, certify, or soften an honest assessment | 139 operations |
| **Memory Harness** | Sharpening an observation already formed about cross-turn drift (filter-oriented, not write-oriented) | 101 operations |

Inputs (all four operations):

- **Query** — short description of the task the downstream LLM is about to perform. The harness uses this to retrieve the best-matched operation. Example: `investigate why our nightly ETL job has started failing intermittently over the past two weeks`.

Outputs:

- **Scaffold String** (default) — returns `{ mode, query, scaffold }`. Drop `{{ $json.scaffold }}` directly into the next LLM's system prompt.
- **Full Response** — full JSON payload. Use when you want to parse individual blocks downstream.

## Worked example: what actually gets injected

Suppose your workflow asks the model to diagnose an intermittent failure:

> *Query*: `investigate why our nightly ETL job has started failing intermittently over the past two weeks; nothing in the code or schema has changed`

The Reasoning Harness returns this scaffold. Both layers are visible inside it: the `[PROCEDURE]` block is the natural-language layer, the `[REASONING TOPOLOGY]` block is the graph-logic layer.

```
[NEGATIVE GATE]
The server's response time was accepted as average, despite a suspicious
rhythm break in its timing pattern.

[PROCEDURE]
Step 1: Establish baseline timing profiles by extracting historical
durations and intervals for each event type. Step 2: Compare each observed
timing against its baseline and compute deviation magnitude. Step 3:
Classify anomalies as too fast, too slow, too early, or too late, and rank
by severity. Step 4: Do not dismiss timing deviations without
investigation. Never normalize anomalous timing as acceptable drift. Step
5: If deviation exceeds two standard deviations, probe root cause by
tracing upstream dependencies. If within tolerance, validate against
context. Flag confirmed anomalies with measured deviation and verify the
baseline was appropriate. Apply temporal anomaly detection.

[REASONING TOPOLOGY]
S1:durations → FIXED_POINT[baselines] → N{dismiss_timing_deviations_
without_investigation} → for_each: S2:compare → S3:deviation →
G1{>2sigma?} --yes→ S4:classify → S5:probe_cause → FLAG → continue --no→
S6:validate → continue → all_checked → OUT:anomaly_report

[TARGET PATTERN]
Establish timing baselines by extracting historical response intervals.
Compare current server response time to this baseline. Classification-
focused anomaly reveals a rhythm break, indicating a potential security
context elevation requiring further investigation.

[FALSIFICATION TEST]
If no event timing is flagged as suspiciously fast or slow relative to
baseline, temporal anomaly detection was not active — trace the output
to confirm.

Amplify: timing baseline comparison; anomaly classification; security
context elevation
Suppress: average timing acceptance; outlier normalization
```

Field-by-field, this is what the downstream LLM does with each block:

| Block | Role at the next LLM step |
|---|---|
| `[NEGATIVE GATE]` | The specific failure pattern to refuse. The model checks its draft against this *before* committing. |
| `[PROCEDURE]` | The natural-language steps. Read first, executed in order. |
| `[REASONING TOPOLOGY]` | The graph of those steps. `Sn` = step, `Gn{?}` = decision gate, `N{...}` = negative anchor active for the whole branch, `for_each` / `LOOP` = bounded iteration, `M{...}` / `FREEFORM` = meta-cognitive exit (the model stops, observes the trace, then `RE-ENTER`s at a named step), `FIXED_POINT[...]` = a quantity held stable across the rest of the branch. The topology survives long context windows in a way prose alone does not. |
| `[TARGET PATTERN]` | What correct reasoning looks like in one paragraph. Anchors the output shape. |
| `[FALSIFICATION TEST]` | A check the model runs *after* drafting. If the test fires, the draft was wrong about the task type. |
| `Amplify:` | Tendencies the model already has that should be turned up for this task. |
| `Suppress:` | Tendencies that produce the failure mode. The most load-bearing block; the rest of the scaffold often funnels into this list. |

## Credentials

Get a free API key (100 calls, no card) at <https://ejentum.com/pricing>.

In n8n, create new **Ejentum API** credentials:

| Field | Value |
|---|---|
| API Key | paste your key (starts with `zpka_`) |
| API Base URL | leave default (`https://ejentum-main-ab125c3.zuplo.app/logicv1/`) unless self-hosting |

The **Test** button runs a real request against the gateway and confirms the key works.

## Compatibility

- Tested against n8n `2.9.x` and above.
- Requires Node.js `>=20.15` on the n8n host.
- `eslint-plugin-n8n-nodes-base` community + prepublish rule sets pass at publish time.

## Usage

The canonical wiring is **Ejentum → LLM**, with the scaffold flowing into the next system prompt:

```
Webhook ─► Ejentum (Reasoning Harness, query="{{ $json.task }}")
            │
            └─► AI Agent / OpenAI Chat / Anthropic / ...
                  System prompt:
                  """
                  [REASONING CONTEXT]
                  {{ $json.scaffold }}
                  [END REASONING CONTEXT]
                  Now perform the task.
                  """
```

For multi-step workflows or long agent loops, place a fresh Ejentum call **before each new sub-task** so the topology is refreshed. The scaffold's effect is strongest at the start of a branch and weakens as turns accumulate; this is what reasoning decay means in practice and what re-injection counters.

The node is marked `usableAsTool: true`, so n8n's AI Agent can autonomously call any of the four operations when its task description suggests one is needed. The operation descriptions are written for that routing decision.

## Resources

- Homepage: <https://ejentum.com>
- Free tier and pricing: <https://ejentum.com/pricing>
- API reference: <https://ejentum.com/docs/api_reference>
- Positioning essay "Why LLM Agents Fail": <https://ejentum.com/blog/why-llm-agents-fail>
- "Under Pressure" research paper (Zenodo): <https://doi.org/10.5281/zenodo.19392715>
- n8n community nodes documentation: <https://docs.n8n.io/integrations/community-nodes/>

## License

[MIT](./LICENSE)
