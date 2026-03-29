[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Callback](../index.md) / Main

# Type Alias: Main()\<ChannelType, Registrar\>

```ts
type Main<ChannelType, Registrar> = (Argument) => ReturnType<ChannelType, Registrar>;
```

`MainCallback`s live under `main`, *i.e.*, they receive `renderer` events.

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` *extends* [`IRendererRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

## Parameters

### Argument

[`Main`](../namespaces/Argument/type-aliases/Main.md)\<`ChannelType`, `Registrar`\>

## Returns

[`ReturnType`](ReturnType.md)\<`ChannelType`, `Registrar`\>
