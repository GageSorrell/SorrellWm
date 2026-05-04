[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / InvokeResponse

# InvokeResponse Type

```ts
type InvokeResponse<PackageKey, ChannelType, OptionsType> =
	OptionsType extends InvokeOptions<infer SuspendsType>
		? SuspendsType extends true
			? ResponseSync<PackageKey, ChannelType>
			: Response<PackageKey, ChannelType>
		: Response<PackageKey, ChannelType>;
```

The type returned by [useInvokeEvent](../functions/useInvokeEvent.md).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Any`](../../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.

### OptionsType

`OptionsType` _extends_ [`InvokeOptions`](InvokeOptions.md) \| `undefined`

The specific type of [InvokeOptions](InvokeOptions.md) passed
to the [useInvokeEvent](../functions/useInvokeEvent.md) call from which this response is produced.
The [suspend](InvokeOptions.md#suspend) property determines whether this
type will contain an `isPending` property.
