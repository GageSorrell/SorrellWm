[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / NoError

# NoError Type

```ts
type NoError<PackageKey, Owner> = Exclude<
	Any<PackageKey, Owner>,
	Extract<Values<WithErrorHelper<PackageKey>>, string>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

### Owner

`Owner` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
