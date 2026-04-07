[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / Request

# Request Type

```ts
type Request<PackageKey> = Extract<
	Any<PackageKey>,
	Request<PackageKey, RendererOwner>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)
