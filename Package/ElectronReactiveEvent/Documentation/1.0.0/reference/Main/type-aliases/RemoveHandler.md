[electron-reactive-event](../../index.md) / [Main](../index.md) / RemoveHandler

# RemoveHandler Type

```ts
type RemoveHandler<PackageKey> = <ChannelType>(channel) => void;
```

The type-safe form of
[IpcMain.removeHandler](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainremovehandlerchannel).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

Remove the handler (listener) of the given [channel](#type), if one exists.

## Type Parameters

### ChannelType

`ChannelType` _extends_ `never`

## Parameters

### channel

`ChannelType`

The [invokable channel](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md) that uniquely identifies
the event declaration from which the handler will be unsubscribed, if one exists.

## Returns

`void`
