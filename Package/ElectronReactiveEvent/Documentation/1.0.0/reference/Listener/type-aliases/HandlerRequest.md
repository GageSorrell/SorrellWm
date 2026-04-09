[electron-reactive-event](../../index.md) / [Listener](../index.md) / HandlerRequest

# HandlerRequest Type

```ts
type HandlerRequest<PackageKey, ChannelType> = HandlerInternal<
	PackageKey,
	ChannelType
>;
```

A [Handler](Handler.md) that subscribes to an event whose declaration has a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Request`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Request.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.
