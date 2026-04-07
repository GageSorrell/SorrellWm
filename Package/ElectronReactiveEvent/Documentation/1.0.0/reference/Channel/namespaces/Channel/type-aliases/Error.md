[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / Error

# Error Type

```ts
type Error<PackageKey, Owner> = Exclude<
	Any<PackageKey, Owner>,
	NoError<PackageKey, Owner>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

### Owner

`Owner` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
