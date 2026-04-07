[electron-reactive-event](../../index.md) / [Listener](../index.md) / ResponseSuccess

# ResponseSuccess Type

```ts
type ResponseSuccess<PackageKey, ChannelType> = ResponseBase<
	ResponseDataKey,
	Registrar[PackageKey][ChannelType][ResponseKey]
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Response`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Response.md)\<`PackageKey`\>
