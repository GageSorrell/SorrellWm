[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Renderer](../../../index.md) / [Provider](../index.md) / GetReactiveEventProvider

# GetReactiveEventProvider() Function

```ts
function GetReactiveEventProvider<
	MainRegistrar,
	RendererRegistrar,
>(): ReactiveEventProviderComponent;
```

The main provider for `electron-reactive-event`. You likely want to wrap this with your own
provider in which you provide a `value` containing the `ipcRenderer` functions that you exposed
via `exposeInMainWorld`.

## Type Parameters

### MainRegistrar

`MainRegistrar` _extends_ [`IMainRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

### RendererRegistrar

`RendererRegistrar` _extends_ [`IRendererRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

## Returns

[`ReactiveEventProviderComponent`](../type-aliases/ReactiveEventProviderComponent.md)
