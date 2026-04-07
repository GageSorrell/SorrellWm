[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / Request

# Request Type

```ts
type Request<PackageKey, Owner> = Extract<
	Any<PackageKey, Owner>,
	Extract<Values<WithRequestHelper<PackageKey>>, string>
>;
```

Channels whose event declarations specify a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### Owner

`Owner` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
