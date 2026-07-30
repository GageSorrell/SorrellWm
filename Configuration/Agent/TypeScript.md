# TypeScript

This article describes how TypeScript code should be written.

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



### Documentation

#### TSDoc

Every TSDoc comment that does not belong to a property of a type or interface should end with a line containing a `@category` tag, followed by a line containing a `@since` tag.  See the guidance for categories in the [`effect` skill](./Skill/effect/Skill.md).
