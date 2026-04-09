[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / InvokeResponseInternal

# InvokeResponseInternal Type

```ts
type InvokeResponseInternal<
	PackageKey,
	ChannelType,
	RequestOrOptionsType,
	OptionsType,
> = InvokeResponse<
	PackageKey,
	ChannelType,
	OptionsFromOverload<
		PackageKey,
		ChannelType,
		RequestOrOptionsType,
		OptionsType
	>
>;
```

An extension of [InvokeResponse](InvokeResponse.md) that is equipped to handle
the overloaded (private) signature of [useInvokeEvent](../functions/useInvokeEvent.md).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Any`](../../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.

### RequestOrOptionsType

`RequestOrOptionsType` _extends_
\| [`Request`](../../../Listener/type-aliases/Request.md)\<`PackageKey`, [`RendererOwner`](../../../Decl/type-aliases/RendererOwner.md), `ChannelType`\>
\| [`InvokeOptions`](InvokeOptions.md)
\| [`EmptyOverloadParameter`](../../../Listener/type-aliases/EmptyOverloadParameter.md)

The overloaded type for the second argument.

### OptionsType

`OptionsType` _extends_
\| [`InvokeOptions`](InvokeOptions.md)
\| [`EmptyOverloadParameter`](../../../Listener/type-aliases/EmptyOverloadParameter.md)

The overloaded type for the third argument.
