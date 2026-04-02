[electron-reactive-event](../../../../../../../../index.md) / [API](../../../../../../../index.md) / [Renderer](../../../../../index.md) / [Hook](../../../index.md) / [Register](../index.md) / UseUnregisterCallbackDeferred

# UseUnregisterCallbackDeferred() Type

```ts
type UseUnregisterCallbackDeferred<MainRegistrar> = () => Readonly<
	[UnregisterCallback<MainRegistrar>]
>;
```

Unregister callbacks that were registered via [UseEventCallbackDeferred](UseEventCallbackDeferred.md).

## Type Parameters

### MainRegistrar

`MainRegistrar` _extends_ [`IMainRegistrarBase`](../../../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

## Returns

`Readonly`\<\[[`UnregisterCallback`](../../../../../../../../Shared/namespaces/Function/type-aliases/UnregisterCallback.md)\<`MainRegistrar`\>\]\>

A function equivalent to [Main.FactoryReturnType.unregisterCallback](../../../../../../Main/type-aliases/FactoryReturnType.md#unregistercallback).

## Remarks

Callbacks that were registered via UseEventCallback or UseEventCallbacks
are unregistered for you when the containing component unmounts. That is, you do _not_
need to unregister such events with this function (nor with [UseUnregisterCallbacksDeferred](UseUnregisterCallbacksDeferred.md)).
