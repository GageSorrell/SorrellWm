[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / NoResponse

# NoResponse Type

```ts
type NoResponse<PackageKey, OwnerType> = Exclude<
	Any<PackageKey, OwnerType>,
	Extract<Values<WithResponseHelper<PackageKey>>, string>
>;
```

Channels whose event declarations do _not_ define a response type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
