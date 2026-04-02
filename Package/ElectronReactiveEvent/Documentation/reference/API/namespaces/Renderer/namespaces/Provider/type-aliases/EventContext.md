[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Renderer](../../../index.md) / [Provider](../index.md) / EventContext

# EventContext Type

```ts
type EventContext<MainRegistrar, RendererRegistrar> = Partial<{
	useEventCallback: Renderer<MainRegistrar>;
	useEventCallbackDeferred: UseEventCallbackDeferred<MainRegistrar>;
	useEventCallbacks: FactoryReturnType<
		MainRegistrar,
		RendererRegistrar
	>["registerCallbacks"];
	useEventCallbacksDeferred: UseEventCallbacksDeferred<MainRegistrar>;
	useSendEvent: UseSendEvent<RendererRegistrar>;
	useSendEventDeferred: UseSendEventDeferred<RendererRegistrar>;
	useUnregisterCallbackDeferred: UseUnregisterCallbackDeferred<MainRegistrar>;
	useUnregisterCallbacksDeferred: UseUnregisterCallbacksDeferred<MainRegistrar>;
}>;
```

## Type Parameters

### MainRegistrar

`MainRegistrar` _extends_ [`IMainRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

### RendererRegistrar

`RendererRegistrar` _extends_ [`IRendererRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)
