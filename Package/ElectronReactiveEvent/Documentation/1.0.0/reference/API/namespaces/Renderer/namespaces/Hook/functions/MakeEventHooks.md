[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Renderer](../../../index.md) / [Hook](../index.md) / MakeEventHooks

# MakeEventHooks() Function

```ts
function MakeEventHooks<
	MainRegistrar,
	RendererRegistrar,
>(): Provider.EventHooks<MainRegistrar, RendererRegistrar>;
```

Call this once, and export its result a module, to use in components.

## Type Parameters

### MainRegistrar

`MainRegistrar` _extends_ [`IMainRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

### RendererRegistrar

`RendererRegistrar` _extends_ [`IRendererRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

## Returns

`Provider.EventHooks`\<`MainRegistrar`, `RendererRegistrar`\>
