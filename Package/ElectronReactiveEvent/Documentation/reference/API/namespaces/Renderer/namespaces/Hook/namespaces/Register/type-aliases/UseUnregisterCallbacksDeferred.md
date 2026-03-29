[electron-reactive-event](../../../../../../../../index.md) / [API](../../../../../../../index.md) / [Renderer](../../../../../index.md) / [Hook](../../../index.md) / [Register](../index.md) / UseUnregisterCallbacksDeferred

# Type: UseUnregisterCallbacksDeferred()

```ts
type UseUnregisterCallbacksDeferred<MainRegistrar> = () => Readonly<[UnregisterRendererCallbacks<MainRegistrar>]>;
```

Unregister callbacks that were registered via [UseEventCallbacksDeferred](UseEventCallbacksDeferred.md).

## Type Parameters

### MainRegistrar

`MainRegistrar` *extends* [`IMainRegistrarBase`](../../../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

## Returns

`Readonly`\<\[[`UnregisterRendererCallbacks`](UnregisterRendererCallbacks.md)\<`MainRegistrar`\>\]\>

A function equivalent to [Main.FactoryReturnType.unregisterCallbacks](../../../../../../Main/type-aliases/FactoryReturnType.md#unregistercallbacks).

## Remarks

Callbacks that were registered via UseEventCallback or UseEventCallbacks
are unregistered for you when the containing component unmounts.  That is, you do *not*
need to unregister such events with this function (nor with UseUnregisterCallbacksDeferred).
