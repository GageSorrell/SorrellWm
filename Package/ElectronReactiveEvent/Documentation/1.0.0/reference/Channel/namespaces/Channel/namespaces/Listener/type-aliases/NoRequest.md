[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Listener](../index.md) / NoRequest

# NoRequest Type

```ts
type NoRequest<PackageKey, Owner> = Extract<
	Any<PackageKey, Owner>,
	NoRequest<PackageKey, Owner>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

### Owner

`Owner` _extends_ [`EventOwner`](../../../../../../Decl/type-aliases/EventOwner.md)
