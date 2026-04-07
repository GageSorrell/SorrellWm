[electron-reactive-event](../../index.md) / [Listener](../index.md) / AnyCallback

# AnyCallback Type

```ts
type AnyCallback<PackageKey, OwnerType, EventType, ChannelType> =
	ChannelType extends Any<PackageKey>
		? Handler<PackageKey, ChannelType>
		: ChannelType extends Any<PackageKey, OwnerType>
			? Listener<PackageKey, OwnerType, EventType, ChannelType>
			: never;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md) = [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

### EventType

`EventType` _extends_ `IpcEvent` = `IpcEvent`

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/type-aliases/Any.md)\<`PackageKey`, `OwnerType`\> = [`Any`](../../Channel/namespaces/Channel/type-aliases/Any.md)\<`PackageKey`, `OwnerType`\>
