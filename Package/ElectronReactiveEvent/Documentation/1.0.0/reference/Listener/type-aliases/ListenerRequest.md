[electron-reactive-event](../../index.md) / [Listener](../index.md) / ListenerRequest

# ListenerRequest Type

```ts
type ListenerRequest<PackageKey, OwnerType, ChannelType> =
	OwnerType extends RendererOwner
		? (event, request) => void
		: (event, request) => void;
```

A [Listener](Listener.md) that is subscribable to a [listener channel](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Request.md)
whose event declaration has a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.

### ChannelType

`ChannelType` _extends_ [`Request`](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Request.md)\<`PackageKey`, `OwnerType`\>

The channel that uniquely identifies the desired
event declaration.
