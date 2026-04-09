[electron-reactive-event](../../index.md) / [Main](../index.md) / getReactiveIpcMain

# getReactiveIpcMain Function

```ts
function getReactiveIpcMain<PackageKey>(): IpcMainReactive<PackageKey>;
```

Get an object that replaces [IpcMain's](https://www.electronjs.org/docs/latest/api/ipc-main)
IPC functions with their respective `electron-reactive-event`, type-safe counterparts.

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

## Returns

[`IpcMainReactive`](../type-aliases/IpcMainReactive.md)\<`PackageKey`\>

An object that replaces [IpcMain's](https://www.electronjs.org/docs/latest/api/ipc-main)
IPC functions with their respective `electron-reactive-event`, type-safe counterparts.
