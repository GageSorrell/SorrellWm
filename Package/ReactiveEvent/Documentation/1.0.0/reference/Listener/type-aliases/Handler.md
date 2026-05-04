[reactive-event](../../index.md) / [Listener](../index.md) / Handler

# Handler Type

```ts
type Handler<PackageKey, ChannelType> =
	ChannelType extends Request<PackageKey>
		? HandlerRequest<PackageKey, ChannelType>
		: ChannelType extends NoRequest<PackageKey>
			? HandlerNoRequest<PackageKey, ChannelType>
			: never;
```

A callback function that can be registered for invokable events, _i.e._, the
[ChannelType](#channeltype) is of type [Channel.Handler.Any](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md), and is invoked via
UseInvokeEvent or InvokeEventDeferred.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.
