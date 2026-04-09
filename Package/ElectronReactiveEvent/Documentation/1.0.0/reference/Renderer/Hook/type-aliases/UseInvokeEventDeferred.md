[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / UseInvokeEventDeferred

# UseInvokeEventDeferred Type

```ts
type UseInvokeEventDeferred<PackageKey> = () => readonly [
	InvokeEventDeferred<PackageKey>,
];
```

Returns a copy of [InvokeEventDeferred](InvokeEventDeferred.md), to invoke events at a desired time.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Returns

readonly \[[`InvokeEventDeferred`](InvokeEventDeferred.md)\<`PackageKey`\>\]

An [InvokeEventDeferred](InvokeEventDeferred.md) function.
