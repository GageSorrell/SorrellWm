[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Callback](../index.md) / Renderer

# Renderer() Type

```ts
type Renderer<ChannelType, Registrar> = (
	Argument,
) => ReturnType<ChannelType, Registrar>;
```

`RendererCallback`s live under the `renderer`, _i.e._, they receive `main` events.

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` _extends_ [`IMainRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

## Parameters

### Argument

[`Renderer`](../namespaces/Argument/type-aliases/Renderer.md)\<`ChannelType`, `Registrar`\>

## Returns

[`ReturnType`](ReturnType.md)\<`ChannelType`, `Registrar`\>
