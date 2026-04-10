[electron-reactive-event](../../index.md) / [Listener](../index.md) / Listener

# Listener Type

```ts
type Listener<PackageKey, OwnerType, ChannelType> =
	ChannelType extends Request<PackageKey, OwnerType>
		? ListenerRequest<PackageKey, OwnerType, ChannelType>
		: ChannelType extends NoRequest<PackageKey, OwnerType>
			? ListenerNoRequest<OwnerType>
			: never;
```

A callback function that can be registered for sendable events, _i.e._, the
[ChannelType](#channeltype) is of type [Channel.Listener.Any](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md), and is sent via
UseSendEvent, SendEventDeferred, or Send.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md)\<`PackageKey`, `OwnerType`\>

The channel that uniquely identifies the desired
event declaration.
