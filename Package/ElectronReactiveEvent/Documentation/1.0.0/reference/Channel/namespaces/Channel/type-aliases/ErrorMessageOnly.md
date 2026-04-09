[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / ErrorMessageOnly

# ErrorMessageOnly Type

```ts
type ErrorMessageOnly<PackageKey, OwnerType> = Exclude<
	Any<PackageKey, OwnerType>,
	Values<WithErrorPayloadHelper<PackageKey>>
>;
```

Channels whose event declarations define an error _message_ type,
but _not_ an error payload type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
