[reactive-event](../../index.md) / [Main](../index.md) / Once

# Once Type

```ts
type Once<PackageKey> = <ChannelType>(channel, listener) => void;
```

The type-safe form of
[IpcMain.once](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainoncechannel-listener).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

Subscribe a [listener](#type) to an event declaration given by [channel](#type),
which does _not_ return a response to the `renderer`. The [listener](#type)
will be unsubscribed after it is called once.

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
