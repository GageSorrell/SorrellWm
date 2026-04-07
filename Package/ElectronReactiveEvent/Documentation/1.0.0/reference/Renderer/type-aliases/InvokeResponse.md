[electron-reactive-event](../../index.md) / [Renderer](../index.md) / InvokeResponse

# InvokeResponse Type

```ts
type InvokeResponse<PackageKey, ChannelType, OptionsType> =
	OptionsType extends InvokeOptions<infer SuspendsType>
		? SuspendsType extends true
			? ResponseSync<PackageKey, ChannelType>
			: Response<PackageKey, ChannelType>
		: never;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>

### OptionsType

`OptionsType` _extends_ [`InvokeOptions`](InvokeOptions.md) \| `undefined`
