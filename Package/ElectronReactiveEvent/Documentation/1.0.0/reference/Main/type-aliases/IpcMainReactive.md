[electron-reactive-event](../../index.md) / [Main](../index.md) / IpcMainReactive

# IpcMainReactive Type

```ts
type IpcMainReactive<PackageKey> = Omit<
	IpcMain,
	keyof ReactiveEventFunctions<PackageKey>
> &
	ReactiveEventFunctions<PackageKey>;
```

The [IpcMain](https://www.electronjs.org/docs/latest/api/ipc-main) type, but with the type-safe IPC functions
given in [ReactiveEventFunctions](ReactiveEventFunctions.md).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.
