[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Renderer](../../../index.md) / [Provider](../index.md) / EventContext

# Type: EventContext

```ts
type EventContext<MainRegistrar, RendererRegistrar> = Partial<{
  useEventCallback: Renderer<MainRegistrar>;
  useEventCallbackDeferred: UseEventCallbackDeferred<MainRegistrar>;
  useEventCallbacks: ByRecord<MainRegistrar>;
  useEventCallbacksDeferred: UseEventCallbacksDeferred<MainRegistrar>;
  useSendEvent: UseSendEvent<RendererRegistrar>;
  useSendEventDeferred: UseSendEventDeferred<RendererRegistrar>;
  useUnregisterCallbackDeferred: UseUnregisterCallbackDeferred<MainRegistrar>;
  useUnregisterCallbacksDeferred: UseUnregisterCallbacksDeferred<MainRegistrar>;
}>;
```

## Type Parameters

### MainRegistrar

`MainRegistrar` *extends* [`IMainRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

### RendererRegistrar

`RendererRegistrar` *extends* [`IRendererRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)
