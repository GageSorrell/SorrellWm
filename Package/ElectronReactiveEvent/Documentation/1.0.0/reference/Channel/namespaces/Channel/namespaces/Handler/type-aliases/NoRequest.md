[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / NoRequest

# NoRequest Type

```ts
type NoRequest<PackageKey> = Extract<
	Any<PackageKey>,
	NoRequest<PackageKey, RendererOwner>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)
