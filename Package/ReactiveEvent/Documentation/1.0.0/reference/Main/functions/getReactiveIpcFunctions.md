[reactive-event](../../index.md) / [Main](../index.md) / getReactiveIpcFunctions

# getReactiveIpcFunctions Function

```ts
function getReactiveIpcFunctions<
	PackageKey,
>(): ReactiveEventFunctions<PackageKey>;
```

This is the entrypoint of `reactive-event` for `main`.

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

## Returns

[`ReactiveEventFunctions`](../type-aliases/ReactiveEventFunctions.md)\<`PackageKey`\>

Type-safe IPC functions for sending events from `main`.

## See

[getReactiveIpcMain](getReactiveIpcMain.md) for the same, but packaged with the
other event-emitter contents of [IpcMain](https://www.electronjs.org/docs/latest/api/ipc-main).
