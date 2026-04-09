[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / Error

# Error Type

```ts
type Error<PackageKey, OwnerType> = Exclude<
	Any<PackageKey, OwnerType>,
	NoError<PackageKey, OwnerType>
>;
```

Channels whose event declarations define an error type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
