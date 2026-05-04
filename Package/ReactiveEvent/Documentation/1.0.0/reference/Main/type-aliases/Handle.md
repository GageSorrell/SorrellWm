[reactive-event](../../index.md) / [Main](../index.md) / Handle

# Handle Type

```ts
type Handle<PackageKey> = <ChannelType>(channel, listener) => void;
```

The type-safe form of
[IpcMain.handle](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

Subscribe a [listener](#type) to an event declaration given by [channel](#type),
which returns a response to the `renderer`.

## Type Parameters

### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

## Parameters

### channel

`ChannelType`

The [invokable channel](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md) that uniquely
identifies the invokable event to which the [listener](#type) will be subscribed.

### listener

[`Handler`](../../Listener/type-aliases/Handler.md)\<`PackageKey`, `ChannelType`\>

## Returns

`void`
