[reactive-event](../../index.md) / [Internal](../index.md) / MainRegistrar

# MainRegistrar Type

```ts
type MainRegistrar<PackageKey> = FilterByOwner<PackageKey, MainOwner>;
```

All `main` event declarations of a given [PackageKey](#packagekey).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](PackageKeys.md)

The unique string that identifies your package.
