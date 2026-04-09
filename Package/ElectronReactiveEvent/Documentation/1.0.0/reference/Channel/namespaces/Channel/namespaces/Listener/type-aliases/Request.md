[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Listener](../index.md) / Request

# Request Type

```ts
type Request<PackageKey, OwnerType> = Extract<
	Any<PackageKey, OwnerType>,
	Request<PackageKey, OwnerType>
>;
```

[Listener](../index.md) channels whose event declarations define a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
