[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Renderer](../../../index.md) / [Hook](../index.md) / MakeEventHooks

# Function: MakeEventHooks()

```ts
function MakeEventHooks<MainRegistrar, RendererRegistrar>(): EventHooks<MainRegistrar, RendererRegistrar>;
```

Call this once, and export its result a module, to use in components.

## Type Parameters

### MainRegistrar

`MainRegistrar` *extends* [`IMainRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

### RendererRegistrar

`RendererRegistrar` *extends* [`IRendererRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

## Returns

[`EventHooks`](../../Provider/type-aliases/EventHooks.md)\<`MainRegistrar`, `RendererRegistrar`\>
