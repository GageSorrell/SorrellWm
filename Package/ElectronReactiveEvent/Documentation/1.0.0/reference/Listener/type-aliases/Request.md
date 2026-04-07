[electron-reactive-event](../../index.md) / [Listener](../index.md) / Request

# Request Type

```ts
type Request<PackageKey, OwnerType, ChannelType> =
	RequestKey extends keyof FilterByOwner<PackageKey, OwnerType>[ChannelType]
		? FilterByOwner<
				PackageKey,
				OwnerType
			>[ChannelType][RequestKey] extends EmptyEventParameter
			? never
			: FilterByOwner<PackageKey, OwnerType>[ChannelType][RequestKey]
		: never;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

### ChannelType

`ChannelType` _extends_ [`Request`](../../Channel/namespaces/Channel/type-aliases/Request.md)\<`PackageKey`, `OwnerType`\>
