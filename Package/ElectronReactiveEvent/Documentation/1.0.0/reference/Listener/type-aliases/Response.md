[electron-reactive-event](../../index.md) / [Listener](../index.md) / Response

# Response Type

```ts
type Response<PackageKey, ChannelType> = MakeIsPending<
	ResponseSync<PackageKey, ChannelType>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>
