[electron-reactive-event](../../../../../../../../index.md) / [API](../../../../../../../index.md) / [Renderer](../../../../../index.md) / [Hook](../../../index.md) / [Register](../index.md) / UseEventCallbacksDeferred

# Type: UseEventCallbacksDeferred()

```ts
type UseEventCallbacksDeferred<MainRegistrar> = () => Readonly<[ByRecord<MainRegistrar>]>;
```

The deferred form of UseEventCallbacks.

## Type Parameters

### MainRegistrar

`MainRegistrar` *extends* [`IMainRegistrarBase`](../../../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

## Returns

`Readonly`\<\[[`ByRecord`](../../../../../../Callback/namespaces/RegisterFunction/type-aliases/ByRecord.md)\<`MainRegistrar`\>\]\>

A function equivalent to [Main.FactoryReturnType.registerCallbacks](../../../../../../Main/type-aliases/FactoryReturnType.md#registercallbacks).
