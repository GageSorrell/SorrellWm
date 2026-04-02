[electron-reactive-event](../../../../../../../../index.md) / [API](../../../../../../../index.md) / [Renderer](../../../../../index.md) / [Hook](../../../index.md) / [Send](../index.md) / UseSendEventReturn

# UseSendEventReturn Type

```ts
type UseSendEventReturn<ChannelType, RendererRegistrar> =
	ResponseDeclKey extends keyof RendererRegistrar[ChannelType]
		? EmptyEventParameter extends RendererRegistrar[ChannelType][ResponseDeclKey]
			? Response<ChannelType, RendererRegistrar> & object
			: Response<ChannelType, RendererRegistrar> & object
		: never;
```

UseUnregisterCallbacksDeferred

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../../../../../Channel/type-aliases/Channel.md)\<`RendererRegistrar`\>

### RendererRegistrar

`RendererRegistrar` _extends_ [`IRendererRegistrarBase`](../../../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)
