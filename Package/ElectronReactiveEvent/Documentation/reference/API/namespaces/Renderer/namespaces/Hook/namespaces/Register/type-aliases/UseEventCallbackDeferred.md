[electron-reactive-event](../../../../../../../../index.md) / [API](../../../../../../../index.md) / [Renderer](../../../../../index.md) / [Hook](../../../index.md) / [Register](../index.md) / UseEventCallbackDeferred

# Type: UseEventCallbackDeferred()

```ts
type UseEventCallbackDeferred<MainRegistrar> = () => Readonly<[Renderer<MainRegistrar>]>;
```

The deferred form of UseEventCallback.

## Type Parameters

### MainRegistrar

`MainRegistrar` *extends* [`IMainRegistrarBase`](../../../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

## Returns

`Readonly`\<\[[`Renderer`](../../../../../../Callback/namespaces/RegisterFunction/type-aliases/Renderer.md)\<`MainRegistrar`\>\]\>
