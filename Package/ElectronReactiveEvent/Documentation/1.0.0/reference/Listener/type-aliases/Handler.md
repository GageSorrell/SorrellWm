[electron-reactive-event](../../index.md) / [Listener](../index.md) / Handler

# Handler Type

```ts
type Handler<PackageKey, ChannelType> =
	ChannelType extends Request<PackageKey>
		? HandlerRequest<PackageKey, ChannelType>
		: ChannelType extends NoRequest<PackageKey>
			? HandlerNoRequest<PackageKey, ChannelType>
			: never;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>
