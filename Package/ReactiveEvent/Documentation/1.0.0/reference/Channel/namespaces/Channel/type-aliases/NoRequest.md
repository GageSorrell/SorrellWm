[reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / NoRequest

# NoRequest Type

```ts
type NoRequest<PackageKey, OwnerType> = Exclude<
	Any<PackageKey, OwnerType>,
	Extract<Values<WithRequestHelper<PackageKey>>, string>
>;
```

Channels whose event declarations do _not_ specify a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
