[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / Response

# Response Type

```ts
type Response<PackageKey> = Extract<
	Any<PackageKey>,
	Response<PackageKey, RendererOwner>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)
