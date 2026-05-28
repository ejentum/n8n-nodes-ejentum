# n8n-nodes-ejentum

An n8n community node that calls the Ejentum API and returns a task-matched cognitive operation (procedure + topology DAG + cognitive payload) for injection into the LLM step that follows.

One node, eight operations: four dynamic (`Reasoning`, `Code`, `Anti-Deception`, `Memory`) available on all tiers including the 30-day free trial, and four adaptive (`Adaptive Reasoning`, `Adaptive Code`, `Adaptive Anti-Deception`, `Adaptive Memory`) that run an additional adapter LLM step. Adaptive operations require the Go or Super tier.

## Install

Follow the [n8n community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. Settings → Community Nodes → Install.
2. Enter `n8n-nodes-ejentum`.
3. Confirm the community-nodes risk acknowledgement.

The **Ejentum** node appears in the node picker.

## Credentials

Create new **Ejentum API** credentials in n8n:

| Field | Value |
|---|---|
| API Key | your key (starts with `ej_`) |
| API Base URL | default `https://api.ejentum.com/harness/` unless self-hosting |

The **Test** button issues a real POST against the gateway and confirms the key is valid.

Get a key at [ejentum.com/pricing](https://ejentum.com/pricing).

## Operations

### Dynamic (all tiers)

| Operation | Mode string | Library size |
|---|---|---:|
| Reasoning | `reasoning` | 311 |
| Code | `code` | 128 |
| Anti-Deception | `anti-deception` | 139 |
| Memory | `memory` | 101 |

### Adaptive (Go or Super tier)

| Operation | Mode string |
|---|---|
| Adaptive Reasoning | `adaptive-reasoning` |
| Adaptive Code | `adaptive-code` |
| Adaptive Anti-Deception | `adaptive-anti-deception` |
| Adaptive Memory | `adaptive-memory` |

## Inputs and outputs

### Input parameter (all operations)

- **Query** (string, required): 1-2 sentences describing the task the downstream LLM is about to perform. The harness uses this for retrieval.

### Output format

The node has two output modes selected via a parameter:

| Output mode | Returned JSON |
|---|---|
| **Injection String** (default) | `{ "mode": "<mode>", "query": "<query>", "injection": "<text>" }` |
| **Full Response** | The full upstream payload: `[ { "<mode>": "<text>" } ]` |

In the default mode, drop `{{ $json.injection }}` into the next LLM node's system prompt.

## Wire contract

The node issues:

```
POST https://api.ejentum.com/harness/
Headers: Authorization: Bearer <key>, Content-Type: application/json
Body:    { "query": <string>, "mode": <one of 8 mode strings> }
Response (200): [ { "<mode>": "<injection string>" } ]
Response (401|403|429): { "error": "..." }
```

Full wire contract, field structure of an injection, DAG syntax (token vocabulary used in the topology block), and a canonical dynamic-vs-adaptive comparison on the same query are documented in the [ejentum-mcp README](https://github.com/ejentum/ejentum-mcp#wire-contract). The format is identical across this node and every Ejentum framework shim.

## Canonical wiring

```
Webhook ─► Ejentum (Reasoning, query="{{ $json.task }}")
            │
            └─► AI Agent / OpenAI Chat / Anthropic / ...
                  System prompt:
                  """
                  [REASONING CONTEXT]
                  {{ $json.injection }}
                  [END REASONING CONTEXT]

                  Now perform the task.
                  """
```

For multi-step workflows, place a fresh Ejentum call before each new sub-task. The injection's effect on the LLM's response is strongest at the start of a branch.

The node is `usableAsTool: true`, so n8n's AI Agent node can call any of the eight operations autonomously when the task description matches one of the operation triggers.

## ejentum-mcp alternative

n8n also ships an MCP Client node. The hosted MCP server at `https://api.ejentum.com/mcp` exposes the same eight tools with Bearer auth via your `EJENTUM_API_KEY`. Use this n8n node for tight n8n integration (credential vault, expression-friendly outputs, AI Agent routing); use the MCP route if you are already wiring multiple MCP servers into one workflow.

## Compatibility

- n8n 2.9.x and above
- Node.js >= 20.15 on the n8n host
- Tested via `eslint-plugin-n8n-nodes-base` community + prepublish rule sets

## Resources

- Homepage: <https://ejentum.com>
- Pricing: <https://ejentum.com/pricing>
- API reference: <https://ejentum.com/docs/api_reference>
- n8n community nodes: <https://docs.n8n.io/integrations/community-nodes/>

## License

[MIT](./LICENSE)
