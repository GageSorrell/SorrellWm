[electron-reactive-event](../../index.md) / [Main](../index.md) / ReactiveEventFunctions

# ReactiveEventFunctions Type

```ts
type ReactiveEventFunctions<PackageKey> = Readonly<{
	addListener: On<PackageKey>;
	handle: Handle<PackageKey>;
	handleOnce: HandleOnce<PackageKey>;
	off: Off<PackageKey>;
	on: On<PackageKey>;
	once: Once<PackageKey>;
	removeHandler: RemoveHandler<PackageKey>;
	removeListener: Off<PackageKey>;
	send: Send<PackageKey>;
}>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)
