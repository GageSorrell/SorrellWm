[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Callback](../../../index.md) / [RegisterFunction](../index.md) / Renderer

# Type: Renderer()

```ts
type Renderer<Registrar> = <ChannelType>(Channel, Callback) => void;
```

Register a given `renderer` callback function for a given channel.

## Type Parameters

### Registrar

`Registrar` *extends* [`IMainRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

The registrar interface that holds the desired event declaration.

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>

## Parameters

### Channel

`ChannelType`

The channel of the event declaration corresponding to the given `Callback`.

### Callback

[`Renderer`](../../../type-aliases/Renderer.md)\<`ChannelType`, `Registrar`\>

The callback function that will be called when an event of channel `Channel`
is received from `main`.

## Returns

`void`
