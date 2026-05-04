[reactive-event](../../index.md) / [Internal](../index.md) / FilterByOwner

# FilterByOwner Type

```ts
type FilterByOwner<PackageKey, OwnerType> = {
	[ChannelType in keyof FilterByOwnerHelper<
		PackageKey,
		OwnerType
	> as FilterByOwnerHelper<PackageKey, OwnerType>[ChannelType] extends true
		? ChannelType
		: never]: ChannelType extends keyof Registrar[PackageKey]
		? Registrar[PackageKey][ChannelType]
		: never;
};
```

All event declarations of a given [PackageKey](#packagekey) and [OwnerType](#ownertype).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
