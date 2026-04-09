[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / Request

# Request Type

```ts
type Request<PackageKey> = Extract<
	Any<PackageKey>,
	Request<PackageKey, RendererOwner>
>;
```

[Handler](../index.md) channels whose event declarations define a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Type Param

The owner of the event declarations identified by this type.
