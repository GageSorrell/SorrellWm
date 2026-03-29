[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Callback](../index.md) / Renderer

# Type Alias: Renderer()\<ChannelType, Registrar\>

```ts
type Renderer<ChannelType, Registrar> = (Argument) => ReturnType<ChannelType, Registrar>;
```

`RendererCallback`s live under the `renderer`, *i.e.*, they receive `main` events.

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` *extends* [`IMainRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

## Parameters

### Argument

[`Renderer`](../namespaces/Argument/type-aliases/Renderer.md)\<`ChannelType`, `Registrar`\>

## Returns

[`ReturnType`](ReturnType.md)\<`ChannelType`, `Registrar`\>
