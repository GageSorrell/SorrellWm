[electron-reactive-event](../../index.md) / [Internal](../index.md) / RendererRegistrar

# RendererRegistrar Type

```ts
type RendererRegistrar<PackageKey> = FilterByOwner<PackageKey, RendererOwner>;
```

All `renderer` event declarations of a given [PackageKey](#packagekey).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](PackageKeys.md)

The unique string that identifies your package.
