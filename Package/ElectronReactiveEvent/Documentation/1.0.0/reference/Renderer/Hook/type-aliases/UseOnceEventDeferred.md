[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / UseOnceEventDeferred

# UseOnceEventDeferred Type

```ts
type UseOnceEventDeferred<PackageKey> = () => readonly [
	OnceEventDeferred<PackageKey>,
];
```

Returns an [OnceEventDeferred](OnceEventDeferred.md), to subscribe to `main` events when desired.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Returns

readonly \[[`OnceEventDeferred`](OnceEventDeferred.md)\<`PackageKey`\>\]

A [OnceEventDeferred](OnceEventDeferred.md) function.
