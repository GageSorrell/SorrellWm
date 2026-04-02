[electron-reactive-event](../../../../../../../../index.md) / [API](../../../../../../../index.md) / [Renderer](../../../../../index.md) / [Hook](../../../index.md) / [Register](../index.md) / UseEventCallbacksDeferred

# UseEventCallbacksDeferred() Type

```ts
type UseEventCallbacksDeferred<MainRegistrar> = () => Readonly<
	[Callback.RegisterFunction.ByRecord<MainRegistrar>]
>;
```

The deferred form of UseEventCallbacks.

## Type Parameters

### MainRegistrar

`MainRegistrar` _extends_ [`IMainRegistrarBase`](../../../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

## Returns

`Readonly`\<\[`Callback.RegisterFunction.ByRecord`\<`MainRegistrar`\>\]\>

A function equivalent to [Main.FactoryReturnType.registerCallbacks](../../../../../../Main/type-aliases/FactoryReturnType.md#registercallbacks).
