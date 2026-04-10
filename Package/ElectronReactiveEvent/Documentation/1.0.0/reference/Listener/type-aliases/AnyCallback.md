[electron-reactive-event](../../index.md) / [Listener](../index.md) / AnyCallback

# AnyCallback Type

```ts
type AnyCallback<PackageKey, OwnerType, ChannelType> =
	ChannelType extends Any<PackageKey>
		? Handler<PackageKey, ChannelType>
		: ChannelType extends Any<PackageKey, OwnerType>
			? Listener<PackageKey, OwnerType, ChannelType>
			: never;
```

This is the union of [Handler](Handler.md) and [Listener](Listener.md), with safety-checks
via `extends`, so that the given [ChannelType](#channeltype) narrows the type of this
to the exact callback type that corresponds to the given [ChannelType](#channeltype).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md) = [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/type-aliases/Any.md)\<`PackageKey`, `OwnerType`\> = [`Any`](../../Channel/namespaces/Channel/type-aliases/Any.md)\<`PackageKey`, `OwnerType`\>

The channel that uniquely identifies the desired
event declaration.
