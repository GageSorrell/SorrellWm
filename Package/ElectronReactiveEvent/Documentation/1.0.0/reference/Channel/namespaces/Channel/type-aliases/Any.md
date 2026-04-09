[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / Any

# Any Type

```ts
type Any<PackageKey, OwnerType> = Exclude<
	keyof FilterByOwner<PackageKey, OwnerType>,
	number | symbol
>;
```

Channels are the `string`s that uniquely identify the event declarations of a given package.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
