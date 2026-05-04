[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / UseOffEventDeferred

# UseOffEventDeferred Type

```ts
type UseOffEventDeferred<PackageKey> = () => readonly [
	OffEventDeferred<PackageKey>,
];
```

Returns an [OffEventDeferred](OffEventDeferred.md), to unsubscribe to `main` events when desired.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Returns

readonly \[[`OffEventDeferred`](OffEventDeferred.md)\<`PackageKey`\>\]

An [OffEventDeferred](OffEventDeferred.md) function.

## Note

Both [UseOnEvent](UseOnEvent.md) and [UseOnceEvent](UseOnceEvent.md) both return callbacks
equivalent to this, but only for the event that is subscribed to by calling the
respective hook.
