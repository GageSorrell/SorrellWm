# Agents

Instructions for agents may be found in `./Configuration/Agent/`.  All agents that work in the monorepo are expected to follow all guidelines in this directory that are relevant to their tasks.  The guidelines are a mixture of monorepo-wide and domain-specific specifications.

## TypeScript Conventions

* Prefer `interface` over `type` where possible
* Prefer arrow functions over `function`s

### React

* Props types should be suffixed with `Props`

## Documentation

### JSDoc (and TSDoc)

* Props types of `react` components should have a TSDoc comment that simply `@inheritDoc`s its corresponding component
* Modules should follow the template enforced by the monorepo VS Code extension, with a description of the module at the beginning of the TS Doc comment
    * Trivial modules may have a module-level description that is identical to its primary (perhaps only) export

### Writing Style

* Follow periods with two spaces when starting a new sentence

### React

