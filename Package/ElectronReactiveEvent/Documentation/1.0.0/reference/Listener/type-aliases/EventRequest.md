[electron-reactive-event](../../index.md) / [Listener](../index.md) / EventRequest

# EventRequest Type

```ts
type EventRequest<PackageKey, OwnerType, ChannelType> =
	RequestKey extends keyof FilterByOwner<PackageKey, OwnerType>[ChannelType]
		? FilterByOwner<
				PackageKey,
				OwnerType
			>[ChannelType][RequestKey] extends EmptyEventParameter
			? never
			: FilterByOwner<PackageKey, OwnerType>[ChannelType][RequestKey]
		: never;
```

The request type of a given event declaration, identified by its [PackageKey](#packagekey),
[OwnerType](#ownertype), and [ChannelType](#channeltype).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.

### ChannelType

`ChannelType` _extends_ [`Request`](../../Channel/namespaces/Channel/type-aliases/Request.md)\<`PackageKey`, `OwnerType`\>

The channel that uniquely identifies the desired
event declaration.
