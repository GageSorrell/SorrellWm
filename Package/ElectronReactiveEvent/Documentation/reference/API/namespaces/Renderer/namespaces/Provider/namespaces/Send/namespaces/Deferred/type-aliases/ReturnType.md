[electron-reactive-event](../../../../../../../../../../index.md) / [API](../../../../../../../../../index.md) / [Renderer](../../../../../../../index.md) / [Provider](../../../../../index.md) / [Send](../../../index.md) / [Deferred](../index.md) / ReturnType

# Type: ReturnType

```ts
type ReturnType<ChannelType, RendererRegistrar> = Omit<Response<ChannelType, RendererRegistrar>, "IsPending">;
```

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../../../../../../../Channel/type-aliases/Channel.md)\<`RendererRegistrar`\>

### RendererRegistrar

`RendererRegistrar` *extends* [`IRendererRegistrarBase`](../../../../../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)
