[electron-reactive-event](../../index.md) / [Listener](../index.md) / ResponseError

# ResponseError Type

```ts
type ResponseError<PackageKey, ChannelType> = ResponseBase<
	ResponseErrorKey,
	ReactiveEventErrorDataInternal<PackageKey, ChannelType>
>;
```

The type returned to the `renderer` when a [Handler](Handler.md) fails.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Response`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Response.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.
