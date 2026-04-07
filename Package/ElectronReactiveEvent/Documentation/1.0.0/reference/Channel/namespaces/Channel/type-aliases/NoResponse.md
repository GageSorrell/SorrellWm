[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / NoResponse

# NoResponse Type

```ts
type NoResponse<PackageKey, Owner> = Exclude<
	Any<PackageKey, Owner>,
	Extract<Values<WithResponseHelper<PackageKey>>, string>
>;
```

Channels whose event declarations do _not_ define a response type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

### Owner

`Owner` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
