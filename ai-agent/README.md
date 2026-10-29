# AI agent with Ankinize tools

A Claude model with three tools (list decks, search notes, add cards) backed by `@ankinize/sdk`. Ask in plain language; the model picks the tools and the loop feeds the results back.

```bash
bun install
ANKINIZE_API_KEY=... ANTHROPIC_API_KEY=... bun agent.ts "Add 5 cards on the French Revolution to History"
```

Use a `read` key for an agent that should only look things up. Retries on writes should send an `Idempotency-Key`; see the guide.

Guide: https://ankinize.com/docs/agents
