---
name: typescript
description: Write TypeScript code that conforms to monorepo-wide guidelines.
---

Use this skill to write clean, consistent TypeScript code, and to manage the IDE and related tooling.

## Modules

Every module, after their respective top-level TSDoc comment and `import` statements, should `export` a "type ID" value and type, defined as follows: given a module `@sorrell/wm/Foo/Bar` whose package is currently version `1.0.0`, this module should contain the following snippet immediately after its top-level comment and `import` statements,

```ts
/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/wm/Foo/Bar" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;
```

## Style Guide

* Prefer `interface`s over `type`s where possible
* Prefer arrow functions over `function`s unless `function` is needed
* Put object and array literals on new lines, for example,

```ts
const Foo =
    {
        Bar: "Baz"
    };
```

### Documentation

#### TSDoc

Every TSDoc comment that does not belong to a property of a type or interface should end with a line containing a `@category` tag, followed by a line containing a `@since` tag.  See the guidance for categories in the [`effect` skill](../effect/Skill.md).
