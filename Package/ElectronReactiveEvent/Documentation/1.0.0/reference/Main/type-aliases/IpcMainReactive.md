[electron-reactive-event](../../index.md) / [Main](../index.md) / IpcMainReactive

# IpcMainReactive Type

```ts
type IpcMainReactive<PackageKey> = Omit<
	IpcMain,
	keyof ReactiveEventFunctions<PackageKey>
> &
	ReactiveEventFunctions<PackageKey>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)
