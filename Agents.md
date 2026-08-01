# Agents

See instructions in `./Configuration/Agent/`.  All agents that work in the monorepo are expected to follow all of the guidelines in this directory that are relevant to their tasks.  The guidelines are a mixture of monorepo-wide and domain-specific specifications.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (GageSorrell/SorrellWm), via the `gh` CLI. See `Documentation/Agent/IssueTracker.md`.

### Domain docs

Multi-context layout — root `CONTEXT-MAP.md` points to per-workspace `CONTEXT.md` files (`Application/`, each `Package/*`, each `Script/*`). See `Documentation/Agent/Domain.md`.
