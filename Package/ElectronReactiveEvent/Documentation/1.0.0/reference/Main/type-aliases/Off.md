[electron-reactive-event](../../index.md) / [Main](../index.md) / Off

# Off Type

```ts
type Off<PackageKey> = <ChannelType>(channel, listener) => void;
```

The type-safe form of
[IpcMain.off](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainoffchannel-listener).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

Unsubscribe a [listener](#type) from an event declaration given by [channel](#type).

## Type Parameters

### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired event declaration.

## Parameters

### channel

`ChannelType`

The [sendable channel](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md) that uniquely
identifies the sendable event to which the [listener](#type) will be subscribed.

### listener

[`MainListener`](MainListener.md)\<`PackageKey`, `ChannelType`\>

The [MainListener](MainListener.md) which will be unsubscribed from the given
[channel](#type).

## Returns

`void`
