[electron-reactive-event](../../../../../../../../index.md) / [API](../../../../../../../index.md) / [Renderer](../../../../../index.md) / [Hook](../../../index.md) / [Register](../index.md) / UseUnregisterCallbacksDeferred

# UseUnregisterCallbacksDeferred() Type

```ts
type UseUnregisterCallbacksDeferred<MainRegistrar> = () => Readonly<
	[UnregisterRendererCallbacks<MainRegistrar>]
>;
```

Unregister callbacks that were registered via [UseEventCallbacksDeferred](UseEventCallbacksDeferred.md).

## Type Parameters

### MainRegistrar

`MainRegistrar` _extends_ [`IMainRegistrarBase`](../../../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

## Returns

`Readonly`\<\[[`UnregisterRendererCallbacks`](UnregisterRendererCallbacks.md)\<`MainRegistrar`\>\]\>

A function equivalent to [Main.FactoryReturnType.unregisterCallbacks](../../../../../../Main/type-aliases/FactoryReturnType.md#unregistercallbacks).

## Remarks

Callbacks that were registered via UseEventCallback or UseEventCallbacks
are unregistered for you when the containing component unmounts. That is, you do _not_
need to unregister such events with this function (nor with UseUnregisterCallbacksDeferred).
