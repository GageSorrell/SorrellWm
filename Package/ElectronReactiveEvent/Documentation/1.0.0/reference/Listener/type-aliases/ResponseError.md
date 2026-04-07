[electron-reactive-event](../../index.md) / [Listener](../index.md) / ResponseError

# ResponseError Type

```ts
type ResponseError<PackageKey, ChannelType> = ResponseBase<
	ResponseErrorKey,
	ReactiveEventErrorDataInternal<PackageKey, ChannelType>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Response`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Response.md)\<`PackageKey`\>
