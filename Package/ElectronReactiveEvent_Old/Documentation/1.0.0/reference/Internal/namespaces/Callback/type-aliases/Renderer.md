[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Callback](../index.md) / Renderer

# Renderer() Type

```ts
type Renderer<ChannelType, Registrar> = (
	Argument,
) => ReturnType<ChannelType, Registrar>;
```

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../../../API/namespaces/Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../Registrar/interfaces/IRegistrarBase.md)

## Parameters

### Argument

[`Renderer`](../namespaces/Argument/type-aliases/Renderer.md)\<`ChannelType`, `Registrar`\>

## Returns

[`ReturnType`](../../../../API/namespaces/Callback/type-aliases/ReturnType.md)\<`ChannelType`, `Registrar`\>
