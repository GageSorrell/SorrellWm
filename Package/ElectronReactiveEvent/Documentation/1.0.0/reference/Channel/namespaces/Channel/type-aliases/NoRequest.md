[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / NoRequest

# NoRequest Type

```ts
type NoRequest<PackageKey, Owner> = Exclude<
	Any<PackageKey, Owner>,
	Extract<Values<WithRequestHelper<PackageKey>>, string>
>;
```

Channels whose event declarations do _not_ specify a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### Owner

`Owner` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
