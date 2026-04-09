[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useOffEventDeferred

# useOffEventDeferred Function

```ts
function useOffEventDeferred<PackageKey>(): readonly [
	OffEventDeferred<PackageKey>,
];
```

Returns an [OffEventDeferred](../type-aliases/OffEventDeferred.md), to unsubscribe to `main` events when desired.

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

## Returns

readonly \[[`OffEventDeferred`](../type-aliases/OffEventDeferred.md)\<`PackageKey`\>\]

An [OffEventDeferred](../type-aliases/OffEventDeferred.md) function.

## Note

Both [UseOnEvent](../type-aliases/UseOnEvent.md) and [UseOnceEvent](../type-aliases/UseOnceEvent.md) both return callbacks
equivalent to this, but only for the event that is subscribed to by calling the
respective hook.
