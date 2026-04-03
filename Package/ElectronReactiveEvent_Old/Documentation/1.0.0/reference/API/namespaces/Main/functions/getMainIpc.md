[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Main](../index.md) / getMainIpc

# getMainIpc() Function

```ts
function getMainIpc<MainRegistrar, RendererRegistrar>(): FactoryReturnType<
	MainRegistrar,
	RendererRegistrar
>;
```

Get the IPC functions for sending and receiving events to/from the `renderer`.
The returned functions are typed to your registrar interfaces.

## Type Parameters

### MainRegistrar

`MainRegistrar` _extends_ [`IMainRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

The event registrar for your `main` events.

### RendererRegistrar

`RendererRegistrar` _extends_ [`IRendererRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

The event registrar for your `renderer` events.

## Returns

[`FactoryReturnType`](../type-aliases/FactoryReturnType.md)\<`MainRegistrar`, `RendererRegistrar`\>

The IPC functions typed to your event registrars.

## See

[FactoryReturnType](../type-aliases/FactoryReturnType.md) for the function types returned by this function.
