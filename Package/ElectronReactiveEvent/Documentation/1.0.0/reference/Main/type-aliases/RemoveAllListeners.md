[electron-reactive-event](../../index.md) / [Main](../index.md) / RemoveAllListeners

# RemoveAllListeners Type

```ts
type RemoveAllListeners<PackageKey> = <ChannelType>(channel?) => void;
```

The type-safe form of
[IpcMain.removeAllListeners](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainremovealllistenerschannel).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

Remove all listeners of the given [channel](#type).
If no [channel](#type) is specified, then _all_ listeners of all channels
will be unsubscribed.

## Type Parameters

### ChannelType

`ChannelType` _extends_ `never`

## Parameters

### channel?

`ChannelType`

The [sendable channel](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md) that uniquely identifies
the event declaration from which all currently-subscribed listeners will be unsubscribed.

## Returns

`void`
