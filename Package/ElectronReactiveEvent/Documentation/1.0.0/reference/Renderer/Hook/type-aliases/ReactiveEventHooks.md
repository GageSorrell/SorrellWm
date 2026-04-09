[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / ReactiveEventHooks

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

The object returned by [getReactiveEventHooks](../functions/getReactiveEventHooks.md), which contains all hooks provided
by `electron-reactive-event`. These are scoped to your [PackageKey](#packagekey).

It is recommended to call this once in a module of your project, and export them to be used
throughout your project.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.
