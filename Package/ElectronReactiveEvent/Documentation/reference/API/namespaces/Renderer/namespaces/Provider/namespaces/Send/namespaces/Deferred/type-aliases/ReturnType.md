[electron-reactive-event](../../../../../../../../../../index.md) / [API](../../../../../../../../../index.md) / [Renderer](../../../../../../../index.md) / [Provider](../../../../../index.md) / [Send](../../../index.md) / [Deferred](../index.md) / ReturnType

# ReturnType Type

```ts
type ReturnType<ChannelType, RendererRegistrar> = Omit<
	Response<ChannelType, RendererRegistrar>,
	"IsPending"
>;
```

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../../../../../../../Channel/type-aliases/Channel.md)\<`RendererRegistrar`\>

### RendererRegistrar

`RendererRegistrar` _extends_ [`IRendererRegistrarBase`](../../../../../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)
