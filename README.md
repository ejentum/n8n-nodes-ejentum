# n8n-nodes-ejentum

An n8n community node that calls the [Ejentum](https://ejentum.com) **Reasoning Harness** before the LLM step in your workflow. Ejentum is a library of 679 cognitive operations engineered in natural language, organized across four harnesses (`reasoning`, `code`, `anti-deception`, `memory`). Each call returns a task-matched scaffold (named failure pattern, executable procedure, suppression vectors, falsification test) that the downstream LLM ingests before it writes a single token.

This is the layer that RAG, fine-tuning, and agent loops cannot close: not what the model knows, how it reasons.

[Installation](#installation) • [Operations](#operations) • [Credentials](#credentials) • [Compatibility](#compatibility) • [Usage](#usage) • [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In your n8n instance:

1. Go to **Settings → Community Nodes**.
2. Click **Install**.
3. Enter `n8n-nodes-ejentum` as the package name.
4. Agree to the risks of using community nodes and click **Install**.

After installation, the **Ejentum** node appears in the node picker.

## Operations

The node exposes the four Ejentum harnesses as four operations on a single node. Pick the one that matches the task the downstream LLM is about to perform.

| Operation | When to call it |
|---|---|
| **Reasoning Harness** | Before analytical, diagnostic, planning, or multi-step questions. |
| **Code Harness** | Before generating, reviewing, refactoring, or debugging code. |
| **Anti-Deception Harness** | When a prompt pressures the model to validate, certify, or soften an honest assessment. |
| **Memory Harness** | When you have already observed something about cross-turn drift and want it sharpened. Filter-oriented, not write-oriented. |

Each operation takes a single required input:

- **Query** — a short description of the task the downstream LLM is about to perform. The harness uses this to retrieve the best-matched scaffold. Example: `diagnose intermittent 503s under load`.

And one optional output knob:

- **Output Format**
  - `Scaffold String` (default): returns `{ mode, query, scaffold }` where `scaffold` is the harness text, ready to inject into the next LLM prompt.
  - `Full Response`: returns the full JSON payload from the API. Use when you need the raw response for downstream parsing.

## Credentials

You need an Ejentum API key. Free tier (100 calls, no card required) at <https://ejentum.com/pricing>.

In n8n, create new **Ejentum API** credentials with:

| Field | Value |
|---|---|
| API Key | `zpka_...` (paste your key) |
| API Base URL | Leave at the default (`https://ejentum-main-ab125c3.zuplo.app/logicv1/`) unless you self-host. |

The credential's **Test** button runs a minimal real request against the API and confirms the key works.

## Compatibility

- Tested against n8n `2.9.x` and above.
- Requires Node.js `>=20.15` on the n8n host.
- Verified-nodes lint rules (`eslint-plugin-n8n-nodes-base`) are enforced at publish time.

## Usage

The canonical pattern is **Ejentum → LLM**, where the harness scaffold flows directly into the LLM prompt:

```
Webhook ─► Ejentum (Reasoning Harness, query="{{ $json.task }}")
            │
            └─► AI Agent / OpenAI Chat / Anthropic / ...
                  System prompt: """
                  [REASONING CONTEXT]
                  {{ $json.scaffold }}
                  [END REASONING CONTEXT]
                  Now perform the task.
                  """
```

For multi-step workflows, place a fresh Ejentum call before each new sub-task. Different sub-tasks should retrieve different scaffolds.

You can also use the node as an AI Agent tool: it is marked `usableAsTool`, so n8n's AI Agent can call any of the four operations autonomously when its task description suggests one is needed.

## Resources

- Ejentum homepage: <https://ejentum.com>
- Free tier and pricing: <https://ejentum.com/pricing>
- API reference: <https://ejentum.com/docs/api_reference>
- "Why LLM Agents Fail" (the positioning essay): <https://ejentum.com/blog/why-llm-agents-fail>
- "Under Pressure" research paper: <https://doi.org/10.5281/zenodo.19392715>
- n8n community nodes documentation: <https://docs.n8n.io/integrations/community-nodes/>

## License

[MIT](./LICENSE)
