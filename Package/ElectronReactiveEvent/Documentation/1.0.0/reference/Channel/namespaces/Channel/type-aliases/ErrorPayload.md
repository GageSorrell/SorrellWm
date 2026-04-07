[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / ErrorPayload

# ErrorPayload Type

```ts
type ErrorPayload<PackageKey, OwnerType> = Extract<
	Any<PackageKey, OwnerType>,
	Extract<Values<WithErrorPayloadHelper<PackageKey>>, string>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
