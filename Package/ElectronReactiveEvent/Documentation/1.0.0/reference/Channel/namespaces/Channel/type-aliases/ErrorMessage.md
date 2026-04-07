[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / ErrorMessage

# ErrorMessage Type

```ts
type ErrorMessage<PackageKey, OwnerType> = Exclude<
	Any<PackageKey, OwnerType>,
	Values<WithErrorPayloadHelper<PackageKey>>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
