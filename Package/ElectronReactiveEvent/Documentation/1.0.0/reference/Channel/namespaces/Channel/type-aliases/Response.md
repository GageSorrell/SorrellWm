[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / Response

# Response Type

```ts
type Response<PackageKey, Owner> = Exclude<
	Any<PackageKey, Owner>,
	NoResponse<PackageKey, Owner>
>;
```

Channels whose event declarations define a response type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

### Owner

`Owner` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
