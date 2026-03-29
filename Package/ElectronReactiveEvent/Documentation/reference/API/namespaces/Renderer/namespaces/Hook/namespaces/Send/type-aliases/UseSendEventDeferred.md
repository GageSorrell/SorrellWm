[electron-reactive-event](../../../../../../../../index.md) / [API](../../../../../../../index.md) / [Renderer](../../../../../index.md) / [Hook](../../../index.md) / [Send](../index.md) / UseSendEventDeferred

# Type: UseSendEventDeferred()

```ts
type UseSendEventDeferred<RendererRegistrar> = () => Readonly<[SendEventDeferred<RendererRegistrar>]>;
```

## Type Parameters

### RendererRegistrar

`RendererRegistrar` *extends* [`IRendererRegistrarBase`](../../../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

## Returns

`Readonly`\<\[[`SendEventDeferred`](../../../../Provider/namespaces/Send/namespaces/Deferred/namespaces/Function/type-aliases/SendEventDeferred.md)\<`RendererRegistrar`\>\]\>

The deferred form of [UseSendEvent](UseSendEvent.md).
