[reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Listener](../index.md) / NoRequest

# NoRequest Type

```ts
type NoRequest<PackageKey, OwnerType> = Extract<
	Any<PackageKey, OwnerType>,
	NoRequest<PackageKey, OwnerType>
>;
```

[Listener](../index.md) channels whose event declarations do _not_ define a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
