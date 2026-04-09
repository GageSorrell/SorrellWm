[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / UseOnEventDeferred

# UseOnEventDeferred Type

```ts
type UseOnEventDeferred<PackageKey> = () => readonly [
	OnEventDeferred<PackageKey>,
];
```

Returns an [OnEventDeferred](OnEventDeferred.md), to subscribe to `main` events when desired.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Returns

readonly \[[`OnEventDeferred`](OnEventDeferred.md)\<`PackageKey`\>\]

An [OnEventDeferred](OnEventDeferred.md) function.
