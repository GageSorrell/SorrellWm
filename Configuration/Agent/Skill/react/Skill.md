---
name: react
description: Write `react` components, hooks, and related utilities.
---

Use this skill to write `react` code.

## Components

### Module Structure

* Most components should belong to their own, respective directories
    * The exception to this rule is the condition that the component is trivial, or is only used in with another, more significant component
* The name of the directory of a component should be the name of that component
* For a given component `MyComponent`, the directory of that component should contain the following files,
    * `index.ts`
    * `MyComponent.tsx`
    * `UseMyComponent.{ts|tsx}`
    * `RenderMyComponent.tsx`
    * `MyComponent.Types.ts`

The following subsections describe each file belonging to the directory of a component "`MyComponent`".

#### `index.ts`

This module should barrel-export the `MyComponent.tsx` and `MyComponent.Types.ts` modules.  Its top-level TSDoc comment should have a description identical to the description of its exported component (in `MyComponent.tsx`).

#### `MyComponent.tsx`

This

## Miscellaneous

* Props types should always be defined via `interface`
* Props types should always be suffixed with `Props`
* The TSDoc comment of a props type should always be just an `@inheritDoc` tag that references the corresponding component
