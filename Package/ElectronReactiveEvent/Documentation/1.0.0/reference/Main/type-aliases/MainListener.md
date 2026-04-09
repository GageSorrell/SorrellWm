[electron-reactive-event](../../index.md) / [Main](../index.md) / MainListener

# MainListener Type

```ts
type MainListener<PackageKey, ChannelType> = Listener<
	PackageKey,
	RendererOwner,
	IpcMainEvent,
	ChannelType
>;
```

The type-safe type of the listener passed to IpcMainReactive.on _et al._
[IpcMain.on](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener)
_et al._

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md)\<`PackageKey`, [`RendererOwner`](../../Decl/type-aliases/RendererOwner.md)\>
