[electron-reactive-event](../../index.md) / [Internal](../index.md) / FilterByOwner

# FilterByOwner Type

```ts
type FilterByOwner<PackageKey, Owner> = {
	[ChannelType in keyof FilterByOwnerHelper<
		PackageKey,
		Owner
	> as FilterByOwnerHelper<PackageKey, Owner>[ChannelType] extends true
		? ChannelType
		: never]: ChannelType extends keyof Registrar[PackageKey]
		? Registrar[PackageKey][ChannelType]
		: never;
};
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](PackageKeys.md)

### Owner

`Owner` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md)
