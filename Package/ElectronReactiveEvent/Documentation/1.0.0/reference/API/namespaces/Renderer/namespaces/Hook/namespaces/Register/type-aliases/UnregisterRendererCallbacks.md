[electron-reactive-event](../../../../../../../../index.md) / [API](../../../../../../../index.md) / [Renderer](../../../../../index.md) / [Hook](../../../index.md) / [Register](../index.md) / UnregisterRendererCallbacks

# UnregisterRendererCallbacks Type

```ts
type UnregisterRendererCallbacks<Registrar> =
	Callback.RegisterFunction.ByRecord<Registrar>;
```

Unregister callbacks that were registered via [UseEventCallbacksDeferred](UseEventCallbacksDeferred.md).

## Type Parameters

### Registrar

`Registrar` _extends_ [`IMainRegistrarBase`](../../../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

## Remarks

Callbacks that were registered via UseEventCallback or UseEventCallbacks
are unregistered for you when the containing component unmounts. That is, you do _not_
need to unregister such events with this function (nor with [UseUnregisterCallbacksDeferred](UseUnregisterCallbacksDeferred.md)).
