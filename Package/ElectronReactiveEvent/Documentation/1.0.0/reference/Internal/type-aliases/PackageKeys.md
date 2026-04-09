[electron-reactive-event](../../index.md) / [Internal](../index.md) / PackageKeys

# PackageKeys Type

```ts
type PackageKeys = Exclude<keyof Registrar, number | symbol>;
```

This is the union of all `PackageKey` values used in a given project (that is, a given package
using `electron-reactive-event`, and any dependencies that also use `electron-reactive-event`).
