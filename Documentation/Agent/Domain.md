# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root — it points at one `CONTEXT.md` per context (workspace). Read each one relevant to the topic.
- **`docs/adr/`** at the repo root — system-wide decisions that touch the area you're about to work in.
- **`<workspace>/docs/adr/`** — e.g. `Application/docs/adr/`, `Package/Windows/docs/adr/` — context-scoped decisions for that workspace.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

This is a multi-context repo — each npm workspace listed in the root `package.json`'s `workspaces` array is its own context:

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← system-wide decisions
├── Application/
│   ├── CONTEXT.md
│   └── docs/adr/
├── Package/
│   ├── AppSettings/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/
│   ├── Color/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/
│   ├── Windows/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/
│   └── ...  (one per Package/* workspace)
└── Script/
    ├── Setup/
    │   ├── CONTEXT.md
    │   └── docs/adr/
    └── WmScript/
        ├── CONTEXT.md
        └── docs/adr/
```

Coding standards (as opposed to domain/architectural knowledge) live separately, under `Configuration/Agent/` — see `Agents.md` at the repo root.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in the relevant workspace's `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
