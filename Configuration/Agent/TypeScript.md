# TypeScript

This article describes how TypeScript code should be written.

## Style Guide

* Prefer `interface`s over `type`s where possible
* Prefer arrow functions over `function`s unless `function` is needed

### Documentation

#### TSDoc

Every TSDoc comment that does not belong to a property of a type or interface should end with a line containing a `@category` tag, followed by a line containing a `@since` tag.  See the guidance for categories in the [`effect` skill](./Skill/effect/Skill.md).
