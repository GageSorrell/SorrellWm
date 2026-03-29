[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Callback](../../../index.md) / [RegisterFunction](../index.md) / Main

# Type: Main()

```ts
type Main<Registrar> = <ChannelType>(Channel, Callback) => void;
```

Register a given `main` callback function for a given channel.

## Type Parameters

### Registrar

`Registrar` *extends* [`IRendererRegistrarBase`](../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

The registrar interface that holds the desired event declaration.

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>

## Parameters

### Channel

`ChannelType`

The channel of the event declaration corresponding to the given `Callback`.

### Callback

[`Main`](../../../type-aliases/Main.md)\<`ChannelType`, `Registrar`\>

The callback function that will be called when an event of channel `Channel`
is received from the `renderer`.

## Returns

`void`
