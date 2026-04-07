[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Listener](../index.md) / Request

# Request Type

```ts
type Request<PackageKey, Owner> = Extract<
	Any<PackageKey, Owner>,
	Request<PackageKey, Owner>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

### Owner

`Owner` _extends_ [`EventOwner`](../../../../../../Decl/type-aliases/EventOwner.md)
