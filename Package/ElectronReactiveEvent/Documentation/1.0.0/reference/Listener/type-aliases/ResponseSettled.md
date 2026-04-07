[electron-reactive-event](../../index.md) / [Listener](../index.md) / ResponseSettled

# ResponseSettled Type

```ts
type ResponseSettled<PackageKey, ChannelType> = Exclude<
	Response<PackageKey, ChannelType>,
	ResponseIndeterminate
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>
