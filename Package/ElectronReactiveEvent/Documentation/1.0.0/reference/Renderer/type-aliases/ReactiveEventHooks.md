[electron-reactive-event](../../index.md) / [Renderer](../index.md) / ReactiveEventHooks

# ReactiveEventHooks Type

```ts
type ReactiveEventHooks<PackageKey> = Readonly<{
	useInvokeEvent: UseInvokeEvent<PackageKey>;
	useInvokeEventDeferred: UseInvokeEventDeferred<PackageKey>;
	useOffEventDeferred: UseOffEventDeferred<PackageKey>;
	useOnceEvent: UseOnceEvent<PackageKey>;
	useOnceEventDeferred: UseOnceEventDeferred<PackageKey>;
	useOnEvent: UseOnEvent<PackageKey>;
	useOnEventDeferred: UseOnEventDeferred<PackageKey>;
	useSendEvent: UseSendEvent<PackageKey>;
	useSendEventDeferred: UseSendEventDeferred<PackageKey>;
}>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)
