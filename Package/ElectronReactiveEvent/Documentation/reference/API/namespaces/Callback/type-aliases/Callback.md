[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Callback](../index.md) / Callback

# Type: Callback

```ts
type Callback<ChannelType, Registrar> = Registrar extends IRendererRegistrarBase ? Main<ChannelType, Registrar> : Registrar extends IMainRegistrarBase ? Renderer<ChannelType, Registrar> : never;
```

A function that is given to `electron-reactive-event` via one of the `register`
functions or hooks.

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
