[reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / NoError

# NoError Type

```ts
type NoError<PackageKey, OwnerType> = Exclude<
	Any<PackageKey, OwnerType>,
	Extract<Values<WithErrorHelper<PackageKey>>, string>
>;
```

Channel with no error type (_i.e._, no error message type and no error payload type).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
