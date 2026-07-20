[reactive-event](../../index.md) / [Internal](../index.md) / PackageKeys

# PackageKeys Type

```ts
type PackageKeys = Exclude<keyof Registrar, number | symbol>;
```

This is the union of all `PackageKey` values used in a given project (that is, a given package
using `reactive-event`, and any dependencies that also use `reactive-event`).
