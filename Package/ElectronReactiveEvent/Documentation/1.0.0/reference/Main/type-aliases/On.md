[electron-reactive-event](../../index.md) / [Main](../index.md) / On

# On Type

```ts
type On<PackageKey> = <ChannelType>(channel, listener) => void;
```

The type-safe form of
[IpcMain.on](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

Subscribe a [listener](#type) to an event declaration given by [channel](#type),
which does _not_ return a response to the `renderer`.

## Type Parameters

### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

## Parameters

### channel

`ChannelType`

The [sendable channel](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md) that uniquely
identifies the sendable event to which the [listener](#type) will be subscribed.

### listener

[`MainListener`](MainListener.md)\<`PackageKey`, `ChannelType`\>

The [MainListener](MainListener.md) which will be subscribed to the given [channel](#type).

## Returns

`void`
