[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useOnceEventDeferred

# useOnceEventDeferred Function

```ts
function useOnceEventDeferred<PackageKey>(): readonly [
	OnceEventDeferred<PackageKey>,
];
```

Returns an [OnceEventDeferred](../type-aliases/OnceEventDeferred.md), to subscribe to `main` events when desired.

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

## Returns

readonly \[[`OnceEventDeferred`](../type-aliases/OnceEventDeferred.md)\<`PackageKey`\>\]

A [OnceEventDeferred](../type-aliases/OnceEventDeferred.md) function.
