[reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / ErrorPayload

# ErrorPayload Type

```ts
type ErrorPayload<PackageKey, OwnerType> = Extract<
	Any<PackageKey, OwnerType>,
	Extract<Values<WithErrorPayloadHelper<PackageKey>>, string>
>;
```

Channels whose event declarations define an error type that
includes a payload type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
