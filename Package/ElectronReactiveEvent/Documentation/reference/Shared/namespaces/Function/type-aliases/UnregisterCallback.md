[electron-reactive-event](../../../../index.md) / [Shared](../../../index.md) / [Function](../index.md) / UnregisterCallback

# Type: UnregisterCallback()

```ts
type UnregisterCallback<Registrar> = <ChannelType>(Channel, Callback) => void;
```

## Type Parameters

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../../../API/namespaces/Channel/type-aliases/Channel.md)\<`Registrar`\>

## Parameters

### Channel

`ChannelType`

### Callback

[`Callback`](../../../../API/namespaces/Callback/type-aliases/Callback.md)\<`ChannelType`, `Registrar`\>

## Returns

`void`
